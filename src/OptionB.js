import React, { useState } from "react";
import { formatMoney, formatMoneyFull } from "./data";
import PosterModal, { MiniBarChart, trendData as defaultTrendData } from "./PosterModal";
import AnalyticsCurrent from "./AnalyticsCurrent";

function RTBadge({ score, type = "critics", hideIcon = false }) {
  if (score === null || score === undefined) return null;
  const isFresh = score >= 60;
  const icon = type === "critics"
    ? (isFresh ? "🍅" : "🟢")
    : (isFresh ? "🍿" : "🍿");
  const color = type === "critics"
    ? (isFresh ? "text-red-600" : "text-green-700")
    : "text-amber-600";
  return (
    <span className={`inline-flex items-center gap-0.5 text-xs font-semibold ${color}`}>
      {!hideIcon && <span className="text-[11px]">{icon}</span>}
      {score}%
    </span>
  );
}

export default function OptionB({ darkToggle, page, setPage, weekends, selectedWeekend, onWeekendChange, trendData: trendDataProp }) {
  const trendData = trendDataProp || defaultTrendData;
  const movies = selectedWeekend.movies;
  const topMovie = movies[0];
  const [posterMovie, setPosterMovie] = useState(null);

  return (
    <div className="min-h-screen bg-[#faf9f6] text-gray-900 font-sans">
      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(-4px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fadeIn { animation: fadeIn 0.2s ease-out; }
        @keyframes scaleIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
        .animate-scaleIn { animation: scaleIn 0.2s ease-out; }
      `}</style>

      {/* Poster Modal */}
      <PosterModal movie={posterMovie} onClose={() => setPosterMovie(null)} trendData={trendData} />

      {/* Nav */}
      <nav className="border-b border-gray-200 bg-white sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 md:px-6 py-3 md:py-4 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 cursor-pointer shrink-0" onClick={() => setPage("weekend")}>
            <svg className="w-6 h-6 sm:w-8 sm:h-8" viewBox="0 0 32 32" fill="none">
              <rect x="2" y="6" width="28" height="20" rx="3" fill="#e11d48" />
              <rect x="5" y="9" width="22" height="14" rx="1" fill="white" />
              <circle cx="16" cy="16" r="4" fill="#e11d48" opacity="0.9" />
              <circle cx="16" cy="16" r="2" fill="white" />
            </svg>
            <span className="hidden sm:inline text-lg md:text-xl font-bold tracking-tight">The Box Office</span>
          </div>
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap justify-end">
            {/* Weekend Selector */}
            <div className="relative">
              <select
                className="text-xs border border-gray-200 rounded-lg pl-2 pr-6 sm:pl-3 sm:pr-7 py-1.5 bg-white text-gray-600 cursor-pointer appearance-none max-w-[140px] sm:max-w-none"
                value={selectedWeekend.id}
                onChange={(e) => onWeekendChange(e.target.value)}
              >
                {weekends.map((w) => (
                  <option key={w.id} value={w.id}>{w.label}</option>
                ))}
              </select>
              <svg className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-gray-400" width="14" height="14" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
              </svg>
            </div>
            <button onClick={() => setPage("weekend")} className={`text-sm font-medium pb-1 transition-colors cursor-pointer ${page === "weekend" ? "text-gray-900 border-b-2 border-rose-500" : "text-gray-400 hover:text-gray-600"}`}>Numbers</button>
            <button onClick={() => setPage("insights")} className={`text-sm font-medium pb-1 transition-colors cursor-pointer ${page === "insights" ? "text-gray-900 border-b-2 border-rose-500" : "text-gray-400 hover:text-gray-600"}`}>Insights</button>
            {darkToggle}
          </div>
        </div>
      </nav>

      {page === "insights" ? (
        <div className="max-w-6xl mx-auto px-4 md:px-6 py-10">
          <h1 className="text-2xl font-extrabold mb-6 flex items-center gap-2">
            <span className="w-8 h-px bg-gray-300" />
            Weekend Insights
          </h1>
          <AnalyticsCurrent weekends={weekends} selectedWeekend={selectedWeekend} />
        </div>
      ) : (
      <>
      {/* #1 Movie — Expanded Hero Card */}
      <div className="max-w-6xl mx-auto px-4 md:px-6 pt-8 pb-8">
        <div
          className="bg-white rounded-2xl shadow-sm border border-gray-100"
        >
          <div className="flex flex-col md:flex-row md:items-stretch gap-4 md:gap-6 p-4 md:p-6">
            <div className="shrink-0 md:w-72">
              <img
                src={topMovie.poster.replace("/w500/", "/w780/")}
                alt={topMovie.title}
                className="w-full md:h-full rounded-xl object-contain md:object-cover"
              />
            </div>
            <div className="flex-1 flex flex-col justify-between min-h-0">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="bg-rose-600 text-white text-xs font-bold px-2.5 py-0.5 rounded-full">
                    #1 This Weekend
                  </span>
                  {topMovie.change === null && (
                    <span className="bg-rose-100 text-rose-600 text-xs font-medium px-2 py-0.5 rounded-full">
                      NEW
                    </span>
                  )}
                </div>
                <a href={topMovie.rottentomatoes} target="_blank" rel="noopener noreferrer" className="hover:text-rose-600 transition-colors">
                  <h2 className="text-2xl md:text-3xl font-extrabold mb-1 tracking-tight">{topMovie.title}</h2>
                </a>
                <p className="text-sm text-gray-500">{topMovie.studio}</p>
                <p className="text-sm text-gray-400 mb-3">
                  {topMovie.rating} · {topMovie.genre}{topMovie.runtime ? ` · ${Math.floor(topMovie.runtime / 60)}h ${topMovie.runtime % 60}m` : ''}
                </p>
                <div className="flex items-center gap-4 mb-3 pb-3 border-b border-gray-100">
                  <a href={topMovie.rottentomatoes} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:opacity-70 transition-opacity">
                    <span className="text-lg">🍅</span>
                    <div>
                      <p className="text-sm font-bold">{topMovie.rt.critics}%</p>
                      <p className="text-[10px] text-gray-400">Critics</p>
                    </div>
                  </a>
                  {topMovie.rt.audience && (
                    <a href={topMovie.rottentomatoes} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:opacity-70 transition-opacity">
                      <span className="text-lg">🍿</span>
                      <div>
                        <p className="text-sm font-bold">{topMovie.rt.audience}%</p>
                        <p className="text-[10px] text-gray-400">Audience</p>
                      </div>
                    </a>
                  )}
                </div>
                {topMovie.reviews && (
                  <div className="space-y-1.5 mb-3 pb-3 border-b border-gray-100">
                    {topMovie.reviews.slice(0, 3).map((r, i) => (
                      <a key={i} href={topMovie.rottentomatoes ? `${topMovie.rottentomatoes}/reviews` : '#'} target="_blank" rel="noopener noreferrer" className="block text-xs text-gray-500 italic leading-relaxed hover:text-rose-600 transition-colors">
                        "{r.quote}" <span className="text-gray-400 not-italic font-medium">— {r.source}</span>
                      </a>
                    ))}
                  </div>
                )}
              </div>
              <div>
                <a href={topMovie.boxofficemojo} target="_blank" rel="noopener noreferrer" className="block hover:bg-gray-50 rounded-lg transition-colors">
                  <div className="grid grid-cols-2 gap-x-6 gap-y-2 pt-3 mb-2">
                    <div>
                      <p className="text-[10px] text-gray-400 uppercase tracking-wider">Weekend Gross</p>
                      <p className="text-lg font-bold text-rose-600">{formatMoneyFull(topMovie.weekend)}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-400 uppercase tracking-wider">Domestic Total</p>
                      <p className="text-lg font-bold">{formatMoneyFull(topMovie.total)}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-400 uppercase tracking-wider">Theaters (US)</p>
                      <p className="text-base font-semibold">{topMovie.theaters.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-400 uppercase tracking-wider">Per Theater Avg</p>
                      <p className="text-base font-semibold">{formatMoney(Math.round(topMovie.weekend / topMovie.theaters))}</p>
                    </div>
                  </div>
                </a>
                {(() => {
                  const entry = trendData[topMovie.title];
                  const allWeeks = entry ? entry.domestic : [+(topMovie.weekend / 1_000_000).toFixed(1)];
                  const dom = allWeeks.slice(0, topMovie.weeks);
                  return (
                    <div className="mt-2">
                      <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-4">Weekly Trend ($M)</p>
                      <MiniBarChart data={dom} />
                    </div>
                  );
                })()}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Full Top 10 Table */}
      <div className="max-w-6xl mx-auto px-4 md:px-6 pb-16">
        <h2 className="text-xl font-bold mb-5 flex items-center gap-2">
          <span className="w-8 h-px bg-gray-300" />
          Full Top 10
        </h2>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
          <table className="w-full">
            <thead>
              <tr className="text-xs text-gray-400 uppercase tracking-wider border-b border-gray-100 sticky top-[49px] md:top-[57px] z-10 bg-white">
                <th className="text-center pl-3 pr-2 md:pl-6 md:pr-3 py-3 font-medium w-10 md:w-14">#</th>
                <th className="text-left py-3 font-medium">Film</th>
                <th className="text-left py-3 px-2 font-medium hidden xl:table-cell">Studio</th>
                <th className="text-left py-3 px-2 font-medium hidden xl:table-cell">Genre</th>
                <th className="text-center py-3 px-2 font-medium hidden md:table-cell">Critics</th>
                <th className="text-center py-3 px-2 font-medium hidden md:table-cell">Audience</th>
                <th className="text-right py-3 pl-2 font-medium">Weekend</th>
                <th className="text-right py-3 px-2 font-medium hidden md:table-cell">Change</th>
                <th className="text-right py-3 pl-2 pr-3 md:pr-0 font-medium">Total</th>
                <th className="text-right pr-6 py-3 pl-2 font-medium hidden md:table-cell">Weeks</th>
              </tr>
            </thead>
            <tbody>
              {movies.map((movie) => (
                <tr
                  key={movie.rank}
                  onClick={() => setPosterMovie(movie)}
                  className="border-b border-gray-50 last:border-0 hover:bg-rose-50/30 transition-colors cursor-pointer"
                >
                  <td className="pl-3 pr-2 md:pl-6 md:pr-3 py-3 font-sans text-lg font-bold text-gray-300 text-center w-10 md:w-14">
                    {movie.rank}
                  </td>
                  <td className="py-3">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <img
                        src={movie.poster}
                        alt={movie.title}
                        className="w-9 h-13 sm:w-10 sm:h-14 object-cover rounded-md"
                      />
                      <p className="font-semibold text-sm truncate max-w-[140px] sm:max-w-[220px] md:max-w-[280px] xl:max-w-[340px]">{movie.title}</p>
                    </div>
                  </td>
                  <td className="py-3 px-2 text-xs text-gray-500 hidden xl:table-cell">{movie.studio}</td>
                  <td className="py-3 px-2 text-xs text-gray-500 hidden xl:table-cell">{movie.genre}</td>
                  <td className="py-3 px-2 text-center hidden md:table-cell">
                    <RTBadge score={movie.rt.critics} type="critics" hideIcon />
                  </td>
                  <td className="py-3 px-2 text-center hidden md:table-cell">
                    {movie.rt.audience ? (
                      <RTBadge score={movie.rt.audience} type="audience" hideIcon />
                    ) : (
                      <span className="text-xs text-gray-300">—</span>
                    )}
                  </td>
                  <td className="py-3 pl-2 text-right font-semibold text-sm">
                    {formatMoney(movie.weekend)}
                  </td>
                  <td className="py-3 px-2 text-right hidden md:table-cell">
                    {movie.change !== null ? (
                      <span className={`text-sm font-medium ${movie.change >= 0 ? "text-green-600" : "text-red-500"}`}>
                        {movie.change}%
                      </span>
                    ) : (
                      <span className="text-xs bg-rose-100 text-rose-600 px-2 py-0.5 rounded-full font-medium">
                        NEW
                      </span>
                    )}
                  </td>
                  <td className="py-3 pl-2 text-right text-sm text-gray-600 pr-3 md:pr-0">
                    {formatMoney(movie.total)}
                  </td>
                  <td className="pr-6 py-3 pl-2 text-right text-sm text-gray-400 hidden md:table-cell">
                    {movie.weeks}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      </>
      )}
      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white">
        <div className="max-w-6xl mx-auto px-4 md:px-6 py-10">
          <div className="flex flex-col md:flex-row items-start md:justify-between gap-6 md:gap-0">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <svg className="w-6 h-6" viewBox="0 0 32 32" fill="none">
                  <rect x="2" y="6" width="28" height="20" rx="3" fill="#e11d48" />
                  <rect x="5" y="9" width="22" height="14" rx="1" fill="white" />
                  <circle cx="16" cy="16" r="4" fill="#e11d48" opacity="0.9" />
                  <circle cx="16" cy="16" r="2" fill="white" />
                </svg>
                <span className="text-sm font-bold">The Box Office</span>
              </div>
              <p className="text-xs text-gray-400 max-w-xs">
                Weekend domestic box office estimates. Updated every Sunday at 3 PM EST.
              </p>
            </div>
            <div className="text-left md:text-right">
              <p className="text-xs font-medium text-gray-500 mb-2">Data Sources</p>
              <div className="flex flex-col gap-1 text-xs text-gray-400">
                <a href="https://www.boxofficemojo.com" target="_blank" rel="noopener noreferrer" className="hover:text-gray-600 transition-colors">Box Office Mojo</a>
                <a href="https://www.rottentomatoes.com" target="_blank" rel="noopener noreferrer" className="hover:text-gray-600 transition-colors">Rotten Tomatoes</a>
              </div>
            </div>
          </div>
          <div className="mt-6 pt-4 border-t border-gray-100 text-[11px] text-gray-300">
            &copy; {new Date().getFullYear()} The Box Office. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
