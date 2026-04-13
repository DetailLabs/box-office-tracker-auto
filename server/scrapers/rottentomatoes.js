const axios = require('axios');
const cheerio = require('cheerio');
const { generateRTSlug, sleep } = require('../utils');

const HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
  'Accept-Language': 'en-US,en;q=0.5',
};

/**
 * Fetch RT critics score, audience score, and reviews for a list of titles.
 * Returns a map of title -> { critics, audience, rottentomatoes, reviews }
 */
async function getScoresAndReviews(titles) {
  const results = {};

  for (const title of titles) {
    try {
      await sleep(1500); // Be polite to RT

      const slug = generateRTSlug(title);
      const rtUrl = `https://www.rottentomatoes.com/m/${slug}`;

      console.log(`[RT] Fetching scores: ${rtUrl}`);

      const { data: html } = await axios.get(rtUrl, {
        headers: HEADERS,
        timeout: 15000,
        validateStatus: (status) => status < 500,
      });

      if (!html || typeof html !== 'string') {
        console.warn(`[RT] Empty response for "${title}"`);
        results[title] = { critics: null, audience: null, rottentomatoes: rtUrl, reviews: [] };
        continue;
      }

      const $ = cheerio.load(html);

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
 * Extract critic reviews from the main RT movie page.
 * RT uses <review-card> web components with specific slot attributes.
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

  // Strategy 1: Parse <review-card> elements (RT's current structure)
  // Priority: US top-critic > non-US top-critic > US approved-critic > non-US approved-critic
  function extractCardReview(card) {
    const publication = card.find('[slot="publication"]').text().trim();
    let quote = card.find('[slot="review"] [slot="content"]').text().trim();
    if (!quote) {
      quote = card.find('[slot="review"]').text().trim();
    }
    return { publication, quote };
  }

  // Collect all critic cards into buckets by priority
  const buckets = { usTop: [], nonUsTop: [], usApproved: [], nonUsApproved: [] };
  $('review-card').each((_, el) => {
    const card = $(el);
    const cardHtml = $.html(card);
    const isTop = cardHtml.includes('top-critic');
    const isApproved = cardHtml.includes('approved-critic');
    if (!isTop && !isApproved) return;
    const { publication, quote } = extractCardReview(card);
    if (!publication || !quote) return;
    const isUS = isUSPublication(publication);
    if (isTop && isUS) buckets.usTop.push({ publication, quote });
    else if (isTop) buckets.nonUsTop.push({ publication, quote });
    else if (isUS) buckets.usApproved.push({ publication, quote });
    else buckets.nonUsApproved.push({ publication, quote });
  });

  // Add reviews in priority order
  for (const bucket of [buckets.usTop, buckets.nonUsTop, buckets.usApproved, buckets.nonUsApproved]) {
    if (reviews.length >= 3) break;
    for (const { publication, quote } of bucket) {
      if (reviews.length >= 3) break;
      addReview(publication, quote);
    }
  }

  // Strategy 2: Look for review-quote data-qa elements
  if (reviews.length < 3) {
    $('[data-qa="review-quote"], .review-text').each((_, el) => {
      if (reviews.length >= 3) return;
      const quote = $(el).text().trim();
      if (quote.length < 20 || quote.length > 300) return;
      const row = $(el).closest('[data-qa="review-item"], article, .review-row');
      const source = row.find('[data-qa="review-publication"], .publication').text().trim() || 'Critic';
      addReview(source, quote);
    });
  }

  // Strategy 3: Regex-based extraction from raw HTML (top-critic first, then approved-critic)
  if (reviews.length < 3) {
    const topCriticPattern = /top-critic[\s\S]*?slot="publication"[^>]*>([\s\S]*?)<\/rt-link>[\s\S]*?slot="content">([\s\S]*?)<\/span>/g;
    let match;
    while ((match = topCriticPattern.exec(html)) !== null && reviews.length < 3) {
      addReview(match[1].trim(), match[2].trim().replace(/\s+/g, ' '));
    }
  }
  if (reviews.length < 3) {
    const approvedCriticPattern = /approved-critic[\s\S]*?slot="publication"[^>]*>([\s\S]*?)<\/rt-link>[\s\S]*?slot="content">([\s\S]*?)<\/span>/g;
    let match;
    while ((match = approvedCriticPattern.exec(html)) !== null && reviews.length < 3) {
      addReview(match[1].trim(), match[2].trim().replace(/\s+/g, ' '));
    }
  }

  // Strategy 4: Broader regex for slot="content" near slot="publication"
  if (reviews.length < 3) {
    const pubRegex = /slot="publication"[^>]*>\s*([^<]+?)\s*<\/rt-link>/g;
    const contentRegex = /slot="content">\s*([\s\S]*?)\s*<\/span>/g;

    const pubs = [];
    const contents = [];
    let m;
    while ((m = pubRegex.exec(html)) !== null) pubs.push(m[1].trim());
    while ((m = contentRegex.exec(html)) !== null) {
      const text = m[1].trim().replace(/\s+/g, ' ');
      if (text.length >= 20) contents.push(text);
    }

    // Match pubs with contents (they appear in order on the page)
    for (let i = 0; i < Math.min(pubs.length, contents.length) && reviews.length < 3; i++) {
      addReview(pubs[i], contents[i]);
    }
  }

  return reviews;
}

/**
 * Extract audience reviews as fallback when critic reviews are scarce.
 * Audience review cards lack "approved-critic"/"top-critic" attributes.
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

  // Look for review-card elements that are NOT critic reviews
  $('review-card').each((_, el) => {
    if (reviews.length >= 3) return;
    const card = $(el);
    const cardHtml = $.html(card);
    if (cardHtml.includes('approved-critic') || cardHtml.includes('top-critic')) return;

    let quote = card.find('[slot="content"]').text().trim();
    if (!quote) {
      quote = card.find('[slot="review"]').text().trim();
    }
    addReview(quote);
  });

  // Regex fallback for audience review content
  if (reviews.length < 3) {
    const contentRegex = /slot="content">\s*([\s\S]*?)\s*<\/span>/g;
    let m;
    while ((m = contentRegex.exec(html)) !== null && reviews.length < 3) {
      const text = m[1].trim().replace(/\s+/g, ' ');
      addReview(text);
    }
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
      if (data.image) poster = data.image;
      if (data.contentRating) rating = data.contentRating;
      if (Array.isArray(data.genre) && data.genre.length > 0) {
        genre = data.genre.slice(0, 2).join(' / ');
      }
    } catch (e) { /* ignore */ }
  }

  // Fallback poster: og:image or scorecard poster
  if (!poster) {
    poster = $('meta[property="og:image"]').attr('content') || null;
  }
  if (!poster) {
    poster = $('media-scorecard rt-img[slot="poster-image"]').attr('src') || null;
  }

  // Runtime from page text (e.g. "1h 38m")
  const runtimeMatch = html.match(/(\d+)h\s*(\d+)m/);
  if (runtimeMatch) {
    runtime = parseInt(runtimeMatch[1], 10) * 60 + parseInt(runtimeMatch[2], 10);
  }

  return { poster, runtime, genre, rating };
}

module.exports = { getScoresAndReviews };
