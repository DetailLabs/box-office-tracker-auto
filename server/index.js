const express = require('express');
const path = require('path');
const fs = require('fs');
const { startCron, getNextRun } = require('./cron');

const app = express();
const PORT = process.env.PORT || 3001;
const DATA_DIR = path.join(__dirname, '..', 'data');

let lastRefresh = null;
let refreshInProgress = false;

// Parse JSON body for POST requests
app.use(express.json());

// API: Get weekends data
app.get('/api/weekends', (req, res) => {
  const file = path.join(DATA_DIR, 'weekends.json');
  if (!fs.existsSync(file)) {
    return res.status(503).json({ error: 'Data not yet available. Refresh in progress.' });
  }
  res.setHeader('Cache-Control', 'public, max-age=300');
  res.sendFile(file);
});

// API: Get trend data
app.get('/api/trends', (req, res) => {
  const file = path.join(DATA_DIR, 'trendData.json');
  if (!fs.existsSync(file)) {
    return res.status(503).json({ error: 'Data not yet available.' });
  }
  res.setHeader('Cache-Control', 'public, max-age=300');
  res.sendFile(file);
});

// API: Status
app.get('/api/status', (req, res) => {
  res.json({
    lastRefresh,
    nextRefresh: getNextRun(),
    refreshInProgress,
  });
});

// API: Manual refresh
app.post('/api/refresh', async (req, res) => {
  const secret = process.env.REFRESH_SECRET;
  if (secret) {
    const auth = req.headers.authorization;
    if (!auth || auth !== `Bearer ${secret}`) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
  }

  if (refreshInProgress) {
    return res.status(409).json({ error: 'Refresh already in progress' });
  }

  res.status(202).json({ message: 'Refresh started' });

  // Run refresh asynchronously
  refreshInProgress = true;
  try {
    const { refreshAll } = require('./refresh');
    await refreshAll();
    lastRefresh = new Date().toISOString();
    console.log(`[REFRESH] Manual refresh completed at ${lastRefresh}`);
  } catch (err) {
    console.error('[REFRESH] Manual refresh failed:', err.message);
  } finally {
    refreshInProgress = false;
  }
});

// Serve React build
const buildPath = path.join(__dirname, '..', 'build');
app.use(express.static(buildPath));

// SPA fallback
app.get('*', (req, res) => {
  res.sendFile(path.join(buildPath, 'index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`[SERVER] Box Office Tracker running on port ${PORT}`);

  // Start cron scheduler
  startCron((timestamp) => {
    lastRefresh = timestamp;
  });

  // Check if data exists, if not trigger initial refresh
  const weekendsFile = path.join(DATA_DIR, 'weekends.json');
  if (!fs.existsSync(weekendsFile)) {
    console.log('[SERVER] No data found, triggering initial refresh...');
    refreshInProgress = true;
    const { refreshAll } = require('./refresh');
    refreshAll()
      .then(() => {
        lastRefresh = new Date().toISOString();
        console.log('[SERVER] Initial refresh completed');
      })
      .catch(err => console.error('[SERVER] Initial refresh failed:', err.message))
      .finally(() => { refreshInProgress = false; });
  } else {
    // Read last modified time as lastRefresh
    const stat = fs.statSync(weekendsFile);
    lastRefresh = stat.mtime.toISOString();
    console.log(`[SERVER] Data loaded (last updated: ${lastRefresh})`);
  }
});
