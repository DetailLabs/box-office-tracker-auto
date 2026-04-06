const cron = require('node-cron');

let nextRunTime = null;

function startCron(onComplete) {
  // Every Sunday at 3:00 PM Eastern Time
  const job = cron.schedule('0 15 * * 0', async () => {
    console.log('[CRON] Scheduled refresh triggered');
    try {
      const { refreshAll } = require('./refresh');
      await refreshAll();
      const timestamp = new Date().toISOString();
      console.log(`[CRON] Refresh completed at ${timestamp}`);
      if (onComplete) onComplete(timestamp);
    } catch (err) {
      console.error('[CRON] Refresh failed:', err.message);
    }
  }, {
    timezone: 'America/New_York',
  });

  // Calculate next run
  updateNextRun();

  console.log('[CRON] Scheduled: every Sunday at 3:00 PM EST');
  return job;
}

function updateNextRun() {
  const now = new Date();
  const next = new Date(now);

  // Find next Sunday
  const daysUntilSunday = (7 - now.getDay()) % 7;
  if (daysUntilSunday === 0) {
    // It's Sunday — check if 3pm EST has passed
    const estOffset = getESTOffset(now);
    const estHour = now.getUTCHours() + estOffset / 60;
    if (estHour >= 15) {
      next.setDate(next.getDate() + 7);
    }
  } else {
    next.setDate(next.getDate() + daysUntilSunday);
  }

  // Set to 3pm EST (convert to UTC)
  const estOffset = getESTOffset(next);
  next.setUTCHours(15 - estOffset / 60, 0, 0, 0);

  nextRunTime = next.toISOString();
}

function getESTOffset(date) {
  // EST is UTC-5, EDT is UTC-4
  // EDT: second Sunday of March to first Sunday of November
  const year = date.getFullYear();
  const marchSecondSunday = new Date(year, 2, 1);
  marchSecondSunday.setDate(marchSecondSunday.getDate() + ((7 - marchSecondSunday.getDay()) % 7) + 7);
  const novFirstSunday = new Date(year, 10, 1);
  novFirstSunday.setDate(novFirstSunday.getDate() + ((7 - novFirstSunday.getDay()) % 7));

  if (date >= marchSecondSunday && date < novFirstSunday) {
    return -240; // EDT: UTC-4 in minutes
  }
  return -300; // EST: UTC-5 in minutes
}

function getNextRun() {
  if (!nextRunTime) updateNextRun();
  return nextRunTime;
}

module.exports = { startCron, getNextRun };
