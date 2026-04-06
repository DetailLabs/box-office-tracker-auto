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

      // Method 1: Look for tomatometerScore / audienceScore in JSON
      const tomatoMatch = html.match(/"tomatometerScore"\s*:\s*(\d+)/);
      const audienceMatch = html.match(/"audienceScore"\s*:\s*(\d+)/);
      if (tomatoMatch) critics = parseInt(tomatoMatch[1], 10);
      if (audienceMatch) audience = parseInt(audienceMatch[1], 10);

      // Method 2: Look for score in scoreboard JSON patterns
      // RT embeds scores like "score":"75","scoreType":"VERIFIED"
      if (critics === null) {
        // Find the critics tomatometer score - usually first score object
        const scoreMatches = [...html.matchAll(/"score":"(\d+)","scoreType":"[^"]*","sentiment":"[^"]*"/g)];
        if (scoreMatches.length >= 1) {
          critics = parseInt(scoreMatches[0][1], 10);
        }
        if (audience === null && scoreMatches.length >= 2) {
          audience = parseInt(scoreMatches[1][1], 10);
        }
      }

      // Method 3: Look for score in structured data
      if (critics === null) {
        const ldJson = $('script[type="application/ld+json"]').html();
        if (ldJson) {
          try {
            const data = JSON.parse(ldJson);
            if (data.aggregateRating?.ratingValue) {
              critics = Math.round(data.aggregateRating.ratingValue * 10);
            }
          } catch (e) { /* ignore parse errors */ }
        }
      }

      // Method 4: Search for rt-text elements with scores
      if (critics === null) {
        $('rt-text, span').each((_, el) => {
          const text = $(el).text().trim();
          const scoreMatch = text.match(/^(\d{1,3})%$/);
          if (scoreMatch && critics === null) {
            const slot = $(el).attr('slot');
            if (slot === 'criticsScore') {
              critics = parseInt(scoreMatch[1], 10);
            } else if (slot === 'audienceScore') {
              audience = parseInt(scoreMatch[1], 10);
            }
          }
        });
      }

      console.log(`[RT] Scores for "${title}": Critics=${critics}, Audience=${audience}`);

      // Extract critic reviews from the main movie page
      const reviews = extractCriticReviews($, html);
      console.log(`[RT] Found ${reviews.length} critic reviews for "${title}"`);

      results[title] = { critics, audience, rottentomatoes: rtUrl, reviews };

    } catch (err) {
      console.warn(`[RT] Error for "${title}": ${err.message}`);
      const slug = generateRTSlug(title);
      results[title] = {
        critics: null,
        audience: null,
        rottentomatoes: `https://www.rottentomatoes.com/m/${slug}`,
        reviews: [],
      };
    }
  }

  return results;
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
  // Critic review cards have attributes like "approved-critic" or "top-critic"
  $('review-card').each((_, el) => {
    if (reviews.length >= 3) return;
    const card = $(el);
    const cardHtml = $.html(card);

    // Only process critic reviews (have approved-critic or top-critic attribute)
    if (!cardHtml.includes('approved-critic') && !cardHtml.includes('top-critic')) return;

    // Extract publication from rt-link[slot="publication"]
    const publication = card.find('[slot="publication"]').text().trim();

    // Extract review text from drawer-more[slot="review"] > span[slot="content"]
    let quote = card.find('[slot="review"] [slot="content"]').text().trim();
    if (!quote) {
      quote = card.find('[slot="review"]').text().trim();
    }

    addReview(publication, quote);
  });

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

  // Strategy 3: Regex-based extraction from raw HTML
  // Match the pattern: slot="publication"...>Publication Name</rt-link> ... slot="content">Review text</span>
  if (reviews.length < 3) {
    // Find all critic review card blocks
    const cardPattern = /approved-critic[\s\S]*?slot="publication"[^>]*>([\s\S]*?)<\/rt-link>[\s\S]*?slot="content">([\s\S]*?)<\/span>/g;
    let match;
    while ((match = cardPattern.exec(html)) !== null && reviews.length < 3) {
      const publication = match[1].trim();
      const quote = match[2].trim().replace(/\s+/g, ' ');
      addReview(publication, quote);
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

module.exports = { getScoresAndReviews };
