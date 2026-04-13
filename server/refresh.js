const fs = require('fs');
const path = require('path');
const { scrapeWeekend } = require('./scrapers/bom');
const { getScoresAndReviews } = require('./scrapers/rottentomatoes');
const { getWeekendLabel, getWeekendId } = require('./utils');

const DATA_DIR = path.join(__dirname, '..', 'data');
const WEEKENDS_FILE = path.join(DATA_DIR, 'weekends.json');
const TRENDS_FILE = path.join(DATA_DIR, 'trendData.json');
const MAX_WEEKENDS = 14;
const POSTER_PLACEHOLDER = 'https://image.tmdb.org/t/p/w500/placeholder.jpg';

/**
 * Does this existing movie record already have meaningful Rotten Tomatoes data?
 * Once true, we stop re-fetching RT data on subsequent weekends.
 */
function hasRtData(m) {
  if (!m) return false;
  const hasScores = m.rt && (m.rt.critics != null || m.rt.audience != null);
  const hasReviews = Array.isArray(m.reviews) && m.reviews.length > 0;
  return hasScores || hasReviews;
}

/**
 * Does this existing movie record already have a real (non-placeholder) TMDB poster?
 * Once true, we stop re-fetching TMDB data on subsequent weekends.
 */
function hasTmdbData(m) {
  if (!m) return false;
  return !!(m.poster && !m.poster.endsWith('placeholder.jpg'));
}

/**
 * Full refresh pipeline:
 * 1. Scrape BOM for the current weekend (box-office numbers are always refreshed).
 * 2. For movies that have NOT been pulled before (or had an incomplete first pull),
 *    enrich with TMDB (poster, runtime, etc.) and Rotten Tomatoes (scores + reviews).
 * 3. For movies already pulled in a prior weekend, preserve their TMDB/RT data
 *    and only update box-office numbers (weekend gross, total, worldwide, weeks, etc.).
 * 4. Update weekends.json and trendData.json atomically.
 */
