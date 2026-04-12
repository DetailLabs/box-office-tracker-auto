/**
 * One-off script: re-fetch Rotten Tomatoes data (critics/audience scores and reviews)
 * for every movie currently in data/weekends.json and overwrite the existing RT fields.
 *
 * This exists because the normal refresh pipeline preserves RT data once a movie has
 * been pulled — so bad historical scores (e.g. Mario critics/audience being wrong)
 * never get corrected. Run this once, verify, commit.
 *
 * Usage: node server/repull-rt.js
 *
 * Behavior:
 *  - Collects the unique set of movie titles across all weekends in weekends.json.
 *  - Fetches fresh RT scores + reviews for each title in a single pass.
 *  - For each weekend entry, overwrites `rt.critics`, `rt.audience`, `rottentomatoes`,
 *    and `reviews` on every movie whose title matched.
 *  - Leaves everything else (BOM numbers, TMDB poster, etc.) untouched.
 *  - Writes weekends.json atomically.
 */
const fs = require('fs');
const path = require('path');
const { getScoresAndReviews } = require('./scrapers/rottentomatoes');

const DATA_DIR = path.join(__dirname, '..', 'data');
const WEEKENDS_FILE = path.join(DATA_DIR, 'weekends.json');

function writeAtomic(filePath, content) {
  const tmpPath = filePath + '.tmp';
  fs.writeFileSync(tmpPath, content, 'utf8');
  fs.renameSync(tmpPath, filePath);
}

async function main() {
  if (!fs.existsSync(WEEKENDS_FILE)) {
    console.error(`[REPULL-RT] ${WEEKENDS_FILE} does not exist`);
    process.exit(1);
  }

  const weekends = JSON.parse(fs.readFileSync(WEEKENDS_FILE, 'utf8'));
  if (!Array.isArray(weekends) || weekends.length === 0) {
    console.error('[REPULL-RT] weekends.json is empty or not an array');
    process.exit(1);
  }

  // Collect unique titles across all weekends so we only hit RT once per movie.
  const titleSet = new Set();
  for (const w of weekends) {
    for (const m of w.movies || []) {
      if (m && m.title) titleSet.add(m.title);
    }
  }
  const titles = [...titleSet];
  console.log(`[REPULL-RT] Found ${titles.length} unique titles across ${weekends.length} weekends`);

  const startTime = Date.now();
  const rtData = await getScoresAndReviews(titles);

  // Retry titles that came back completely empty (scraping can be flaky).
  const failed = titles.filter(t => {
    const r = rtData[t];
    return !r || (
      r.critics == null &&
      r.audience == null &&
      (!r.reviews || r.reviews.length === 0)
    );
  });
  if (failed.length > 0) {
    console.log(`[REPULL-RT] Retrying ${failed.length} title(s) with no data on first attempt...`);
    try {
      const retry = await getScoresAndReviews(failed);
      for (const t of failed) {
        if (retry[t]) rtData[t] = retry[t];
      }
    } catch (err) {
      console.warn(`[REPULL-RT] Retry pass failed: ${err.message}`);
    }
  }

  // Apply the fresh RT data to every weekend entry matching each title.
  // IMPORTANT: we never overwrite existing data with nulls — if a fetch came back
  // with no scores and no reviews we leave the original entry alone so a failed
  // scrape can't wipe good historical data.
  let updatedMovies = 0;
  let skippedEmpty = 0;
  for (const w of weekends) {
    for (const m of w.movies || []) {
      const fresh = rtData[m.title];
      if (!fresh) continue;
      const hasFreshScores = fresh.critics != null || fresh.audience != null;
      const hasFreshReviews = Array.isArray(fresh.reviews) && fresh.reviews.length > 0;
      if (!hasFreshScores && !hasFreshReviews) {
        skippedEmpty++;
        continue;
      }
      if (hasFreshScores) {
        m.rt = {
          critics: fresh.critics ?? null,
          audience: fresh.audience ?? null,
        };
      }
      if (fresh.rottentomatoes) {
        m.rottentomatoes = fresh.rottentomatoes;
      }
      if (hasFreshReviews) {
        m.reviews = fresh.reviews;
      }
      updatedMovies++;
    }
  }

  writeAtomic(WEEKENDS_FILE, JSON.stringify(weekends, null, 2));

  const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
  console.log(
    `[REPULL-RT] Done in ${elapsed}s. Updated RT fields on ${updatedMovies} movie entries ` +
    `(${skippedEmpty} entries were left untouched because the fresh fetch was empty).`
  );

  // Summary: report any titles that still have null scores after the repull.
  const stillMissing = titles.filter(t => {
    const r = rtData[t];
    return !r || (r.critics == null && r.audience == null);
  });
  if (stillMissing.length > 0) {
    console.log(`[REPULL-RT] WARNING: ${stillMissing.length} title(s) have no scores after repull:`);
    for (const t of stillMissing) console.log(`  - ${t}`);
  }
}

main().catch(err => {
  console.error('[REPULL-RT] Fatal error:', err);
  process.exit(1);
});
