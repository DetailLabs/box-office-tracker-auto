const axios = require('axios');
const cheerio = require('cheerio');
const { generateRTSlug, generateRTSlugVariants, hasRTSlugOverride, sleep } = require('../utils');

const HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
  'Accept-Language': 'en-US,en;q=0.5',
};

/**
 * Fetch an RT movie page and extract its release year (from the LD+JSON
 * "dateCreated" field). Returns { html, $, url, year, isMovie }, or null when
 * the page doesn't load as a valid HTML document.
 *
 * `isMovie` distinguishes a real movie page from the generic RT shell that a
 * bad slug can land on — that shell still returns 200 and still carries an
 * og:image (RT's own branding card), which is how a wrong slug used to end up
 * saved as a movie's "poster".
 */
async function fetchMoviePage(slug) {
  const url = `https://www.rottentomatoes.com/m/${slug}`;
  const { data: html, status } = await axios.get(url, {
    headers: HEADERS,
    timeout: 15000,
    validateStatus: (s) => s < 500,
  });
  if (status !== 200 || !html || typeof html !== 'string') return null;
  const $ = cheerio.load(html);
  const yearMatch = html.match(/"dateCreated"\s*:\s*"(\d{4})/);
  const year = yearMatch ? parseInt(yearMatch[1], 10) : null;
  const isMovie =
    /"@type"\s*:\s*"Movie"/.test(html) || html.includes('<media-scorecard');
  return { html, $, url, year, isMovie };
}

/**
 * Resolve the correct RT page for a title currently in theaters.
 *
 * Titles get recycled across decades (Supergirl 1984 vs 2026), and RT gives
 * the newer film a year-suffixed slug while the base slug keeps pointing at
 * the old one. A movie in the current box-office top 10 should have been
 * released this year or last — if the base slug's page is older than that,
 * prefer a `<slug>_<year>` variant when a recent one exists.
 *
 * Re-releases of old films are unaffected: their year-suffixed slugs don't
 * exist on RT, so the base page is kept. Manually pinned slugs are trusted
 * as-is and skip the check.
 */
async function resolveMoviePage(title) {
  // Try each slug spelling until one lands on a real movie page. Keep the first
  // page that loaded at all as a last resort, so score extraction still gets a
  // shot if RT's markup changes and the movie-page check stops matching.
  const variants = generateRTSlugVariants(title);
  let slug = variants[0];
  let page = null;
  let fallback = null;
  let fallbackSlug = variants[0];

  for (let i = 0; i < variants.length; i++) {
    if (i > 0) await sleep(1500);
    console.log(`[RT] Fetching scores: https://www.rottentomatoes.com/m/${variants[i]}`);
    const candidate = await fetchMoviePage(variants[i]);
    if (candidate?.isMovie) {
      slug = variants[i];
      page = candidate;
      break;
    }
    if (candidate && !fallback) {
      fallback = candidate;
      fallbackSlug = variants[i];
    }
  }

  if (!page) {
    page = fallback;
    slug = fallbackSlug;
  }
  if (hasRTSlugOverride(title)) return page;

  const currentYear = new Date().getFullYear();
  const isRecent = (p) => p && p.year != null && p.year >= currentYear - 1;
  if (isRecent(page)) return page;

  for (const year of [currentYear, currentYear - 1]) {
    await sleep(1500);
    const candidate = await fetchMoviePage(`${slug}_${year}`);
    if (isRecent(candidate)) {
      console.log(
        `[RT] "${title}": /m/${slug} is a ${page?.year ?? 'unknown-year'} movie — using /m/${slug}_${year} instead`
      );
      return candidate;
    }
  }

  // No recent variant found: keep the base page (re-release or unknown year).
  return page;
}

/**
 * Fetch RT critics score, audience score, and reviews for a list of titles.
 * Returns a map of title -> { critics, audience, rottentomatoes, reviews }
 */
async function getScoresAndReviews(titles) {
  const results = {};

  for (const title of titles) {
    try {
      await sleep(1500); // Be polite to RT

      const page = await resolveMoviePage(title);

      if (!page) {
        console.warn(`[RT] Empty response for "${title}"`);
        const rtUrl = `https://www.rottentomatoes.com/m/${generateRTSlug(title)}`;
        results[title] = { critics: null, audience: null, rottentomatoes: rtUrl, reviews: [] };
        continue;
      }

      const { html, $, url: rtUrl } = page;

      // Extract scores
      let critics = null;
      let audience = null;

      // Method 1: Parse the criticsScore / audienceScore JSON objects embedded in the page.
      // These are the authoritative score objects RT embeds, e.g.:
      //   "criticsScore":{"score":"43","sentiment":"NEGATIVE",...}
      //   "audienceScore":{"score":"89","scoreType":"VERIFIED",...}
      const criticsObjMatch = html.match(/"criticsScore"\s*:\s*\{[^}]*"score"\s*:\s*"(\d+)"/);
      const audienceObjMatch = html.match(/"audienceScore"\s*:\s*\{[^}]*"score"\s*:\s*"(\d+)"/);
      if (criticsObjMatch) critics = parseInt(criticsObjMatch[1], 10);
      if (audienceObjMatch) audience = parseInt(audienceObjMatch[1], 10);

      // Method 2: Look for tomatometerScore / audienceScore as simple numeric fields
      if (critics === null) {
        const tomatoMatch = html.match(/"tomatometerScore"\s*:\s*(\d+)/);
        if (tomatoMatch) critics = parseInt(tomatoMatch[1], 10);
      }
      if (audience === null) {
        const audienceSimple = html.match(/"audienceScore"\s*:\s*(\d+)/);
        if (audienceSimple) audience = parseInt(audienceSimple[1], 10);
      }

      // Method 3: Look for score in structured data (LD+JSON)
      // The aggregateRating.ratingValue is the Tomatometer percentage (0-100).
      if (critics === null) {
        const ldJson = $('script[type="application/ld+json"]').html();
        if (ldJson) {
          try {
            const data = JSON.parse(ldJson);
            if (data.aggregateRating?.ratingValue) {
              const val = parseInt(data.aggregateRating.ratingValue, 10);
              if (val >= 0 && val <= 100) critics = val;
            }
          } catch (e) { /* ignore parse errors */ }
        }
      }

      // Method 4: Search for rt-text elements with scores
      if (critics === null || audience === null) {
        $('rt-text, span').each((_, el) => {
          const text = $(el).text().trim();
          const scoreMatch = text.match(/^(\d{1,3})%$/);
          if (scoreMatch) {
            const slot = $(el).attr('slot');
            if (slot === 'criticsScore' && critics === null) {
              critics = parseInt(scoreMatch[1], 10);
            } else if (slot === 'audienceScore' && audience === null) {
              audience = parseInt(scoreMatch[1], 10);
            }
          }
        });
      }

      console.log(`[RT] Scores for "${title}": Critics=${critics}, Audience=${audience}`);

      // Extract emsId for API-based review fetching
      const emsMatch = html.match(/emsId["':]+\s*["']([a-f0-9-]+)/);
      let reviews = [];

      if (emsMatch) {
        // Use RT reviews API for better top-critic coverage
        reviews = await fetchReviewsFromAPI(emsMatch[1], title);
      }

      // Fall back to HTML scraping if API fails
      if (reviews.length === 0) {
        reviews = extractCriticReviews($, html);
        console.log(`[RT] Found ${reviews.length} critic reviews from HTML for "${title}"`);
      }

      // Fall back to audience reviews if not enough critic reviews
      if (reviews.length < 3) {
        const audienceReviews = extractAudienceReviews($, html);
        console.log(`[RT] Found ${audienceReviews.length} audience reviews for "${title}" (fallback)`);
        reviews = reviews.concat(audienceReviews).slice(0, 3);
      }

      // Extract movie metadata from the RT page (replaces TMDB dependency)
      const meta = extractMovieMetadata($, html);

      results[title] = { critics, audience, rottentomatoes: rtUrl, reviews, ...meta };

    } catch (err) {
      console.warn(`[RT] Error for "${title}": ${err.message}`);
      const slug = generateRTSlug(title);
      results[title] = {
        critics: null,
        audience: null,
        rottentomatoes: `https://www.rottentomatoes.com/m/${slug}`,
        reviews: [],
        poster: null,
        runtime: null,
        genre: null,
        rating: null,
      };
    }
  }

  return results;
}

/**
 * Fetch top critic reviews via RT's internal API, prioritizing US top critics.
 * Returns up to 3 reviews sorted by: US top-critic > non-US top-critic.
 */
async function fetchReviewsFromAPI(emsId, title) {
  try {
    const url = `https://www.rottentomatoes.com/napi/rtcf/v1/movies/${emsId}/reviews`;
    const { data } = await axios.get(url, {
      headers: {
        ...HEADERS,
        Accept: 'application/json',
        Referer: `https://www.rottentomatoes.com/m/`,
      },
      params: { type: 'critic', topOnly: true, pageCount: 20 },
      timeout: 15000,
      validateStatus: (status) => status < 500,
    });

    if (!data?.reviews?.length) {
      console.log(`[RT] API returned 0 top-critic reviews for "${title}"`);
      return [];
    }

    // Separate US vs non-US top critics
    const usReviews = [];
    const otherReviews = [];

    for (const r of data.reviews) {
      const quote = (r.reviewQuote || '')
        .replace(/&#\d+;/g, c => String.fromCharCode(parseInt(c.slice(2, -1), 10)))
        .replace(/&apos;/g, "'")
        .replace(/&quot;/g, '"')
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .trim().replace(/\s+/g, ' ');
      const pub = r.publication?.name?.trim();
      if (!quote || quote.length < 20 || quote.length > 300 || !pub) continue;

      const review = { source: pub, quote: truncateQuote(quote) };
      if (isUSPublication(pub)) {
        usReviews.push(review);
      } else {
        otherReviews.push(review);
      }
    }

    // Combine: US first, then others, take top 3
    const reviews = [...usReviews, ...otherReviews].slice(0, 3);
    console.log(`[RT] API found ${reviews.length} top-critic reviews for "${title}" (${usReviews.length} US, ${otherReviews.length} other)`);
    return reviews;
  } catch (err) {
    console.warn(`[RT] API review fetch failed for "${title}": ${err.message}`);
    return [];
  }
}

// Major US-based publications for prioritizing American critics
const US_PUBLICATIONS = new Set([
  'the new york times', 'the washington post', 'los angeles times', 'chicago tribune',
  'chicago sun-times', 'the wall street journal', 'usa today', 'new york post',
  'boston globe', 'san francisco chronicle', 'variety', 'the hollywood reporter',
  'deadline', 'indiewire', 'vulture', 'the wrap', 'entertainment weekly',
  'rolling stone', 'time magazine', 'time', 'the new yorker', 'vanity fair',
  'esquire', 'gq', 'vogue', 'the atlantic', 'slate', 'salon', 'the daily beast',
  'the a.v. club', 'rogerebert.com', 'collider', 'screen rant', 'cinemablend',
  'ign', 'gamespot', 'polygon', 'the verge', 'mashable', 'buzzfeed',
  'associated press', 'npr', 'cnn', 'forbes', 'newsweek', 'the ringer',
  'paste magazine', 'consequence', 'slant magazine', 'film threat',
  'moviefreak.com', 'screen daily', 'the playlist', 'awards daily',
  'the film stage', 'we live entertainment', 'joblo', 'flickering myth',
  'birth.movies.death', 'film inquiry', 'the austin chronicle', 'village voice',
  'new york magazine', 'the observer', 'the seattle times', 'detroit news',
  'arizona republic', 'miami herald', 'dallas morning news', 'houston chronicle',
  'philadelphia inquirer', 'minneapolis star tribune', 'st. louis post-dispatch',
  'denver post', 'pittsburgh post-gazette', 'time out new york',
]);

function isUSPublication(pub) {
  if (!pub) return false;
  return US_PUBLICATIONS.has(pub.toLowerCase());
}

/**
 * Card elements RT has used for reviews, newest markup first.
 * The site renamed <review-card> to <review-card-critic>/<review-card-audience>
 * and swapped the "top-critic"/"approved-critic" markers for
 * "top-publication"/"approved-publication"; both spellings are accepted so a
 * future rename back doesn't silently empty the reviews again.
 */
const CRITIC_CARD_SELECTOR = 'review-card-critic, review-card';
const AUDIENCE_CARD_SELECTOR = 'review-card-audience';

/**
 * Pull the publication and quote out of one review card.
 * Reading both from the SAME card is the point: pairing a publication list
 * against a separately-collected quote list is what used to attribute audience
 * blurbs to real outlets ("Washington Post: Love the story great storyline").
 */
function extractCardReview($, card) {
  const publication = card.find('[slot="publication"]').first().text().trim();
  // Newer markup puts the quote directly in slot="review"; older markup nested
  // it in a slot="content" span.
  const quote = (
    card.find('[slot="review"] [slot="content"]').first().text().trim() ||
    card.find('[slot="review"]').first().text().trim() ||
    card.find('[slot="content"]').first().text().trim()
  );
  return { publication, quote };
}

/**
 * Extract critic reviews from the main RT movie page.
 * Priority: US top-critic > non-US top-critic > US approved > non-US approved,
 * then any remaining critic card, so a movie whose critics are all unlisted
 * publications still gets real critic quotes rather than falling through to
 * audience reviews.
 */
function extractCriticReviews($, html) {
  const reviews = [];
  const seen = new Set();

  function addReview(source, quote) {
    if (reviews.length >= 3) return false;
    quote = (quote || '').trim().replace(/\s+/g, ' ');
    source = (source || '').trim();
    if (!quote || quote.length < 20 || quote.length > 300) return false;
    if (!source || source.length > 60) return false;
    const key = quote.substring(0, 50).toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    reviews.push({ source, quote: truncateQuote(quote) });
    return true;
  }

  // Tier order is the priority order: every top-critic review outranks every
  // non-top one, and US publications are preferred within each tier.
  const buckets = {
    usTop: [], nonUsTop: [], usApproved: [], nonUsApproved: [], rest: [],
  };
  const TIER_OF = {
    usTop: 'top', nonUsTop: 'top',
    usApproved: 'approved', nonUsApproved: 'approved',
    rest: 'other',
  };

  $(CRITIC_CARD_SELECTOR).each((_, el) => {
    const card = $(el);
    const isTop = card.is('[top-publication]') || $.html(card).includes('top-critic');
    const isApproved =
      card.is('[approved-publication]') || $.html(card).includes('approved-critic');

    const { publication, quote } = extractCardReview($, card);
    if (!publication || !quote) return;

    const isUS = isUSPublication(publication);
    if (isTop && isUS) buckets.usTop.push({ publication, quote });
    else if (isTop) buckets.nonUsTop.push({ publication, quote });
    else if (isApproved && isUS) buckets.usApproved.push({ publication, quote });
    else if (isApproved) buckets.nonUsApproved.push({ publication, quote });
    else buckets.rest.push({ publication, quote });
  });

  const used = { top: 0, approved: 0, other: 0 };
  for (const name of ['usTop', 'nonUsTop', 'usApproved', 'nonUsApproved', 'rest']) {
    if (reviews.length >= 3) break;
    for (const { publication, quote } of buckets[name]) {
      if (reviews.length >= 3) break;
      if (addReview(publication, quote)) used[TIER_OF[name]]++;
    }
  }
  if (reviews.length > 0) {
    console.log(
      `[RT] Critic review tiers used: ${used.top} top, ${used.approved} approved, ${used.other} other ` +
      `(available: ${buckets.usTop.length + buckets.nonUsTop.length} top, ` +
      `${buckets.usApproved.length + buckets.nonUsApproved.length} approved, ${buckets.rest.length} other)`
    );
  }

  // Fallback: RT changed its card element again. Slice the raw HTML into
  // per-card blocks and read each block's own publication and quote, so an
  // attribution can never be borrowed from a neighbouring card.
  if (reviews.length === 0) {
    const blockPattern = /<review-card[a-z-]*\b[\s\S]*?<\/review-card[a-z-]*>/g;
    let block;
    while ((block = blockPattern.exec(html)) !== null && reviews.length < 3) {
      const $block = cheerio.load(block[0]);
      const { publication, quote } = extractCardReview($block, $block.root());
      addReview(publication, quote);
    }
  }

  return reviews;
}

/**
 * Extract audience reviews as fallback when critic reviews are scarce.
 * Only reads audience cards — never the generic slot="content" sweep that
 * used to pick up whatever text happened to match.
 */
function extractAudienceReviews($, html) {
  const reviews = [];
  const seen = new Set();

  function addReview(quote) {
    if (reviews.length >= 3) return false;
    quote = (quote || '').trim().replace(/\s+/g, ' ');
    if (!quote || quote.length < 20 || quote.length > 300) return false;
    const key = quote.substring(0, 50).toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    reviews.push({ source: 'Audience', quote: truncateQuote(quote) });
    return true;
  }

  $(AUDIENCE_CARD_SELECTOR).each((_, el) => {
    if (reviews.length >= 3) return;
    addReview(extractCardReview($, $(el)).quote);
  });

  // Legacy markup: <review-card> elements without a critic marker.
  if (reviews.length < 3) {
    $('review-card').each((_, el) => {
      if (reviews.length >= 3) return;
      const card = $(el);
      const cardHtml = $.html(card);
      if (cardHtml.includes('approved-critic') || cardHtml.includes('top-critic')) return;
      addReview(extractCardReview($, card).quote);
    });
  }

  return reviews;
}

/**
 * Truncate a review quote to a reasonable length.
 */
function truncateQuote(quote) {
  if (quote.length <= 120) return quote;
  const truncated = quote.substring(0, 120);
  const lastPeriod = truncated.lastIndexOf('.');
  const lastDash = truncated.lastIndexOf(' — ');
  const cutPoint = Math.max(lastPeriod, lastDash);
  return cutPoint > 40 ? quote.substring(0, cutPoint + 1) : truncated + '...';
}

/**
 * Is this URL an actual poster image, rather than one of RT's own site assets?
 * A page without a poster (or a slug that missed) still serves RT branding via
 * og:image — saving that as the poster produces the RT logo where art belongs.
 */
function isRealPoster(url) {
  if (!url || typeof url !== 'string') return false;
  return !/rottentomatoes\.com\/assets\/|RT_TwitterCard|rt-poster-default/i.test(url);
}

/**
 * Extract poster, runtime, genre, and rating from the RT page.
 * This replaces the TMDB dependency — no API key needed.
 */
function extractMovieMetadata($, html) {
  let poster = null;
  let runtime = null;
  let genre = null;
  let rating = null;

  // Parse LD+JSON for poster, genre, and rating
  const ldJson = $('script[type="application/ld+json"]').html();
  if (ldJson) {
    try {
      const data = JSON.parse(ldJson);
      if (isRealPoster(data.image)) poster = data.image;
      if (data.contentRating) rating = data.contentRating;
      if (Array.isArray(data.genre) && data.genre.length > 0) {
        genre = data.genre.slice(0, 2).join(' / ');
      }
    } catch (e) { /* ignore */ }
  }

  // Fallback poster: og:image or scorecard poster
  if (!poster) {
    const ogImage = $('meta[property="og:image"]').attr('content');
    if (isRealPoster(ogImage)) poster = ogImage;
  }
  if (!poster) {
    const scorecard = $('media-scorecard rt-img[slot="poster-image"]').attr('src');
    if (isRealPoster(scorecard)) poster = scorecard;
  }

  // Runtime from page text (e.g. "1h 38m")
  const runtimeMatch = html.match(/(\d+)h\s*(\d+)m/);
  if (runtimeMatch) {
    runtime = parseInt(runtimeMatch[1], 10) * 60 + parseInt(runtimeMatch[2], 10);
  }

  return { poster, runtime, genre, rating };
}

module.exports = { getScoresAndReviews, resolveMoviePage };
