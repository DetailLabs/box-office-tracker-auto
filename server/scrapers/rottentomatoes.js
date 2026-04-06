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

      // Extract scores — RT uses various patterns
      let critics = null;
      let audience = null;

      // Method 1: Look for score in media-scorecard or score-board elements
      const scoreBoardText = $('media-scorecard, score-board, [data-qa="score-panel"]').text();

      // Method 2: Search for score patterns in the page HTML
      const tomatoMatch = html.match(/"tomatometerScore"\s*:\s*(\d+)/);
      const audienceMatch = html.match(/"audienceScore"\s*:\s*(\d+)/);

      if (tomatoMatch) critics = parseInt(tomatoMatch[1], 10);
      if (audienceMatch) audience = parseInt(audienceMatch[1], 10);

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

      // Fetch reviews
      let reviews = [];
      try {
        await sleep(1000);
        reviews = await scrapeReviews(slug);
      } catch (err) {
        console.warn(`[RT] Failed to get reviews for "${title}": ${err.message}`);
      }

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
 * Scrape critic reviews from an RT movie's reviews page.
 * Returns up to 3 review objects [{ source, quote }].
 */
async function scrapeReviews(slug) {
  const url = `https://www.rottentomatoes.com/m/${slug}/reviews`;

  const { data: html } = await axios.get(url, {
    headers: HEADERS,
    timeout: 15000,
    validateStatus: (status) => status < 500,
  });

  if (!html) return [];

  const $ = cheerio.load(html);
  const reviews = [];

  // Look for review cards — RT structures these in various ways
  // Try common selectors for review quotes
  $('[data-qa="review-quote"], .review-text, .the_review, review-speech-balloon').each((_, el) => {
    if (reviews.length >= 3) return;

    const quoteEl = $(el);
    let quote = quoteEl.text().trim();

    // Clean up the quote
    if (quote.length < 20 || quote.length > 200) return;

    // Find the source/publication
    const row = quoteEl.closest('[data-qa="review-item"], .review_table_row, .review-row, article');
    let source = row.find('[data-qa="review-publication"], .publication, .critic-name').text().trim();

    if (!source) {
      // Try finding source in sibling elements
      source = row.find('a[href*="critic/"]').text().trim() ||
               row.find('em, .italic').text().trim() ||
               'Critic';
    }

    if (source && quote) {
      reviews.push({ source, quote: truncateQuote(quote) });
    }
  });

  // Fallback: try JSON-LD or embedded review data
  if (reviews.length === 0) {
    const scripts = $('script').toArray();
    for (const script of scripts) {
      const content = $(script).html() || '';
      const reviewMatch = content.match(/"reviewBody"\s*:\s*"([^"]+)"/g);
      if (reviewMatch) {
        for (const match of reviewMatch.slice(0, 3)) {
          const body = match.match(/"reviewBody"\s*:\s*"([^"]+)"/);
          if (body) {
            reviews.push({ source: 'Critic', quote: truncateQuote(body[1]) });
          }
        }
        break;
      }
    }
  }

  console.log(`[RT] Found ${reviews.length} reviews for /m/${slug}`);
  return reviews;
}

/**
 * Truncate a review quote to a reasonable length.
 */
function truncateQuote(quote) {
  if (quote.length <= 120) return quote;
  // Cut at last sentence boundary before 120 chars
  const truncated = quote.substring(0, 120);
  const lastPeriod = truncated.lastIndexOf('.');
  const lastDash = truncated.lastIndexOf(' — ');
  const cutPoint = Math.max(lastPeriod, lastDash);
  return cutPoint > 40 ? quote.substring(0, cutPoint + 1) : truncated + '...';
}

module.exports = { getScoresAndReviews };
