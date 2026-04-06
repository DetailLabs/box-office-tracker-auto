import React from "react";
import { movies, weekendDate, formatMoney, formatMoneyFull } from "./data";

// Design 2: Bento Grid — asymmetric dashboard grid, modern analytics feel
export default function Design2() {
  const topMovie = movies[0];
  const top3 = movies.slice(0, 3);
  const rest = movies.slice(3);
  const totalWeekend = movies.reduce((s, m) => s + m.weekend, 0);
  const newReleases = movies.filter((m) => m.weeks === 1).length;

  return (
    <div className="min-h-screen bg-[#f5f5f7] text-gray-900 font-sans">
      {/* Nav */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-200/60">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
          <span className="text-lg font-bold tracking-tight">
            <span className="text-indigo-600">Box</span>Office
          </span>
          <div className="flex items-center gap-4 text-sm">
            <span className="text-gray-900 font-semibold">Weekend</span>
            <span className="text-gray-400 hover:text-gray-600 cursor-pointer">Weekly</span>
            <span className="text-gray-400 hover:text-gray-600 cursor-pointer">All Time</span>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Bento Grid */}
        <div className="grid grid-cols-4 grid-rows-[auto_auto] gap-4 mb-8">
          {/* Hero — spans 2 cols, 2 rows */}
          <div className="col-span-2 row-span-2 bg-white rounded-3xl shadow-sm border border-gray-200/60 overflow-hidden">
            <div className="relative">
              <img
                src={topMovie.poster.replace("/w500/", "/w780/")}
                alt={topMovie.title}
                className="w-full h-64 object-cover object-top"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-4 left-5 right-5">
                <div className="flex items-center gap-2 mb-1">
                  <span className="bg-indigo-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-md">#1</span>
                  {topMovie.change === null && (
                    <span className="bg-white/20 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-0.5 rounded-md">NEW</span>
                  )}
                </div>
                <h2 className="text-2xl font-bold text-white">{topMovie.title}</h2>
                <p className="text-sm text-white/60">{topMovie.studio} · {topMovie.genre}</p>
              </div>
            </div>
            <div className="p-5">
              <div className="flex items-center gap-3 mb-4">
                <span className="flex items-center gap-1 text-sm font-semibold">🍅 {topMovie.rt.critics}%</span>
                {topMovie.rt.audience && <span className="flex items-center gap-1 text-sm font-semibold">🍿 {topMovie.rt.audience}%</span>}
              </div>
              {topMovie.reviews && (
                <div className="space-y-1.5 mb-4">
                  {topMovie.reviews.slice(0, 2).map((r, i) => (
                    <p key={i} className="text-xs text-gray-500 italic leading-relaxed">
                      "{r.quote}" <span className="text-gray-400 not-italic font-medium">— {r.source}</span>
                    </p>
                  ))}
                </div>
              )}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-indigo-50 rounded-2xl p-3">
                  <p className="text-[10px] text-indigo-400 uppercase tracking-wider font-medium">Weekend</p>
                  <p className="text-xl font-bold text-indigo-600">{formatMoneyFull(topMovie.weekend)}</p>
                </div>
                <div className="bg-gray-50 rounded-2xl p-3">
                  <p className="text-[10px] text-gray-400 uppercase tracking-wider font-medium">Total</p>
                  <p className="text-xl font-bold">{formatMoneyFull(topMovie.total)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Stats cards — top right */}
          <div className="bg-white rounded-3xl shadow-sm border border-gray-200/60 p-5 flex flex-col justify-between">
            <p className="text-xs text-gray-400 uppercase tracking-wider font-medium">Total Weekend Gross</p>
            <p className="text-3xl font-bold text-indigo-600">{formatMoney(totalWeekend)}</p>
            <p className="text-xs text-gray-400">{weekendDate}</p>
          </div>
          <div className="bg-white rounded-3xl shadow-sm border border-gray-200/60 p-5 flex flex-col justify-between">
            <p className="text-xs text-gray-400 uppercase tracking-wider font-medium">New Releases</p>
            <p className="text-3xl font-bold">{newReleases}</p>
            <p className="text-xs text-gray-400">This weekend</p>
          </div>

          {/* #2 and #3 movies */}
          {top3.slice(1).map((movie) => (
            <div key={movie.rank} className="bg-white rounded-3xl shadow-sm border border-gray-200/60 p-4 flex items-center gap-3">
              <img src={movie.poster} alt={movie.title} className="w-14 h-20 object-cover rounded-xl shrink-0" />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <span className="text-xs font-bold text-gray-400">#{movie.rank}</span>
                  {movie.weeks === 1 && <span className="text-[9px] bg-indigo-100 text-indigo-600 px-1.5 py-0.5 rounded font-bold">NEW</span>}
                </div>
                <h3 className="font-semibold text-sm truncate">{movie.title}</h3>
                <p className="text-[10px] text-gray-400">{movie.studio}</p>
                <p className="text-sm font-bold text-indigo-600 mt-1">{formatMoney(movie.weekend)}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Rest of rankings */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-200/60 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="font-bold text-lg">Rankings #4 – #10</h2>
          </div>
          <div className="divide-y divide-gray-50">
            {rest.map((movie) => (
              <div key={movie.rank} className="flex items-center gap-4 px-6 py-3 hover:bg-gray-50/50 transition-colors">
                <span className="text-lg font-bold text-gray-300 w-8 text-center">{movie.rank}</span>
                <img src={movie.poster} alt={movie.title} className="w-10 h-14 object-cover rounded-lg" />
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-sm truncate">{movie.title}</h3>
                  <p className="text-xs text-gray-400">{movie.studio} · {movie.genre}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-sm">{formatMoney(movie.weekend)}</p>
                  <p className="text-[10px] text-gray-400">weekend</p>
                </div>
                <div className="text-right w-20">
                  <p className="text-sm text-gray-500">{formatMoney(movie.total)}</p>
                  <p className="text-[10px] text-gray-400">total</p>
                </div>
                <div className="w-14 text-right">
                  {movie.change !== null ? (
                    <span className={`text-xs font-semibold ${movie.change >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                      {movie.change}%
                    </span>
                  ) : (
                    <span className="text-[9px] bg-indigo-100 text-indigo-600 px-2 py-0.5 rounded-full font-bold">NEW</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <footer className="mt-12 border-t border-gray-200/60">
        <div className="max-w-7xl mx-auto px-6 py-8 text-center text-sm text-gray-400">
          BoxOffice · Data for illustration purposes · {weekendDate}
        </div>
      </footer>
    </div>
  );
}
