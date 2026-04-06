import React from "react";
import { movies, weekendDate, formatMoney, formatMoneyFull } from "./data";

// Design 5: Soft Rounded — warm pastels, large radii, friendly & modern
export default function Design5() {
  const topMovie = movies[0];
  const rest = movies.slice(1);

  const pastelColors = [
    { bg: "bg-rose-50", text: "text-rose-600", accent: "bg-rose-100" },
    { bg: "bg-violet-50", text: "text-violet-600", accent: "bg-violet-100" },
    { bg: "bg-sky-50", text: "text-sky-600", accent: "bg-sky-100" },
    { bg: "bg-amber-50", text: "text-amber-600", accent: "bg-amber-100" },
    { bg: "bg-emerald-50", text: "text-emerald-600", accent: "bg-emerald-100" },
    { bg: "bg-pink-50", text: "text-pink-600", accent: "bg-pink-100" },
    { bg: "bg-indigo-50", text: "text-indigo-600", accent: "bg-indigo-100" },
    { bg: "bg-teal-50", text: "text-teal-600", accent: "bg-teal-100" },
    { bg: "bg-orange-50", text: "text-orange-600", accent: "bg-orange-100" },
  ];

  return (
    <div className="min-h-screen bg-[#fffbf7] text-gray-800 font-sans">
      {/* Nav */}
      <nav className="sticky top-0 z-50 bg-[#fffbf7]/80 backdrop-blur-xl">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-gradient-to-br from-rose-400 to-orange-300 rounded-2xl flex items-center justify-center shadow-md shadow-rose-200/60">
              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
            </div>
            <span className="text-lg font-bold tracking-tight">BoxOffice</span>
          </div>
          <div className="flex items-center gap-1 bg-gray-100 rounded-2xl p-1">
            <button className="bg-white text-gray-900 text-sm font-semibold px-4 py-1.5 rounded-xl shadow-sm">Weekend</button>
            <button className="text-gray-400 text-sm font-medium px-4 py-1.5 rounded-xl hover:text-gray-600">Weekly</button>
            <button className="text-gray-400 text-sm font-medium px-4 py-1.5 rounded-xl hover:text-gray-600">All Time</button>
          </div>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* Date chip */}
        <div className="flex justify-center mb-8">
          <span className="bg-rose-50 text-rose-500 text-xs font-semibold px-4 py-1.5 rounded-full">
            {weekendDate}
          </span>
        </div>

        {/* Hero Card */}
        <div className="bg-white rounded-[2rem] shadow-xl shadow-rose-100/40 border border-rose-100/50 p-7 mb-8">
          <div className="flex gap-7 items-start">
            <div className="relative shrink-0">
              <img
                src={topMovie.poster.replace("/w500/", "/w780/")}
                alt={topMovie.title}
                className="w-44 rounded-2xl shadow-lg"
                style={{ aspectRatio: '2/3' }}
              />
              <div className="absolute -top-2 -right-2 w-10 h-10 bg-gradient-to-br from-rose-400 to-orange-400 rounded-xl flex items-center justify-center font-black text-white text-sm shadow-lg shadow-rose-300/50 rotate-3">
                #1
              </div>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                {topMovie.change === null && (
                  <span className="bg-emerald-100 text-emerald-600 text-[10px] font-bold px-2.5 py-1 rounded-lg uppercase">New</span>
                )}
                <span className="bg-gray-100 text-gray-500 text-[10px] font-medium px-2.5 py-1 rounded-lg">{topMovie.rating}</span>
                <span className="bg-gray-100 text-gray-500 text-[10px] font-medium px-2.5 py-1 rounded-lg">{topMovie.genre}</span>
              </div>
              <h2 className="text-3xl font-bold tracking-tight mb-1">{topMovie.title}</h2>
              <p className="text-sm text-gray-400 mb-4">{topMovie.studio}</p>
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-red-50 rounded-xl px-3 py-1.5 flex items-center gap-1.5">
                  <span className="text-sm">🍅</span>
                  <span className="text-sm font-bold text-red-600">{topMovie.rt.critics}%</span>
                </div>
                {topMovie.rt.audience && (
                  <div className="bg-amber-50 rounded-xl px-3 py-1.5 flex items-center gap-1.5">
                    <span className="text-sm">🍿</span>
                    <span className="text-sm font-bold text-amber-600">{topMovie.rt.audience}%</span>
                  </div>
                )}
              </div>
              {/* Reviews */}
              {topMovie.reviews && (
                <div className="space-y-2 mb-5">
                  {topMovie.reviews.map((r, i) => (
                    <div key={i} className="bg-gray-50 rounded-xl px-4 py-2.5">
                      <p className="text-sm text-gray-600 italic">"{r.quote}"</p>
                      <p className="text-[10px] text-gray-400 font-semibold mt-0.5">— {r.source}</p>
                    </div>
                  ))}
                </div>
              )}
              <div className="grid grid-cols-4 gap-3">
                <div className="bg-rose-50 rounded-2xl p-3 text-center">
                  <p className="text-[9px] text-rose-400 uppercase tracking-wider font-semibold mb-0.5">Weekend</p>
                  <p className="text-lg font-bold text-rose-600">{formatMoney(topMovie.weekend)}</p>
                </div>
                <div className="bg-violet-50 rounded-2xl p-3 text-center">
                  <p className="text-[9px] text-violet-400 uppercase tracking-wider font-semibold mb-0.5">Total</p>
                  <p className="text-lg font-bold text-violet-600">{formatMoney(topMovie.total)}</p>
                </div>
                <div className="bg-sky-50 rounded-2xl p-3 text-center">
                  <p className="text-[9px] text-sky-400 uppercase tracking-wider font-semibold mb-0.5">Theaters</p>
                  <p className="text-lg font-bold text-sky-600">{topMovie.theaters.toLocaleString()}</p>
                </div>
                <div className="bg-amber-50 rounded-2xl p-3 text-center">
                  <p className="text-[9px] text-amber-400 uppercase tracking-wider font-semibold mb-0.5">Per Theater</p>
                  <p className="text-lg font-bold text-amber-600">{formatMoney(Math.round(topMovie.weekend / topMovie.theaters))}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Rankings — colorful cards */}
        <h2 className="text-lg font-bold mb-4 text-center">Top 10 This Weekend</h2>
        <div className="grid grid-cols-3 gap-3 mb-4">
          {rest.slice(0, 3).map((movie, i) => {
            const c = pastelColors[i];
            return (
              <div key={movie.rank} className={`${c.bg} rounded-2xl p-4 border border-white/60`}>
                <div className="flex items-center gap-3 mb-3">
                  <img src={movie.poster} alt={movie.title} className="w-12 h-[4.5rem] object-cover rounded-xl" />
                  <div>
                    <span className={`text-[10px] font-bold ${c.text}`}>#{movie.rank}</span>
                    <h3 className="font-bold text-sm">{movie.title}</h3>
                    <p className="text-[10px] text-gray-400">{movie.studio}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className={`font-bold ${c.text}`}>{formatMoney(movie.weekend)}</span>
                  {movie.change !== null ? (
                    <span className={`text-xs font-semibold ${movie.change >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>{movie.change}%</span>
                  ) : (
                    <span className={`text-[10px] ${c.accent} ${c.text} px-2 py-0.5 rounded-full font-bold`}>NEW</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Rest as list */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {rest.slice(3).map((movie, i) => {
            const c = pastelColors[i + 3];
            return (
              <div key={movie.rank} className="flex items-center gap-4 px-5 py-3 border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors">
                <div className={`w-8 h-8 ${c.accent} rounded-xl flex items-center justify-center font-bold text-sm ${c.text}`}>
                  {movie.rank}
                </div>
                <img src={movie.poster} alt={movie.title} className="w-9 h-13 object-cover rounded-lg" />
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-sm truncate">{movie.title}</h3>
                  <p className="text-[10px] text-gray-400">{movie.studio}</p>
                </div>
                <span className="font-bold text-sm">{formatMoney(movie.weekend)}</span>
                <span className="text-sm text-gray-400 w-16 text-right">{formatMoney(movie.total)}</span>
                <div className="w-12 text-right">
                  {movie.change !== null ? (
                    <span className={`text-xs font-semibold ${movie.change >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>{movie.change}%</span>
                  ) : (
                    <span className="text-[9px] font-bold text-rose-500">NEW</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <footer className="mt-12">
        <div className="max-w-5xl mx-auto px-6 py-8 text-center text-sm text-gray-300">
          BoxOffice · Data for illustration purposes · {weekendDate}
        </div>
      </footer>
    </div>
  );
}
