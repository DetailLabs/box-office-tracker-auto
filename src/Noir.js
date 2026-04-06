import React, { useState } from "react";
import { movies, weekendDate, formatMoney, formatMoneyFull } from "./data";
import PosterModal, { MiniBarChart, trendData } from "./PosterModal";
import Analytics from "./AnalyticsBase";

function RTBadge({ score, type = "critics" }) {
  if (score === null || score === undefined) return null;
  const isFresh = score >= 60;
  const icon = type === "critics"
    ? (isFresh ? "🍅" : "🟢")
    : (isFresh ? "🍿" : "🍿");
  const color = type === "critics"
    ? (isFresh ? "text-red-400" : "text-green-400")
    : "text-amber-400";
  return (
    <span className={`inline-flex items-center gap-0.5 text-xs font-semibold ${color}`}>
      <span className="text-[11px]">{icon}</span>
      {score}%
    </span>
  );
}

export default function Noir() {
  const topMovie = movies[0];
  const [posterMovie, setPosterMovie] = useState(null);
  const [page, setPage] = useState("weekend");

  return (
    <div className="min-h-screen text-white font-sans" style={{ background: '#000' }}>
      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(-4px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fadeIn { animation: fadeIn 0.2s ease-out; }
        @keyframes scaleIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
        .animate-scaleIn { animation: scaleIn 0.2s ease-out; }
      `}</style>

      <PosterModal movie={posterMovie} onClose={() => setPosterMovie(null)} theme="noir" />

      {/* Nav */}
      <nav className="sticky top-0 z-50" style={{ borderBottom: '1px solid #1a1a1a', background: '#000' }}>
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="rounded" style={{ width: 6, height: 24, background: '#dc2626' }} />
            <span className="text-base font-extrabold tracking-widest uppercase">The Box Office</span>
          </div>
          <div className="flex items-center gap-4 pr-12">
            <button onClick={() => setPage("weekend")} className="text-xs uppercase tracking-widest font-medium cursor-pointer transition-colors" style={{ color: page === "weekend" ? "#fff" : "#555", borderBottom: page === "weekend" ? "2px solid #dc2626" : "2px solid transparent", paddingBottom: 4 }}>Numbers</button>
            <button onClick={() => setPage("insights")} className="text-xs uppercase tracking-widest font-medium cursor-pointer transition-colors" style={{ color: page === "insights" ? "#fff" : "#555", borderBottom: page === "insights" ? "2px solid #dc2626" : "2px solid transparent", paddingBottom: 4 }}>Insights</button>
          </div>
        </div>
      </nav>

      {page === "insights" ? (
        <div className="max-w-6xl mx-auto px-6 py-10">
          <h1 className="text-sm font-extrabold mb-6 flex items-center gap-2 uppercase tracking-widest text-gray-400">
            <span className="w-8 h-px" style={{ background: '#222' }} />
            Weekend Insights
          </h1>
          <Analytics theme="noir" />
        </div>
      ) : (
      <>
      {/* Hero */}
      <div className="max-w-6xl mx-auto px-6 pt-8 pb-8">
        <div className="rounded-2xl" style={{ background: '#0a0a0a', border: '1px solid #1a1a1a' }}>
          <div className="flex gap-8 p-7">
            <img
              src={topMovie.poster.replace("/w500/", "/w780/")}
              alt={topMovie.title}
              className="w-64 rounded-xl shrink-0"
              style={{ aspectRatio: '2/3', objectFit: 'cover' }}
            />
            <div className="flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-white text-xs font-bold px-2.5 py-0.5 rounded" style={{ background: '#dc2626', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                    #1
                  </span>
                  {topMovie.change === null && (
                    <span className="text-xs font-bold px-2 py-0.5 rounded" style={{ border: '1px solid #333', color: '#888', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      New
                    </span>
                  )}
                </div>
                <a href={topMovie.rottentomatoes} target="_blank" rel="noopener noreferrer" className="hover:text-red-500 transition-colors">
                  <h2 className="text-4xl font-extrabold mb-2 tracking-tight">{topMovie.title}</h2>
                </a>
                <p className="text-sm text-gray-500">{topMovie.studio}</p>
                <p className="text-sm text-gray-600 mb-4">
                  {topMovie.rating} · {topMovie.genre}{topMovie.runtime ? ` · ${Math.floor(topMovie.runtime / 60)}h ${topMovie.runtime % 60}m` : ''}
                </p>
                <a href={topMovie.rottentomatoes} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-4 mb-4 hover:opacity-70 transition-opacity">
                  <div className="flex items-center gap-1">
                    <span className="text-base">🍅</span>
                    <span className="text-sm font-bold">{topMovie.rt.critics}%</span>
                  </div>
                  {topMovie.rt.audience && (
                    <div className="flex items-center gap-1">
                      <span className="text-base">🍿</span>
                      <span className="text-sm font-bold">{topMovie.rt.audience}%</span>
                    </div>
                  )}
                </a>
                {topMovie.reviews && (
                  <div className="space-y-1.5 mb-5">
                    {topMovie.reviews.map((r, i) => (
                      <a key={i} href={topMovie.rottentomatoes ? `${topMovie.rottentomatoes}/reviews` : '#'} target="_blank" rel="noopener noreferrer" className="block text-sm text-gray-500 italic hover:text-red-400 transition-colors">
                        "{r.quote}" <span className="text-gray-600 not-italic text-xs font-medium">— {r.source}</span>
                      </a>
                    ))}
                  </div>
                )}
              </div>
              <div>
                <a href={topMovie.boxofficemojo} target="_blank" rel="noopener noreferrer" className="block hover:opacity-80 -mx-1 px-1 rounded-lg transition-colors">
                  <div className="grid grid-cols-4 gap-4 pt-4 mb-3" style={{ borderTop: '1px solid #1a1a1a' }}>
                    <div>
                      <p className="text-[10px] text-gray-600 uppercase tracking-wider">Weekend Gross</p>
                      <p className="text-xl font-bold" style={{ color: '#dc2626' }}>{formatMoneyFull(topMovie.weekend)}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-600 uppercase tracking-wider">Domestic Total</p>
                      <p className="text-xl font-bold text-white">{formatMoneyFull(topMovie.total)}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-600 uppercase tracking-wider">Theaters (US)</p>
                      <p className="text-lg font-semibold text-gray-300">{topMovie.theaters.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-600 uppercase tracking-wider">Per Theater Avg</p>
                      <p className="text-lg font-semibold text-gray-300">{formatMoney(Math.round(topMovie.weekend / topMovie.theaters))}</p>
                    </div>
                  </div>
                </a>
                {(() => {
                  const entry = trendData[topMovie.title];
                  const dom = entry ? entry.domestic : [topMovie.weekend / 1_000_000];
                  return (
                    <div className="mt-3">
                      <p className="text-[10px] text-gray-600 uppercase tracking-wider mb-2">Weekly Trend ($M)</p>
                      <MiniBarChart data={dom} color="bg-red-600" numStyle={{ color: "#dc2626" }} valColor="text-gray-500" labelColor="text-gray-600" />
                    </div>
                  );
                })()}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="max-w-6xl mx-auto px-6 pb-16">
        <h2 className="text-sm font-extrabold mb-5 flex items-center gap-2 uppercase tracking-widest text-gray-400">
          <span className="w-8 h-px" style={{ background: '#222' }} />
          Full Top 10
        </h2>
        <div className="rounded-2xl overflow-hidden" style={{ background: '#0a0a0a', border: '1px solid #1a1a1a' }}>
          <table className="w-full">
            <thead>
              <tr className="text-xs text-gray-600 uppercase tracking-wider" style={{ borderBottom: '1px solid #1a1a1a' }}>
                <th className="text-left pl-6 py-3 font-medium">#</th>
                <th className="text-left py-3 font-medium">Film</th>
                <th className="text-left py-3 font-medium">Studio</th>
                <th className="text-left py-3 font-medium">Genre</th>
                <th className="text-center py-3 font-medium">Critics</th>
                <th className="text-center py-3 font-medium">Audience</th>
                <th className="text-right py-3 font-medium">Weekend</th>
                <th className="text-right py-3 font-medium">Change</th>
                <th className="text-right py-3 font-medium">Total</th>
                <th className="text-right pr-6 py-3 font-medium">Weeks</th>
              </tr>
            </thead>
            <tbody>
              {movies.map((movie) => (
                <tr
                  key={movie.rank}
                  onClick={() => setPosterMovie(movie)}
                  className="transition-colors cursor-pointer"
                  style={{ borderBottom: '1px solid #111' }}
                  onMouseEnter={(e) => e.currentTarget.style.background = '#111'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                >
                  <td className="pl-6 py-3 text-lg font-extrabold text-gray-700">{movie.rank}</td>
                  <td className="py-3">
                    <div className="flex items-center gap-3">
                      <img src={movie.poster} alt={movie.title} className="w-9 h-13 object-cover rounded-md" />
                      <p className="font-bold text-sm text-white">{movie.title}</p>
                    </div>
                  </td>
                  <td className="py-3 text-xs text-gray-600">{movie.studio}</td>
                  <td className="py-3 text-xs text-gray-600">{movie.genre}</td>
                  <td className="py-3 text-center"><RTBadge score={movie.rt.critics} type="critics" /></td>
                  <td className="py-3 text-center">
                    {movie.rt.audience ? <RTBadge score={movie.rt.audience} type="audience" /> : <span className="text-xs text-gray-700">—</span>}
                  </td>
                  <td className="py-3 text-right font-bold text-sm text-gray-200">{formatMoney(movie.weekend)}</td>
                  <td className="py-3 text-right">
                    {movie.change !== null ? (
                      <span className={`text-sm font-medium ${movie.change >= 0 ? "text-green-500" : "text-red-400"}`}>{movie.change}%</span>
                    ) : (
                      <span className="text-xs px-2 py-0.5 rounded font-bold uppercase" style={{ background: '#dc2626', color: '#fff', letterSpacing: '0.05em' }}>NEW</span>
                    )}
                  </td>
                  <td className="py-3 text-right text-sm text-gray-500">{formatMoney(movie.total)}</td>
                  <td className="pr-6 py-3 text-right text-sm text-gray-600">{movie.weeks}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      </>
      )}
      {/* Footer */}
      <footer style={{ borderTop: '1px solid #1a1a1a', background: '#000' }}>
        <div className="max-w-6xl mx-auto px-6 py-10">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2.5 mb-2">
                <div className="rounded" style={{ width: 5, height: 18, background: '#dc2626' }} />
                <span className="text-xs font-extrabold uppercase tracking-widest">The Box Office</span>
              </div>
              <p className="text-xs text-gray-700 max-w-xs">Weekend domestic box office estimates. Updated every Sunday.</p>
            </div>
            <div className="text-right">
              <p className="text-xs font-medium text-gray-600 mb-2">Data Sources</p>
              <div className="flex flex-col gap-1 text-xs text-gray-700">
                <a href="https://www.boxofficemojo.com" target="_blank" rel="noopener noreferrer" className="hover:text-gray-400 transition-colors">Box Office Mojo</a>
                <a href="https://www.rottentomatoes.com" target="_blank" rel="noopener noreferrer" className="hover:text-gray-400 transition-colors">Rotten Tomatoes</a>
              </div>
            </div>
          </div>
          <div className="mt-6 pt-4 text-[11px] text-gray-800" style={{ borderTop: '1px solid #111' }}>
            &copy; {new Date().getFullYear()} The Box Office. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
