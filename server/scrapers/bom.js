const axios = require('axios');
const cheerio = require('cheerio');
const { getBOMWeekendURL, parseMoney, parsePercent, sleep } = require('../utils');

const HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
  'Accept-Language': 'en-US,en;q=0.5',
};

/**
 * Scrape the Box Office Mojo weekend chart for the top 10 movies.
 * Returns an array of partial movie objects with box office data.
 */
async function scrapeWeekend(date = new Date()) {
  const url = getBOMWeekendURL(date);
  console.log(`[BOM] Fetching: ${url}`);

  const { data: html } = await axios.get(url, { headers: HEADERS, timeout: 15000 });
  const $ = cheerio.load(html);

  const movies = [];
  const rows = $('table tr').slice(1); // Skip header row

  for (let i = 0; i < Math.min(rows.length, 10); i++) {
    const row = $(rows[i]);
    const cells = row.find('td');

    if (cells.length < 7) continue;

    const rank = parseInt($(cells[0]).text().trim(), 10);

    // BOM table has 13 columns:
    // 0:Rank, 1:LW, 2:Release, 3:Gross, 4:%±LW, 5:Theaters, 6:TheaterChange, 7:PerTheater, 8:Total, 9:Weeks, 10:Distributor, 11-12:flags
    const titleCell = $(cells[2]);
    const titleLink = titleCell.find('a');
    const title = titleLink.text().trim() || titleCell.text().trim();
    const releaseHref = titleLink.attr('href') || '';

    const weekend = parseMoney($(cells[3]).text().trim());
    const change = parsePercent($(cells[4]).text().trim());
    const theaters = parseInt($(cells[5]).text().trim().replace(/,/g, ''), 10) || 0;
    // cells[6] is theater change, cells[7] is per-theater average (skip both)
    const total = parseMoney($(cells[8]).text().trim());
    const weeks = parseInt($(cells[9]).text().trim(), 10) || 1;

    const boxofficemojo = releaseHref
      ? `https://www.boxofficemojo.com${releaseHref.split('?')[0]}`
      : null;

    movies.push({
      rank,
      title,
      weekend,
      change,
      theaters,
      total,
      weeks,
      boxofficemojo,
    });
  }

  console.log(`[BOM] Found ${movies.length} movies`);

  // Fetch worldwide gross and studio for each movie from their release pages
  for (const movie of movies) {
    if (movie.boxofficemojo) {
      try {
        await sleep(500);
        const details = await scrapeReleaseDetails(movie.boxofficemojo);
        movie.worldwide = details.worldwide;
        movie.studio = details.studio;
      } catch (err) {
        console.warn(`[BOM] Failed to get details for "${movie.title}": ${err.message}`);
        movie.worldwide = movie.total; // fallback
        movie.studio = null;
      }
    }
  }

  return movies;
}

/**
 * Scrape a BOM release page for worldwide gross and studio.
 */
async function scrapeReleaseDetails(url) {
  const { data: html } = await axios.get(url, { headers: HEADERS, timeout: 15000 });
  const $ = cheerio.load(html);

  let worldwide = 0;
  let studio = null;

  // Look for worldwide gross — it's typically in a summary section
  $('span').each((_, el) => {
    const text = $(el).text().trim();
    if (text === 'Worldwide') {
      const parent = $(el).parent();
      const moneyEl = parent.find('span.money, .a-size-medium');
      if (moneyEl.length) {
        worldwide = parseMoney(moneyEl.first().text().trim());
      }
    }
  });

  // Alternative: look for "Worldwide" in the performance section
  if (!worldwide) {
    const allText = $('body').text();
    const wwMatch = allText.match(/Worldwide[^$]*\$([\d,]+)/);
    if (wwMatch) {
      worldwide = parseMoney('$' + wwMatch[1]);
    }
  }

  // Look for distributor/studio
  $('span').each((_, el) => {
    const text = $(el).text().trim();
    if (text === 'Distributor' || text === 'Domestic Distributor') {
      const next = $(el).next('span, a');
      if (next.length) {
        studio = next.text().trim().replace(/See full company information$/, '').trim();
      }
    }
  });

  return { worldwide, studio };
}

module.exports = { scrapeWeekend };
