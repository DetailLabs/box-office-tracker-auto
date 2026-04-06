const fs = require('fs');
const path = require('path');
const { scrapeWeekend } = require('./scrapers/bom');
const { getMovieDetails } = require('./scrapers/tmdb');
const { getScoresAndReviews } = require('./scrapers/rottentomatoes');
const { getWeekendLabel, getWeekendId } = require('./utils');

const DATA_DIR = path.join(__dirname, '..', 'data');
const WEEKENDS_FILE = path.join(DATA_DIR, 'weekends.json');
const TRENDS_FILE = path.join(DATA_DIR, 'trendData.json');
const MAX_WEEKENDS = 14;

/**
 * Full refresh pipeline:
 * 1. Scrape BOM for current weekend
 * 2. Enrich with TMDB (poster, runtime, genre, rating)
 * 3. Enrich with RT (scores, reviews)
 * 4. Merge into complete movie objects
 * 5. Update weekends.json and trendData.json
 */
async function refreshAll() {
  console.log('[REFRESH] Starting full refresh...');
  const now = new Date();

  // Step 1: Scrape BOM
  console.log('[REFRESH] Step 1/4: Scraping Box Office Mojo...');
  const bomMovies = await scrapeWeekend(now);

  if (bomMovies.length === 0) {
    throw new Error('BOM returned 0 movies — scraping may have failed');
  }

  const titles = bomMovies.map(m => m.title);

  // Step 2: Get TMDB details
  console.log('[REFRESH] Step 2/4: Fetching TMDB details...');
  const tmdbData = await getMovieDetails(titles);

  // Step 3: Get RT scores and reviews
  console.log('[REFRESH] Step 3/4: Fetching RT scores and reviews...');
  const rtData = await getScoresAndReviews(titles);

  // Step 4: Merge into complete movie objects
  console.log('[REFRESH] Step 4/4: Merging and saving data...');
  const movies = bomMovies.map(bom => {
    const tmdb = tmdbData[bom.title] || {};
    const rt = rtData[bom.title] || {};

    return {
      rank: bom.rank,
      title: bom.title,
      runtime: tmdb.runtime || null,
      studio: bom.studio || null,
      weekend: bom.weekend,
      total: bom.total,
      worldwide: bom.worldwide || bom.total,
      weeks: bom.weeks,
      change: bom.change,
      theaters: bom.theaters,
      poster: tmdb.poster || 'https://image.tmdb.org/t/p/w500/placeholder.jpg',
      rating: tmdb.rating || null,
      genre: tmdb.genre || null,
      rt: {
        critics: rt.critics || null,
        audience: rt.audience || null,
      },
      imdb: tmdb.imdb || null,
      boxofficemojo: bom.boxofficemojo || null,
      rottentomatoes: rt.rottentomatoes || null,
      reviews: rt.reviews || [],
    };
  });

  // Load existing data (needed for review carry-forward)
  let weekends = [];
  if (fs.existsSync(WEEKENDS_FILE)) {
    try {
      weekends = JSON.parse(fs.readFileSync(WEEKENDS_FILE, 'utf8'));
    } catch (e) {
      console.warn('[REFRESH] Could not parse existing weekends.json, starting fresh');
      weekends = [];
    }
  }

  // Carry forward reviews from previous weekends if the current scrape has fewer
  // Build a map of title -> best reviews across all existing weekends
  const prevBestReviews = {};
  for (const w of weekends) {
    for (const m of w.movies) {
      const existing = prevBestReviews[m.title];
      const reviews = m.reviews || [];
      if (!existing || reviews.length > existing.length) {
        prevBestReviews[m.title] = reviews;
      }
    }
  }

  for (const movie of movies) {
    const currentReviews = movie.reviews || [];
    const prev = prevBestReviews[movie.title];
    if (currentReviews.length < 3 && prev && prev.length > currentReviews.length) {
      movie.reviews = prev;
      console.log(`[REFRESH] Carried forward ${prev.length} reviews for "${movie.title}" (scrape had ${currentReviews.length})`);
    }
  }

  // Build new weekend entry
  const weekendEntry = {
    id: getWeekendId(now),
    label: getWeekendLabel(now),
    movies,
  };

  // Check if this weekend already exists (avoid duplicates)
  const existingIdx = weekends.findIndex(w => w.id === weekendEntry.id);
  if (existingIdx >= 0) {
    weekends[existingIdx] = weekendEntry; // Replace existing
    console.log(`[REFRESH] Updated existing weekend: ${weekendEntry.label}`);
  } else {
    weekends.unshift(weekendEntry); // Prepend new
    console.log(`[REFRESH] Added new weekend: ${weekendEntry.label}`);
  }

  // Trim to MAX_WEEKENDS
  if (weekends.length > MAX_WEEKENDS) {
    weekends = weekends.slice(0, MAX_WEEKENDS);
  }

  // Update trend data
  let trendData = {};
  if (fs.existsSync(TRENDS_FILE)) {
    try {
      trendData = JSON.parse(fs.readFileSync(TRENDS_FILE, 'utf8'));
    } catch (e) {
      trendData = {};
    }
  }

  for (const movie of movies) {
    const key = movie.title;
    if (!trendData[key]) {
      trendData[key] = { domestic: [], worldwide: [] };
    }

    const domesticM = +(movie.weekend / 1_000_000).toFixed(1);
    const worldwideM = movie.worldwide
      ? +(movie.worldwide / 1_000_000).toFixed(1)
      : domesticM;

    // Only append if this is a new data point (avoid duplicates on re-run)
    const expectedLength = movie.weeks;
    if (trendData[key].domestic.length < expectedLength) {
      trendData[key].domestic.push(domesticM);
      trendData[key].worldwide.push(worldwideM);
    } else if (trendData[key].domestic.length === expectedLength) {
      // Update the latest entry (re-run for same weekend)
      trendData[key].domestic[expectedLength - 1] = domesticM;
      trendData[key].worldwide[expectedLength - 1] = worldwideM;
    }
  }

  // Write atomically
  ensureDir(DATA_DIR);
  writeAtomic(WEEKENDS_FILE, JSON.stringify(weekends, null, 2));
  writeAtomic(TRENDS_FILE, JSON.stringify(trendData, null, 2));

  console.log(`[REFRESH] Complete! ${movies.length} movies saved for ${weekendEntry.label}`);
  return weekendEntry;
}

function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function writeAtomic(filePath, content) {
  const tmpPath = filePath + '.tmp';
  fs.writeFileSync(tmpPath, content, 'utf8');
  fs.renameSync(tmpPath, filePath);
}

module.exports = { refreshAll };
