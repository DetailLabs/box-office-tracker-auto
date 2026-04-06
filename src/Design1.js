import React from "react";
import { movies, weekendDate, formatMoney, formatMoneyFull } from "./data";

// Design 1: Glassmorphism — gradient mesh background, frosted glass cards, blur effects
export default function Design1() {
  const topMovie = movies[0];
  const rest = movies.slice(1);

  return (
    <div className="min-h-screen text-white font-sans relative overflow-hidden">
      {/* Animated gradient background */}
      <div className="fixed inset-0 -z-10" style={{
        background: 'linear-gradient(135deg, #0f0c29 0%, #302b63 40%, #24243e 100%)',
      }} />
      {/* Floating gradient orbs */}
      <div className="fixed top-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full opacity-30 -z-10"
        style={{ background: 'radial-gradient(circle, #ff6b6b, transparent 70%)' }} />
      <div className="fixed bottom-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full opacity-20 -z-10"
        style={{ background: 'radial-gradient(circle, #4ecdc4, transparent 70%)' }} />
      <div className="fixed top-[40%] left-[50%] w-[400px] h-[400px] rounded-full opacity-15 -z-10"
        style={{ background: 'radial-gradient(circle, #a855f7, transparent 70%)' }} />

      {/* Nav */}
      <nav className="sticky top-0 z-50 backdrop-blur-xl bg-white/[0.05] border-b border-white/[0.08]">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-rose-500 to-purple-600 flex items-center justify-center font-bold text-sm shadow-lg shadow-purple-500/30">
              BO
            </div>
            <span className="text-lg font-bold tracking-tight">Box Office</span>
          </div>
          <div className="flex items-center gap-1 backdrop-blur-md bg-white/[0.06] rounded-full p-1">
            <button className="bg-white/15 text-white text-sm font-medium px-4 py-1.5 rounded-full">Weekend</button>
            <button className="text-white/50 text-sm font-medium px-4 py-1.5 rounded-full hover:text-white/80">Weekly</button>
            <button className="text-white/50 text-sm font-medium px-4 py-1.5 rounded-full hover:text-white/80">All Time</button>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-10">
        {/* Date */}
        <p className="text-sm text-white/40 mb-8">Domestic estimates for {weekendDate}</p>

        {/* Hero Card — #1 Movie */}
        <div className="backdrop-blur-2xl bg-white/[0.07] border border-white/[0.1] rounded-3xl p-6 mb-8 shadow-2xl">
          <div className="flex gap-8 items-center">
            <div className="relative shrink-0">
              <img
                src={topMovie.poster}
                alt={topMovie.title}
                className="w-44 rounded-2xl shadow-2xl shadow-purple-500/20"
                style={{ aspectRatio: '2/3' }}
              />
              <div className="absolute -top-3 -left-3 w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center font-black text-sm text-black shadow-lg">
                #1
              </div>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-3">
                {topMovie.change === null && (
                  <span className="bg-gradient-to-r from-emerald-500 to-teal-400 text-black text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                    New Release
                  </span>
                )}
              </div>
              <h1 className="text-4xl font-bold tracking-tight mb-2">{topMovie.title}</h1>
              <p className="text-white/40 text-sm mb-4">
                {topMovie.studio} · {topMovie.rating} · {topMovie.genre}
              </p>
              <div className="flex items-center gap-3 mb-6">
                <div className="backdrop-blur-sm bg-white/[0.08] rounded-full px-3 py-1.5 flex items-center gap-1.5">
                  <span className="text-sm">🍅</span>
                  <span className="text-sm font-bold">{topMovie.rt.critics}%</span>
                </div>
                {topMovie.rt.audience && (
                  <div className="backdrop-blur-sm bg-white/[0.08] rounded-full px-3 py-1.5 flex items-center gap-1.5">
                    <span className="text-sm">🍿</span>
                    <span className="text-sm font-bold">{topMovie.rt.audience}%</span>
                  </div>
                )}
              </div>
              {/* Reviews */}
              {topMovie.reviews && (
                <div className="space-y-1 mb-6">
                  {topMovie.reviews.map((r, i) => (
                    <p key={i} className="text-sm text-white/50 italic">
                      "{r.quote}" <span className="text-white/30 not-italic">— {r.source}</span>
                    </p>
                  ))}
                </div>
              )}
              <div className="grid grid-cols-4 gap-4">
                {[
                  { label: "Weekend", value: formatMoneyFull(topMovie.weekend), accent: true },
                  { label: "Total", value: formatMoneyFull(topMovie.total) },
                  { label: "Theaters", value: topMovie.theaters.toLocaleString() },
                  { label: "Per Theater", value: formatMoney(Math.round(topMovie.weekend / topMovie.theaters)) },
                ].map((s) => (
                  <div key={s.label} className="backdrop-blur-sm bg-white/[0.05] rounded-xl p-3 border border-white/[0.06]">
                    <p className="text-[10px] text-white/30 uppercase tracking-wider mb-1">{s.label}</p>
                    <p className={`text-lg font-bold ${s.accent ? 'bg-gradient-to-r from-rose-400 to-purple-400 bg-clip-text text-transparent' : ''}`}>
                      {s.value}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Rankings */}
        <div className="space-y-2">
          {rest.map((movie) => (
            <div key={movie.rank}
              className="backdrop-blur-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] rounded-2xl p-4 flex items-center gap-4 transition-all duration-300 group cursor-pointer"
            >
              <span className="text-xl font-bold text-white/20 w-8 text-center">{movie.rank}</span>
              <img src={movie.poster} alt={movie.title} className="w-12 h-[4.5rem] object-cover rounded-lg ring-1 ring-white/10" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold truncate group-hover:text-purple-300 transition-colors">{movie.title}</h3>
                  {movie.weeks === 1 && (
                    <span className="text-[9px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full font-bold uppercase">New</span>
                  )}
                </div>
                <p className="text-xs text-white/30">{movie.studio} · {movie.genre}</p>
              </div>
              <div className="text-right w-24">
                <p className="font-bold">{formatMoney(movie.weekend)}</p>
                <p className="text-[10px] text-white/30">weekend</p>
              </div>
              <div className="text-right w-24">
                <p className="font-semibold text-white/60">{formatMoney(movie.total)}</p>
                <p className="text-[10px] text-white/30">total</p>
              </div>
              <div className="w-16 text-right">
                {movie.change !== null ? (
                  <span className={`text-sm font-semibold ${movie.change >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {movie.change > 0 ? '+' : ''}{movie.change}%
                  </span>
                ) : (
                  <span className="text-[10px] bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded-full font-medium">NEW</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <footer className="border-t border-white/5 mt-12">
        <div className="max-w-6xl mx-auto px-6 py-8 text-center text-sm text-white/20">
          Box Office · Data for illustration purposes · {weekendDate}
        </div>
      </footer>
    </div>
  );
}