async function refreshAll() {
  console.log('[REFRESH] Starting full refresh...');
  const now = new Date();

  // Step 1: Scrape BOM - box-office numbers are always refreshed for the current weekend
  console.log('[REFRESH] Step 1/4: Scraping Box Office Mojo...');
  const bomMovies = await scrapeWeekend(now);

  if (bomMovies.length === 0) {
    throw new Error('BOM returned 0 movies — scraping may have failed');
  }

  // Load existing data up-front so we can decide which enrichment calls to skip.
  let weekends = [];
  if (fs.existsSync(WEEKENDS_FILE)) {
    try {
      weekends = JSON.parse(fs.readFileSync(WEEKENDS_FILE, 'utf8'));
    } catch (e) {
      console.warn('[REFRESH] Could not parse existing weekends.json, starting fresh');
      weekends = [];
    }
  }

  // Build a lookup of previously pulled movie records keyed by title.
  // Skip any entry for the current weekend (we are recomputing it) and prefer the
  // most complete record across historical weekends (so an earlier good pull wins
  // over a later incomplete one).
  const currentWeekendId = getWeekendId(now);
  const existingByTitle = {};
  for (const w of weekends) {
    if (w.id === currentWeekendId) continue;
    for (const m of w.movies || []) {
      const prev = existingByTitle[m.title];
      if (!prev) {
        existingByTitle[m.title] = m;
        continue;
      }
      const prevScore = (hasRtData(prev) ? 1 : 0) + (hasTmdbData(prev) ? 1 : 0);
      const curScore = (hasRtData(m) ? 1 : 0) + (hasTmdbData(m) ? 1 : 0);
      if (curScore > prevScore) {
        existingByTitle[m.title] = m;
      }
    }
  }

  // Figure out which movies still need enrichment. A movie counts as "already pulled"
  // once it has RT data and a real poster; from that point forward we leave the
  // enrichment data alone and only update box-office numbers.
  const needsEnrichment = [];
  for (const bom of bomMovies) {
    const existing = existingByTitle[bom.title];
    if (!hasRtData(existing) || !hasTmdbData(existing)) {
      needsEnrichment.push(bom.title);
    }
  }

  const preserved = bomMovies.length - needsEnrichment.length;
  console.log(
    `[REFRESH] Preserving enrichment data for ${preserved}/${bomMovies.length} movies.`
  );

  // Step 2: Fetch RT scores, reviews, and metadata (poster, genre, rating, runtime)
  // for movies that need enrichment. This single step replaces the old TMDB + RT flow.
  console.log(`[REFRESH] Step 2/3: Fetching RT data for ${needsEnrichment.length} movie(s)...`);
  const rtData = needsEnrichment.length > 0 ? await getScoresAndReviews(needsEnrichment) : {};

  const failedRt = needsEnrichment.filter(t => {
    const r = rtData[t];
    return !r || (
      r.critics == null &&
      r.audience == null &&
      (!r.reviews || r.reviews.length === 0)
    );
  });
  if (failedRt.length > 0) {
    console.log(`[REFRESH] Retrying RT fetch for ${failedRt.length} movie(s) with no data on first attempt...`);
    try {
      const retryRt = await getScoresAndReviews(failedRt);
      for (const t of failedRt) {
        if (retryRt[t]) rtData[t] = retryRt[t];
      }
    } catch (err) {
      console.warn(`[REFRESH] RT retry failed: ${err.message}`);
    }
  }

  // Step 3: Merge data
  console.log('[REFRESH] Step 3/3: Merging and saving data...');
  const movies = bomMovies.map(bom => {
    const existing = existingByTitle[bom.title] || null;
    const freshRt = rtData[bom.title] || null;
    const needsFresh = !hasRtData(existing) || !hasTmdbData(existing);

    // Metadata (poster, runtime, genre, rating): keep existing if already enriched
    const poster = needsFresh
      ? (freshRt?.poster || (existing?.poster) || POSTER_PLACEHOLDER)
      : (existing?.poster || POSTER_PLACEHOLDER);
    const runtime = needsFresh
      ? (freshRt?.runtime || existing?.runtime || null)
      : (existing?.runtime || null);
    const genre = needsFresh
      ? (freshRt?.genre || existing?.genre || null)
      : (existing?.genre || null);
    const rating = needsFresh
      ? (freshRt?.rating || existing?.rating || null)
      : (existing?.rating || null);

    // RT scores & reviews: keep existing if already pulled
    const rt = hasRtData(existing)
      ? {
          critics: existing.rt?.critics ?? null,
          audience: existing.rt?.audience ?? null,
          rottentomatoes: existing.rottentomatoes || null,
          reviews: existing.reviews || [],
        }
      : {
          critics: freshRt?.critics ?? null,
          audience: freshRt?.audience ?? null,
          rottentomatoes: freshRt?.rottentomatoes || null,
          reviews: freshRt?.reviews || [],
        };

    return {
      rank: bom.rank,
      title: bom.title,
      runtime,
      studio: bom.studio || (existing && existing.studio) || null,
      // Box-office numbers: ALWAYS refreshed from BOM for the current weekend.
      weekend: bom.weekend,
      total: bom.total,
      worldwide: bom.worldwide || bom.total,
      weeks: bom.weeks,
      change: bom.change,
      theaters: bom.theaters,
      poster,
      rating,
      genre,
      rt: {
        critics: rt.critics,
        audience: rt.audience,
      },
      imdb: existing?.imdb || null,
      boxofficemojo: bom.boxofficemojo || (existing && existing.boxofficemojo) || null,
      rottentomatoes: rt.rottentomatoes,
      reviews: rt.reviews,
    };
  });

  // Build new weekend entry
  const weekendEntry = {
    id: currentWeekendId,
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
