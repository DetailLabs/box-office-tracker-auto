const axios = require('axios');
const { sleep } = require('../utils');

const BASE_URL = 'https://api.themoviedb.org/3';
const POSTER_BASE = 'https://image.tmdb.org/t/p/w500';

/**
 * Fetch movie details from TMDB for a list of titles.
 * Returns a map of title -> { poster, runtime, genre, rating, imdb }
 */
async function getMovieDetails(titles) {
  const apiKey = process.env.TMDB_API_KEY;
  if (!apiKey) {
    console.warn('[TMDB] No TMDB_API_KEY set, skipping TMDB lookups');
    return {};
  }

  const results = {};
  const currentYear = new Date().getFullYear();

  for (const title of titles) {
    try {
      await sleep(250); // Rate limiting courtesy

      // Search for the movie
      const searchRes = await axios.get(`${BASE_URL}/search/movie`, {
        params: { api_key: apiKey, query: title, year: currentYear },
        timeout: 10000,
      });

      let movie = searchRes.data.results?.[0];

      // Fallback: try without year
      if (!movie) {
        const fallbackRes = await axios.get(`${BASE_URL}/search/movie`, {
          params: { api_key: apiKey, query: title },
          timeout: 10000,
        });
        movie = fallbackRes.data.results?.[0];
      }

      if (!movie) {
        console.warn(`[TMDB] No results for "${title}"`);
        continue;
      }

      await sleep(250);

      // Get full details
      const detailRes = await axios.get(`${BASE_URL}/movie/${movie.id}`, {
        params: { api_key: apiKey, append_to_response: 'release_dates' },
        timeout: 10000,
      });

      const detail = detailRes.data;

      // Extract poster
      const poster = detail.poster_path
        ? `${POSTER_BASE}${detail.poster_path}`
        : null;

      // Extract runtime
      const runtime = detail.runtime || null;

      // Extract genres (first 2)
      const genres = (detail.genres || []).slice(0, 2).map(g => g.name);
      const genre = genres.length > 0 ? genres.join(' / ') : null;

      // Extract US rating from release_dates
      let rating = null;
      const usRelease = detail.release_dates?.results?.find(r => r.iso_3166_1 === 'US');
      if (usRelease) {
        const theatrical = usRelease.release_dates.find(rd =>
          rd.type === 3 || rd.type === 2 || rd.type === 1 // theatrical, limited, premiere
        );
        if (theatrical?.certification) {
          rating = theatrical.certification;
        }
      }

      // Extract IMDB link
      const imdb = detail.imdb_id
        ? `https://www.imdb.com/title/${detail.imdb_id}/`
        : null;

      results[title] = { poster, runtime, genre, rating, imdb };
      console.log(`[TMDB] Found: "${title}" (${runtime}min, ${rating}, ${genre})`);

    } catch (err) {
      console.warn(`[TMDB] Error for "${title}": ${err.message}`);
    }
  }

  return results;
}

module.exports = { getMovieDetails };
