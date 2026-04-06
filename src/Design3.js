import React, { useState } from "react";
import { movies, weekendDate, formatMoney, formatMoneyFull } from "./data";
import PosterModal, { MiniBarChart, trendData } from "./PosterModal";
import AnalyticsEditorial from "./AnalyticsEditorial";

// Design 3: Minimal Editorial — newspaper inspired, strong typography, lots of whitespace
export default function Design3() {
  const topMovie = movies[0];
  const [posterMovie, setPosterMovie] = useState(null);
  const [analyticsOpen, setAnalyticsOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans">
      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(-4px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fadeIn { animation: fadeIn 0.2s ease-out; }
        @keyframes scaleIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
        .animate-scaleIn { animation: scaleIn 0.2s ease-out; }
      `}</style>

      {/* Poster Modal */}
      <PosterModal movie={posterMovie} onClose={() => setPosterMovie(null)} />

      {/* Nav */}
      <nav className="border-b border-gray-900 px-6">
        <div className="max-w-6xl mx-auto py-5 flex items-center justify-between">
          <h1 className="text-3xl font-black tracking-tighter uppercase">The Box Office</h1>
          <span className="text-xs font-semibold uppercase tracking-widest text-gray-900 border-b-2 border-gray-900 pb-1">Weekend · {weekendDate}</span>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6">
        {/* Hero — editorial layout */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 mt-8 mb-8">
          <div className="flex gap-8 p-7">
          <img
            src={topMovie.poster.replace("/w500/", "/w780/")}
            alt={topMovie.title}
            className="w-64 rounded-xl shrink-0"
            style={{ aspectRatio: '2/3', objectFit: 'cover' }}
          />
          <div className="flex-1 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="bg-gray-900 text-white text-[10px] font-bold px-3 py-1 uppercase tracking-widest">#1 This Weekend</span>
                {topMovie.change === null && (
                  <span className="border border-gray-900 text-[10px] font-bold px-3 py-1 uppercase tracking-widest">New Release</span>
                )}
              </div>
              <a href={topMovie.rottentomatoes} target="_blank" rel="noopener noreferrer" className="hover:text-gray-600 transition-colors">
                <h2 className="text-5xl font-black tracking-tight leading-[1.05] mb-3">{topMovie.title}</h2>
              </a>
              <p className="text-lg text-gray-400 mb-5">
                {topMovie.studio} · {topMovie.rating} · {topMovie.genre}{topMovie.runtime ? ` · ${Math.floor(topMovie.runtime / 60)}h ${topMovie.runtime % 60}m` : ''}
              </p>
              <a href={topMovie.rottentomatoes} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-4 mb-6 hover:opacity-70 transition-opacity">
                <span className="text-sm font-semibold">🍅 {topMovie.rt.critics}% Critics</span>
                {topMovie.rt.audience && <span className="text-sm font-semibold">🍿 {topMovie.rt.audience}% Audience</span>}
              </a>
              {/* Reviews — link to RT reviews */}
              {topMovie.reviews && (
                <div className="border-l-2 border-gray-200 pl-4 space-y-3 mb-6">
                  {topMovie.reviews.map((r, i) => (
                    <a key={i} href={topMovie.rottentomatoes ? `${topMovie.rottentomatoes}/reviews` : '#'} target="_blank" rel="noopener noreferrer" className="block hover:text-gray-900 transition-colors">
                      <p className="text-sm text-gray-600 italic leading-relaxed">"{r.quote}"</p>
                      <p className="text-xs text-gray-400 font-semibold mt-0.5">— {r.source}</p>
                    </a>
                  ))}
                </div>
              )}
            </div>
            <div>
              <a href={topMovie.boxofficemojo} target="_blank" rel="noopener noreferrer" className="block hover:bg-gray-50 -mx-2 px-2 rounded-lg transition-colors">
                <div className="grid grid-cols-4 gap-4 pt-4 border-t border-gray-100 mb-3">
                  <div>
                    <p className="text-[10px] text-gray-400 uppercase tracking-widest font-semibold mb-1">Weekend Gross</p>
                    <p className="text-xl font-black text-rose-600">{formatMoneyFull(topMovie.weekend)}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 uppercase tracking-widest font-semibold mb-1">Domestic Total</p>
                    <p className="text-xl font-black">{formatMoneyFull(topMovie.total)}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 uppercase tracking-widest font-semibold mb-1">Theaters (US)</p>
                    <p className="text-lg font-black">{topMovie.theaters.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 uppercase tracking-widest font-semibold mb-1">Per Theater (US)</p>
                    <p className="text-lg font-black">{formatMoney(Math.round(topMovie.weekend / topMovie.theaters))}</p>
                  </div>
                </div>
              </a>
              {/* Weekly Trend */}
              {(() => {
                const entry = trendData[topMovie.title];
                const dom = entry ? entry.domestic : [topMovie.weekend / 1_000_000];
                return (
                  <div className="mt-3">
                    <p className="text-[10px] text-gray-400 uppercase tracking-widest font-semibold mb-2">Weekly Trend ($M)</p>
                    <MiniBarChart data={dom} />
                  </div>
                );
              })()}
            </div>
          </div>
          </div>
        </div>

        {/* Full Top 10 Table — matching Current design columns */}
        <div className="py-10">
          <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-gray-400 mb-6 flex items-center gap-2">
            <span className="w-8 h-px bg-gray-300" />
            Full Top 10
          </h2>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="text-xs text-gray-400 uppercase tracking-wider border-b border-gray-100">
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
                    className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors cursor-pointer"
                  >
                    <td className="pl-6 py-3 text-lg font-black text-gray-200">
                      {movie.rank}
                    </td>
                    <td className="py-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={movie.poster}
                          alt={movie.title}
                          className="w-9 h-13 object-cover rounded-md"
                        />
                        <p className="font-bold text-sm">{movie.title}</p>
                      </div>
                    </td>
                    <td className="py-3 text-xs text-gray-500">{movie.studio}</td>
                    <td className="py-3 text-xs text-gray-500">{movie.genre}</td>
                    <td className="py-3 text-center">
                      {movie.rt.critics >= 60 ? (
                        <span className="inline-flex items-center gap-0.5 text-xs font-semibold text-red-600">
                          <span className="text-[11px]">🍅</span>{movie.rt.critics}%
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-0.5 text-xs font-semibold text-green-700">
                          <span className="text-[11px]">🟢</span>{movie.rt.critics}%
                        </span>
                      )}
                    </td>
                    <td className="py-3 text-center">
                      {movie.rt.audience ? (
                        <span className="inline-flex items-center gap-0.5 text-xs font-semibold text-amber-600">
                          <span className="text-[11px]">🍿</span>{movie.rt.audience}%
                        </span>
                      ) : (
                        <span className="text-xs text-gray-300">—</span>
                      )}
                    </td>
                    <td className="py-3 text-right font-bold text-sm">
                      {formatMoney(movie.weekend)}
                    </td>
                    <td className="py-3 text-right">
                      {movie.change !== null ? (
                        <span className={`text-sm font-medium ${movie.change >= 0 ? "text-green-600" : "text-red-500"}`}>
                          {movie.change}%
                        </span>
                      ) : (
                        <span className="text-xs bg-gray-900 text-white px-2 py-0.5 rounded-full font-medium">
                          NEW
                        </span>
                      )}
                    </td>
                    <td className="py-3 text-right text-sm text-gray-600">
                      {formatMoney(movie.total)}
                    </td>
                    <td className="pr-6 py-3 text-right text-sm text-gray-400">
                      {movie.weeks}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Weekend Analytics — collapsible */}
        <div className="py-10">
          <button
            onClick={() => setAnalyticsOpen(!analyticsOpen)}
            className="w-full flex items-center gap-2 mb-6 group cursor-pointer text-left"
          >
            <span className="w-8 h-px bg-gray-300" />
            <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-gray-400">Weekend Analytics</h2>
            <svg
              className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${analyticsOpen ? 'rotate-180' : ''}`}
              fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {analyticsOpen && <AnalyticsEditorial />}
        </div>
      </div>

      <footer className="border-t border-gray-900">
        <div className="max-w-6xl mx-auto px-6 py-10">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-sm font-black uppercase tracking-tight mb-2">The Box Office</h3>
              <p className="text-xs text-gray-400 max-w-xs">
                Weekend domestic box office estimates. Updated every Sunday.
              </p>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Data Sources</p>
              <div className="flex flex-col gap-1 text-xs text-gray-400">
                <a href="https://www.boxofficemojo.com" target="_blank" rel="noopener noreferrer" className="hover:text-gray-900 transition-colors">Box Office Mojo</a>
                <a href="https://www.rottentomatoes.com" target="_blank" rel="noopener noreferrer" className="hover:text-gray-900 transition-colors">Rotten Tomatoes</a>
              </div>
            </div>
          </div>
          <div className="mt-6 pt-4 border-t border-gray-200 text-[11px] text-gray-300">
            &copy; {new Date().getFullYear()} The Box Office. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
