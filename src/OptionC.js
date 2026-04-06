import React from "react";
import { movies, weekendDate, formatMoney, formatMoneyFull } from "./data";

// Option C: Colorful Dashboard / Analytics Style
export default function OptionC() {
  const totalWeekend = movies.reduce((sum, m) => sum + m.weekend, 0);
  const newReleases = movies.filter((m) => m.weeks === 1).length;
  const avgTheaters = Math.round(
    movies.reduce((sum, m) => sum + m.theaters, 0) / movies.length
  );

  const barMax = movies[0].weekend;

  return (
    <div className="min-h-screen bg-[#0f172a] text-white font-sans">
      {/* Nav */}
      <nav className="border-b border-white/10 bg-[#0f172a]/90 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-br from-violet-500 to-cyan-400 rounded-xl flex items-center justify-center">
              <svg
                className="w-5 h-5 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <span className="text-lg font-bold">
              CineMetrics<span className="text-cyan-400">.io</span>
            </span>
          </div>
          <div className="flex items-center gap-1 bg-white/5 rounded-xl p-1">
            <button className="bg-white/10 text-white text-sm font-medium px-4 py-1.5 rounded-lg">
              Weekend
            </button>
            <button className="text-gray-400 text-sm font-medium px-4 py-1.5 rounded-lg hover:text-white">
              Weekly
            </button>
            <button className="text-gray-400 text-sm font-medium px-4 py-1.5 rounded-lg hover:text-white">
              Monthly
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Stats Row */}
        <div className="grid grid-cols-4 gap-4 mb-10">
          {[
            {
              label: "Total Weekend Gross",
              value: formatMoney(totalWeekend),
              color: "from-violet-500/20 to-violet-500/5",
              accent: "text-violet-400",
              border: "border-violet-500/20",
            },
            {
              label: "#1 Film",
              value: movies[0].title,
              sub: formatMoney(movies[0].weekend),
              color: "from-cyan-500/20 to-cyan-500/5",
              accent: "text-cyan-400",
              border: "border-cyan-500/20",
            },
            {
              label: "New Releases",
              value: newReleases,
              color: "from-amber-500/20 to-amber-500/5",
              accent: "text-amber-400",
              border: "border-amber-500/20",
            },
            {
              label: "Avg. Theaters",
              value: avgTheaters.toLocaleString(),
              color: "from-emerald-500/20 to-emerald-500/5",
              accent: "text-emerald-400",
              border: "border-emerald-500/20",
            },
          ].map((stat) => (
            <div
              key={stat.label}
              className={`bg-gradient-to-br ${stat.color} border ${stat.border} rounded-2xl p-5`}
            >
              <p className="text-xs text-gray-400 uppercase tracking-wider mb-2">
                {stat.label}
              </p>
              <p className={`text-2xl font-bold ${stat.accent}`}>
                {stat.value}
              </p>
              {stat.sub && (
                <p className="text-sm text-gray-400 mt-1">{stat.sub}</p>
              )}
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold">Weekend Rankings</h2>
            <p className="text-sm text-gray-400">{weekendDate}</p>
          </div>
        </div>

        {/* Chart-style cards */}
        <div className="space-y-3">
          {movies.map((movie) => {
            const barWidth = (movie.weekend / barMax) * 100;
            const colors = [
              "from-violet-500 to-purple-600",
              "from-cyan-500 to-blue-600",
              "from-rose-500 to-pink-600",
              "from-amber-500 to-orange-600",
              "from-emerald-500 to-teal-600",
              "from-indigo-500 to-blue-600",
              "from-red-500 to-rose-600",
              "from-sky-500 to-cyan-600",
              "from-fuchsia-500 to-purple-600",
              "from-lime-500 to-green-600",
            ];
            const color = colors[(movie.rank - 1) % colors.length];

            return (
              <div
                key={movie.rank}
                className="bg-white/[0.04] border border-white/[0.06] rounded-2xl p-4 hover:bg-white/[0.07] transition-all group"
              >
                <div className="flex items-center gap-4 mb-3">
                  <span className="text-lg font-bold text-gray-500 w-8 text-center">
                    {movie.rank}
                  </span>
                  <img
                    src={movie.poster}
                    alt={movie.title}
                    className="w-11 h-16 object-cover rounded-lg ring-1 ring-white/10"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold truncate group-hover:text-cyan-400 transition-colors">
                        {movie.title}
                      </h3>
                      {movie.weeks === 1 && (
                        <span className="text-[10px] bg-cyan-500/20 text-cyan-400 px-2 py-0.5 rounded-full font-semibold uppercase">
                          New
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500">
                      {movie.studio} · {movie.rating} · {movie.genre}
                    </p>
                  </div>
                  <div className="flex items-center gap-8 shrink-0">
                    <div className="text-right">
                      <p className="text-xs text-gray-500">Weekend</p>
                      <p className="font-bold">{formatMoney(movie.weekend)}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500">Total</p>
                      <p className="font-semibold text-gray-300">
                        {formatMoney(movie.total)}
                      </p>
                    </div>
                    <div className="w-16 text-right">
                      {movie.change !== null ? (
                        <span
                          className={`text-sm font-semibold ${movie.change >= 0 ? "text-emerald-400" : "text-red-400"}`}
                        >
                          {movie.change > 0 ? "+" : ""}
                          {movie.change}%
                        </span>
                      ) : (
                        <span className="text-xs text-gray-500">—</span>
                      )}
                    </div>
                  </div>
                </div>
                {/* Bar */}
                <div className="ml-12 pl-1">
                  <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                    <div
                      className={`h-full bg-gradient-to-r ${color} rounded-full transition-all duration-700`}
                      style={{ width: `${barWidth}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-white/5 mt-12">
        <div className="max-w-7xl mx-auto px-6 py-8 text-center text-sm text-gray-600">
          CineMetrics.io · Data for illustration purposes · {weekendDate}
        </div>
      </footer>
    </div>
  );
}
