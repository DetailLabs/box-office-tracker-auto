import React from "react";
import { movies, weekendDate, formatMoney, formatMoneyFull } from "./data";

// Option A: Dark Cinematic Leaderboard
export default function OptionA() {
  const topMovie = movies[0];
  const rest = movies.slice(1);

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white font-sans">
      {/* Nav */}
      <nav className="border-b border-white/10 backdrop-blur-md bg-[#0a0a0f]/80 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-amber-400 to-orange-600 rounded-lg flex items-center justify-center font-bold text-sm text-black">
              BO
            </div>
            <span className="text-lg font-semibold tracking-tight">
              BoxOffice<span className="text-amber-400">Pulse</span>
            </span>
          </div>
          <div className="flex items-center gap-6 text-sm text-gray-400">
            <span className="text-white font-medium">Weekend</span>
            <span className="hover:text-white cursor-pointer">Daily</span>
            <span className="hover:text-white cursor-pointer">All Time</span>
            <span className="hover:text-white cursor-pointer">Upcoming</span>
          </div>
        </div>
      </nav>

      {/* Hero: #1 Movie */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0f] via-[#0a0a0f]/80 to-transparent z-10" />
        <div
          className="absolute inset-0 bg-cover bg-center opacity-30 blur-sm scale-105"
          style={{ backgroundImage: `url(${topMovie.poster})` }}
        />
        <div className="relative z-20 max-w-7xl mx-auto px-6 py-16 flex gap-10 items-center">
          <img
            src={topMovie.poster}
            alt={topMovie.title}
            className="w-56 rounded-2xl shadow-2xl shadow-amber-500/20 ring-1 ring-white/10"
          />
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <span className="bg-amber-500 text-black font-bold text-xs px-3 py-1 rounded-full uppercase tracking-wider">
                #1 This Weekend
              </span>
              <span className="text-sm text-gray-400">{weekendDate}</span>
            </div>
            <h1 className="text-5xl font-bold tracking-tight mb-2">
              {topMovie.title}
            </h1>
            <p className="text-gray-400 mb-6">
              {topMovie.genre} · {topMovie.rating} · {topMovie.studio}
            </p>
            <div className="flex gap-10">
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                  Weekend Gross
                </p>
                <p className="text-3xl font-bold text-amber-400">
                  {formatMoney(topMovie.weekend)}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                  Total Gross
                </p>
                <p className="text-3xl font-bold">
                  {formatMoney(topMovie.total)}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                  Theaters
                </p>
                <p className="text-3xl font-bold">
                  {topMovie.theaters.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Rankings */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <h2 className="text-2xl font-bold mb-8">Weekend Rankings</h2>
        <div className="space-y-3">
          {rest.map((movie) => (
            <div
              key={movie.rank}
              className="group bg-white/[0.03] hover:bg-white/[0.07] border border-white/[0.06] rounded-2xl p-4 flex items-center gap-5 transition-all duration-200"
            >
              <span className="text-2xl font-bold text-gray-600 w-10 text-center">
                {movie.rank}
              </span>
              <img
                src={movie.poster}
                alt={movie.title}
                className="w-14 h-20 object-cover rounded-lg ring-1 ring-white/10"
              />
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-lg truncate group-hover:text-amber-400 transition-colors">
                  {movie.title}
                </h3>
                <p className="text-sm text-gray-500">
                  {movie.studio} · {movie.genre}
                </p>
              </div>
              <div className="text-right w-28">
                <p className="font-bold text-lg">
                  {formatMoney(movie.weekend)}
                </p>
                <p className="text-xs text-gray-500">weekend</p>
              </div>
              <div className="text-right w-28">
                <p className="font-semibold text-gray-300">
                  {formatMoney(movie.total)}
                </p>
                <p className="text-xs text-gray-500">total</p>
              </div>
              <div className="w-20 text-right">
                {movie.change !== null ? (
                  <span
                    className={`text-sm font-semibold ${movie.change >= 0 ? "text-green-400" : "text-red-400"}`}
                  >
                    {movie.change > 0 ? "+" : ""}
                    {movie.change}%
                  </span>
                ) : (
                  <span className="text-xs bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded-full font-medium">
                    NEW
                  </span>
                )}
              </div>
              <div className="w-16 text-right text-sm text-gray-500">
                Wk {movie.weeks}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-white/5 mt-12">
        <div className="max-w-7xl mx-auto px-6 py-8 text-center text-sm text-gray-600">
          BoxOfficePulse · Data for illustration purposes · {weekendDate}
        </div>
      </footer>
    </div>
  );
}
