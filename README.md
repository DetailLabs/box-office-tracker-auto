# Box Office Tracker (Auto-Refresh)

A self-refreshing US weekend box office tracker that automatically scrapes data every Sunday at 3 PM EST. Built with React and Express.

## How It Works

Every Sunday at 3 PM Eastern, the server automatically:

1. **Scrapes Box Office Mojo** for the top 10 weekend chart (ranks, grosses, theaters, change %)
2. **Scrapes Rotten Tomatoes** for critics/audience scores, review quotes, posters, runtime, genre, and rating
3. **Merges everything** into a complete dataset and saves it

Only new movies are enriched — previously fetched RT data and posters are cached and reused.

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

### Local Development

```bash
# Clone the repo
git clone https://github.com/DetailLabs/box-office-tracker-auto.git
cd box-office-tracker-auto

# Install dependencies
npm install

# Create .env file
cp .env.example .env
# Edit .env and add your REFRESH_SECRET (optional)

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
    rottentomatoes.js   RT scores, reviews, posters, and metadata scraper
api/
  weekends.js           Vercel serverless function for /api/weekends
  trends.js             Vercel serverless function for /api/trends
data/
  weekends.json         Persisted weekend data (auto-updated)
  trendData.json        Persisted trend data (auto-updated)
src/                    React frontend
```

## Data Sources

| Source | What It Provides |
|--------|-----------------|
| [Box Office Mojo](https://www.boxofficemojo.com) | Weekend ranks, domestic/worldwide gross, theaters, change % |
| [Rotten Tomatoes](https://www.rottentomatoes.com) | Critics score, audience score, review quotes, posters, runtime, genres, MPAA rating |

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `REFRESH_SECRET` | Recommended | Protects the `POST /api/refresh` endpoint |
| `PORT` | No | Server port (default: 3001) |

## Tech Stack

- **Frontend:** React 19, Tailwind CSS 4, Recharts
- **Backend:** Express, node-cron, Cheerio, Axios
- **Deployment:** Vercel (serverless API routes) or standalone Express
- **Data:** JSON file storage (no database required)

## License

MIT
