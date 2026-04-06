# Box Office Tracker (Auto-Refresh)

A self-refreshing US weekend box office tracker that automatically scrapes data every Sunday at 3 PM EST. Built with React and Express, designed for one-click deployment on Replit.

## How It Works

Every Sunday at 3 PM Eastern, the server automatically:

1. **Scrapes Box Office Mojo** for the top 10 weekend chart (ranks, grosses, theaters, change %)
2. **Queries the TMDB API** for posters, runtime, genre, rating, and IMDB links
3. **Scrapes Rotten Tomatoes** for critics/audience scores and review quotes
4. **Merges everything** into a complete dataset and saves it

The React frontend fetches this data from the API on load. No manual updates needed.

## Features

- Light and dark themes with smooth toggle
- Interactive poster modal with RT scores, reviews, and weekly trend charts
- Weekend selector dropdown (last 14 weekends of history)
- Analytics/insights page with Recharts visualizations
- Mobile-optimized layout
- Manual refresh endpoint for on-demand updates

## Quick Start

### Prerequisites

- Node.js 18+
- A free [TMDB API key](https://www.themoviedb.org/settings/api)

### Local Development

```bash
# Clone the repo
git clone https://github.com/DetailLabs/box-office-tracker-auto.git
cd box-office-tracker-auto

# Install dependencies
npm install

# Create .env file
cp .env.example .env
# Edit .env and add your TMDB_API_KEY

# Build the React frontend
npm run build

# Start the server
npm start
```

The app will be available at `http://localhost:3001`.

### Development Mode (React hot reload)

```bash
npm run dev
```

This starts the React dev server on port 3000 with proxy to the Express backend on port 3001.

## Deploy on Replit

1. **Import from GitHub** — paste the repo URL when creating a new Replit
2. **Set Secrets** in the Replit Secrets tab:
   - `TMDB_API_KEY` — your TMDB API key
   - `REFRESH_SECRET` — any random string (protects the manual refresh endpoint)
3. **Deploy** — Replit runs `npm install && npm run build`, then `npm start`

The cron job activates automatically. Data refreshes every Sunday at 3 PM EST.

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/weekends` | Returns all weekend box office data (JSON) |
| GET | `/api/trends` | Returns weekly trend data for all movies (JSON) |
| GET | `/api/status` | Returns last refresh time, next scheduled refresh, and status |
| POST | `/api/refresh` | Triggers an immediate data refresh (requires auth) |

### Manual Refresh

```bash
curl -X POST http://localhost:3001/api/refresh \
  -H "Authorization: Bearer YOUR_REFRESH_SECRET"
```

## Project Structure

```
server/
  index.js              Express server + API routes
  cron.js               Sunday 3 PM EST scheduler
  refresh.js            Orchestrator: scrape, merge, save
  utils.js              ISO week calc, slug generation, helpers
  scrapers/
    bom.js              Box Office Mojo scraper
    tmdb.js             TMDB API client
    rottentomatoes.js   RT scores + reviews scraper
data/
  weekends.json         Persisted weekend data (auto-updated)
  trendData.json        Persisted trend data (auto-updated)
src/                    React frontend
```

## Data Sources

| Source | What It Provides |
|--------|-----------------|
| [Box Office Mojo](https://www.boxofficemojo.com) | Weekend ranks, domestic/worldwide gross, theaters, change % |
| [TMDB](https://www.themoviedb.org) | Posters, runtime, genres, MPAA rating, IMDB ID |
| [Rotten Tomatoes](https://www.rottentomatoes.com) | Critics score, audience score, review quotes |

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `TMDB_API_KEY` | Yes | Free API key from [themoviedb.org](https://www.themoviedb.org/settings/api) |
| `REFRESH_SECRET` | Recommended | Protects the `POST /api/refresh` endpoint |
| `PORT` | No | Server port (default: 3001, auto-set by Replit) |

## Tech Stack

- **Frontend:** React 19, Tailwind CSS 4, Recharts
- **Backend:** Express, node-cron, Cheerio, Axios
- **Data:** JSON file storage (no database required)

## License

MIT
