/**
 * One-off script: re-scrape available weekends from BOM, TMDB, and RT.
 * Preserves existing data for weekends BOM no longer serves (404).
 * Usage: TMDB_API_KEY=xxx node server/bulk-refresh.js
 */
const fs = require('fs');
const path = require('path');
const { scrapeWeekend } = require('./scrapers/bom');
const { getMovieDetails } = require('./scrapers/tmdb');
const { getScoresAndReviews } = require('./scrapers/rottentomatoes');
const { getWeekendLabel, getWeekendId, sleep } = require('./utils');

const DATA_DIR = path.join(__dirname, '..', 'data');
const WEEKENDS_FILE = path.join(DATA_DIR, 'weekends.json');
const TRENDS_FILE = path.join(DATA_DIR, 'trendData.json');

// All 14 Fridays (one per weekend) from newest to oldest
const WEEKEND_DATES = [
  '2026-04-03', '2026-03-27', '2026-03-20', '2026-03-13', '2026-03-06',
  '2026-02-27', '2026-02-20', '2026-02-13', '2026-02-06', '2026-01-30',
  '2026-01-23', '2026-01-16', '2026-01-09', '2026-01-02',
];

async function refreshWeekend(dateStr) {
  const date = new Date(dateStr + 'T12:00:00');
  console.log(`\n=== Refreshing ${dateStr} ===`);

  // Step 1: Scrape BOM
  console.log('  [1/3] Scraping BOM...');
  const bomMovies = await scrapeWeekend(date);
  if (bomMovies.length === 0) {
    return null;
  }

  const titles = bomMovies.map(m => m.title);

  // Step 2: TMDB
  console.log(`  [2/3] Fetching TMDB for ${titles.length} titles...`);
  const tmdbData = await getMovieDetails(titles);

  // Step 3: RT
  console.log(`  [3/3] Fetching RT for ${titles.length} titles...`);
  const rtData = await getScoresAndReviews(titles);

  // Merge
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
      rt: { critics: rt.critics || null, audience: rt.audience || null },
      imdb: tmdb.imdb || null,
      boxofficemojo: bom.boxofficemojo || null,
      rottentomatoes: rt.rottentomatoes || null,
      reviews: rt.reviews || [],
    };
  });

  return {
    id: getWeekendId(date),
    label: getWeekendLabel(date),
    movies,
  };
}

async function main() {
  // Load existing data to preserve weekends BOM can't serve
  let existingWeekends = [];
  if (fs.existsSync(WEEKENDS_FILE)) {
    try {
      existingWeekends = JSON.parse(fs.readFileSync(WEEKENDS_FILE, 'utf8'));
    } catch (e) { /* start fresh */ }
  }
  const existingMap = {};
  for (const w of existingWeekends) {
    existingMap[w.id] = w;
  }

  console.log(`Bulk refresh: ${WEEKEND_DATES.length} weekends, ${existingWeekends.length} existing`);
  const startTime = Date.now();

  let refreshedCount = 0;
  let preservedCount = 0;

  // Process oldest first so trend arrays build up correctly
  for (const dateStr of [...WEEKEND_DATES].reverse()) {
    try {
      const entry = await refreshWeekend(dateStr);
      if (entry) {
        existingMap[entry.id] = entry;
        refreshedCount++;
      } else {
        // BOM returned nothing (404) — keep existing data
        if (existingMap[dateStr]) {
          preservedCount++;
          console.log(`  Preserved existing data for ${dateStr}`);
        } else {
          console.log(`  SKIP: No data for ${dateStr}`);
        }
      }
      // Pause between weekends to avoid rate limiting
      await sleep(2000);
    } catch (err) {
      console.error(`  ERROR for ${dateStr}: ${err.message}`);
      if (existingMap[dateStr]) {
        preservedCount++;
        console.log(`  Preserved existing data for ${dateStr}`);
      }
    }
  }

  // Reassemble weekends array sorted newest-first
  const allWeekends = WEEKEND_DATES
    .map(d => existingMap[d])
    .filter(Boolean);

  // Rebuild trend data from all weekends (oldest first)
  const trendData = {};
  for (const w of [...allWeekends].reverse()) {
    for (const movie of w.movies) {
      if (!trendData[movie.title]) {
        trendData[movie.title] = { domestic: [], worldwide: [] };
      }
      const domesticM = +(movie.weekend / 1_000_000).toFixed(1);
      const worldwideM = movie.worldwide ? +(movie.worldwide / 1_000_000).toFixed(1) : domesticM;
      const expectedLength = movie.weeks;
      if (trendData[movie.title].domestic.length < expectedLength) {
        trendData[movie.title].domestic.push(domesticM);
        trendData[movie.title].worldwide.push(worldwideM);
      } else if (trendData[movie.title].domestic.length === expectedLength) {
        trendData[movie.title].domestic[expectedLength - 1] = domesticM;
        trendData[movie.title].worldwide[expectedLength - 1] = worldwideM;
      }
    }
  }

  // Carry forward best reviews
  const bestReviews = {};
  for (const w of [...allWeekends].reverse()) {
    for (const m of w.movies) {
      const prev = bestReviews[m.title];
      if (!prev || (m.reviews || []).length > prev.length) {
        bestReviews[m.title] = m.reviews || [];
      }
      if ((m.reviews || []).length < 3 && prev && prev.length > (m.reviews || []).length) {
        m.reviews = prev;
      }
    }
  }

  // Save
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  fs.writeFileSync(WEEKENDS_FILE, JSON.stringify(allWeekends, null, 2));
  fs.writeFileSync(TRENDS_FILE, JSON.stringify(trendData, null, 2));

  const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
  console.log(`\n=== DONE in ${elapsed}s! Refreshed: ${refreshedCount}, Preserved: ${preservedCount}, Total: ${allWeekends.length} weekends ===`);
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
