/**
 * Calculate ISO week number for a given date.
 */
function getISOWeekNumber(date) {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil(((d - yearStart) / 86400000 + 1) / 7);
}

/**
 * Get the BOM weekend URL for the current week.
 */
function getBOMWeekendURL(date = new Date()) {
  const week = getISOWeekNumber(date);
  const year = date.getFullYear();
  return `https://www.boxofficemojo.com/weekend/${year}W${week}/`;
}

/**
 * Get the weekend label (e.g., "April 3–5, 2026") for the Friday-Sunday
 * of the current ISO week.
 */
function getWeekendLabel(date = new Date()) {
  // Find Friday of this week (BOM weekends are Fri-Sun)
  const d = new Date(date);
  const day = d.getDay();
  // If Sunday (0), Friday was 2 days ago
  // If Saturday (6), Friday was 1 day ago
  // If Friday (5), it's today
  const daysToFriday = day === 0 ? -2 : day === 6 ? -1 : 5 - day;
  const friday = new Date(d);
  friday.setDate(d.getDate() + daysToFriday);
  const sunday = new Date(friday);
  sunday.setDate(friday.getDate() + 2);

  const months = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];

  if (friday.getMonth() === sunday.getMonth()) {
    return `${months[friday.getMonth()]} ${friday.getDate()}–${sunday.getDate()}, ${sunday.getFullYear()}`;
  } else {
    return `${months[friday.getMonth()]} ${friday.getDate()} – ${months[sunday.getMonth()]} ${sunday.getDate()}, ${sunday.getFullYear()}`;
  }
}

/**
 * Get the weekend ID (e.g., "2026-04-03") for the Friday of the current week.
 */
function getWeekendId(date = new Date()) {
  const d = new Date(date);
  const day = d.getDay();
  const daysToFriday = day === 0 ? -2 : day === 6 ? -1 : 5 - day;
  const friday = new Date(d);
  friday.setDate(d.getDate() + daysToFriday);
  return friday.toISOString().split('T')[0];
}

/**
 * Generate a Rotten Tomatoes URL slug from a movie title.
 * e.g., "The Super Mario Galaxy Movie" -> "the_super_mario_galaxy_movie"
 */
function generateRTSlug(title) {
  return title
    .toLowerCase()
    .replace(/['']/g, '')        // Remove apostrophes
    .replace(/[^a-z0-9\s]/g, '') // Remove special chars
    .replace(/\s+/g, '_')        // Spaces to underscores
    .replace(/_+/g, '_')         // Collapse multiple underscores
    .replace(/^_|_$/g, '');      // Trim underscores
}

/**
 * Parse a money string like "$130,940,000" to a number.
 */
function parseMoney(str) {
  if (!str) return 0;
  return parseInt(str.replace(/[$,]/g, ''), 10) || 0;
}

/**
 * Parse a percentage string like "-43.3%" to a number.
 */
function parsePercent(str) {
  if (!str || str === '-' || str === 'N/A') return null;
  const num = parseFloat(str.replace(/[%,]/g, ''));
  return isNaN(num) ? null : Math.round(num);
}

/**
 * Sleep for ms milliseconds.
 */
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

module.exports = {
  getISOWeekNumber,
  getBOMWeekendURL,
  getWeekendLabel,
  getWeekendId,
  generateRTSlug,
  parseMoney,
  parsePercent,
  sleep,
};
