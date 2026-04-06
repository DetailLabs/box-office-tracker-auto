import React from "react";
import { movies, weekendDate, formatMoney, formatMoneyFull } from "./data";

// Design 4: Neon Dark — dark theme, vibrant neon accents, cyberpunk inspired
export default function Design4() {
  const topMovie = movies[0];
  const rest = movies.slice(1);
  const barMax = topMovie.weekend;

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white font-sans">
      <style>{`
        @keyframes neonPulse { 0%, 100% { text-shadow: 0 0 10px #06b6d4, 0 0 20px #06b6d4, 0 0 40px #06b6d4; } 50% { text-shadow: 0 0 5px #06b6d4, 0 0 10px #06b6d4; } }
        .neon-glow { animation: neonPulse 3s ease-in-out infinite; }
        .neon-border { box-shadow: 0 0 15px rgba(6, 182, 212, 0.15), inset 0 0 15px rgba(6, 182, 212, 0.05); }
      `}</style>

      {/* Nav */}
      <nav className="border-b border-cyan-500/10 bg-[#0a0a0f]/90 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-2 h-8 bg-cyan-400 rounded-full shadow-[0_0_10px_rgba(6,182,212,0.6)]" />
            <span className="text-lg font-bold tracking-tight">
              CINE<span className="text-cyan-400">PULSE</span>
            </span>
          </div>
          <div className="flex items-center gap-6 text-sm">
            <span className="text-cyan-400 font-semibold">Weekend</span>
            <span className="text-gray-600 hover:text-gray-400 cursor-pointer">Weekly</span>
            <span className="text-gray-600 hover:text-gray-400 cursor-pointer">All Time</span>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-10">
        {/* Date bar */}
        <div className="flex items-center gap-3 mb-8">
          <div className="h-px flex-1 bg-gradient-to-r from-cyan-500/40 to-transparent" />
          <span className="text-xs text-cyan-500/60 uppercase tracking-[0.2em] font-medium">{weekendDate}</span>
          <div className="h-px flex-1 bg-gradient-to-l from-cyan-500/40 to-transparent" />
        </div>

        {/* Hero */}
        <div className="neon-border border border-cyan-500/20 rounded-2xl overflow-hidden mb-10 bg-[#0d0d14]">
          <div className="flex">
            <div className="relative w-56 shrink-0">
              <img src={topMovie.poster.replace("/w500/", "/w780/")} alt={topMovie.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#0d0d14]" />
            </div>
            <div className="flex-1 p-8">
              <div className="flex items-center gap-2 mb-3">
                <span className="bg-cyan-400 text-black text-[10px] font-black px-2.5 py-1 rounded uppercase tracking-wider">#1</span>
                {topMovie.change === null && (
                  <span className="border border-cyan-400/40 text-cyan-400 text-[10px] font-bold px-2.5 py-0.5 rounded">NEW</span>
                )}
              </div>
              <h2 className="text-3xl font-bold tracking-tight mb-1 neon-glow">{topMovie.title}</h2>
              <p className="text-sm text-gray-500 mb-4">{topMovie.studio} · {topMovie.rating} · {topMovie.genre}</p>
              <div className="flex items-center gap-3 mb-4">
                <span className="text-sm font-bold text-cyan-400">🍅 {topMovie.rt.critics}%</span>
                {topMovie.rt.audience && <span className="text-sm font-bold text-purple-400">🍿 {topMovie.rt.audience}%</span>}
              </div>
              {topMovie.reviews && (
                <div className="space-y-1.5 mb-6 pl-3 border-l border-cyan-500/20">
                  {topMovie.reviews.map((r, i) => (
                    <p key={i} className="text-xs text-gray-500 italic">
                      "{r.quote}" <span className="text-cyan-500/40 not-italic">— {r.source}</span>
                    </p>
                  ))}
                </div>
              )}
              <div className="grid grid-cols-4 gap-4">
                {[
                  { label: "Weekend", val: formatMoneyFull(topMovie.weekend), color: "text-cyan-400" },
                  { label: "Total", val: formatMoneyFull(topMovie.total), color: "text-purple-400" },
                  { label: "Theaters", val: topMovie.theaters.toLocaleString(), color: "text-white" },
                  { label: "Per Theater", val: formatMoney(Math.round(topMovie.weekend / topMovie.theaters)), color: "text-white" },
                ].map((s) => (
                  <div key={s.label} className="bg-white/[0.03] border border-white/[0.05] rounded-xl p-3">
                    <p className="text-[9px] text-gray-600 uppercase tracking-wider mb-1">{s.label}</p>
                    <p className={`text-lg font-bold ${s.color}`}>{s.val}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Rankings with neon bar chart */}
        <div className="space-y-2">
          {rest.map((movie) => {
            const barPct = (movie.weekend / barMax) * 100;
            return (
              <div key={movie.rank} className="group bg-white/[0.02] hover:bg-white/[0.04] border border-white/[0.04] hover:border-cyan-500/20 rounded-xl p-4 transition-all duration-300">
                <div className="flex items-center gap-4 mb-2">
                  <span className="text-lg font-bold text-gray-700 w-8 text-center">{movie.rank}</span>
                  <img src={movie.poster} alt={movie.title} className="w-10 h-14 object-cover rounded-lg" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-sm truncate group-hover:text-cyan-400 transition-colors">{movie.title}</h3>
                      {movie.weeks === 1 && (
                        <span className="text-[9px] text-cyan-400 border border-cyan-400/30 px-1.5 py-0.5 rounded font-bold">NEW</span>
                      )}
                    </div>
                    <p className="text-[11px] text-gray-600">{movie.studio}</p>
                  </div>
                  <div className="text-right w-20">
                    <p className="font-bold text-sm">{formatMoney(movie.weekend)}</p>
                  </div>
                  <div className="text-right w-20">
                    <p className="text-sm text-gray-500">{formatMoney(movie.total)}</p>
                  </div>
                  <div className="w-14 text-right">
                    {movie.change !== null ? (
                      <span className={`text-xs font-semibold ${movie.change >= 0 ? 'text-cyan-400' : 'text-rose-500'}`}>
                        {movie.change}%
                      </span>
                    ) : (
                      <span className="text-[10px] text-gray-600">—</span>
                    )}
                  </div>
                </div>
                {/* Neon bar */}
                <div className="ml-12 pl-1">
                  <div className="h-1 bg-white/[0.03] rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${barPct}%`,
                        background: 'linear-gradient(90deg, #06b6d4, #a855f7)',
                        boxShadow: '0 0 8px rgba(6,182,212,0.4)',
                      }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <footer className="border-t border-cyan-500/10 mt-12">
        <div className="max-w-6xl mx-auto px-6 py-8 text-center text-xs text-gray-700">
          CINEPULSE · Data for illustration purposes · {weekendDate}
        </div>
      </footer>
    </div>
  );
}
