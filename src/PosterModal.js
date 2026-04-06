import React from "react";
import { formatMoney, formatMoneyFull } from "./data";

// Weekly trend data (shared) — domestic + worldwide in $M
// Arrays ordered chronologically (oldest week first)
export const trendData = {
  // ── April releases ──
  "The Super Mario Galaxy Movie": { domestic: [130.9], worldwide: [372.0] },
  "The Drama": { domestic: [14.4], worldwide: [18.0] },
  "A Great Awakening": { domestic: [2.1], worldwide: [2.5] },
  // ── March releases ──
  "Project Hail Mary": { domestic: [80.5, 54.5, 30.7], worldwide: [141.0, 120.0, 65.0] },
  "Hoppers": { domestic: [45.3, 28.7, 17.8, 12.2, 5.8], worldwide: [91.0, 52.0, 32.0, 22.0, 10.0] },
  "They Will Kill You": { domestic: [5.0, 1.9], worldwide: [9.0, 3.5] },
  "Dhurandhar: The Revenge": { domestic: [10.0, 4.7, 1.8], worldwide: [55.0, 12.0, 3.0] },
  "Ready or Not 2: Here I Come": { domestic: [9.1, 4.0, 1.8], worldwide: [15.5, 7.0, 3.0] },
  "Reminders of Him": { domestic: [18.0, 8.0, 4.7, 2.2], worldwide: [29.0, 12.6, 8.0, 4.0] },
  "Undertone": { domestic: [9.1, 3.0, 1.7, 1.1], worldwide: [10.5, 3.8, 1.8, 1.0] },
  "Forbidden Fruits": { domestic: [1.2], worldwide: [1.2] },
  "The Bride!": { domestic: [7.1, 2.1], worldwide: [12.0, 3.5] },
  "The Pout-Pout Fish": { domestic: [1.3], worldwide: [2.0] },
  "Kiki's Delivery Service": { domestic: [1.7], worldwide: [3.0] },
  "Teenage Mutant Ninja Turtles II": { domestic: [1.5], worldwide: [2.0] },
  // ── February releases ──
  "Scream 7": { domestic: [63.6, 17.0, 8.5, 4.3, 2.6], worldwide: [108.0, 28.0, 14.0, 7.5, 4.5] },
  "GOAT": { domestic: [27.2, 16.9, 12.0, 6.5, 4.7, 3.4, 2.2], worldwide: [49.0, 30.0, 24.0, 12.0, 8.0, 6.0, 3.5] },
  "Wuthering Heights": { domestic: [32.8, 14.0, 6.7, 3.7, 1.7, 0.5], worldwide: [82.0, 35.0, 16.0, 9.0, 4.0, 1.2] },
  "Crime 101": { domestic: [14.3, 5.5, 3.5, 2.0, 1.2], worldwide: [25.0, 10.0, 6.0, 3.5, 2.0] },
  "I Can Only Imagine 2": { domestic: [7.8, 3.2, 1.5], worldwide: [9.0, 3.6, 1.7] },
  "EPiC: Elvis Presley in Concert": { domestic: [3.2, 3.5, 1.5], worldwide: [6.0, 6.5, 3.0] },
  "How to Make a Killing": { domestic: [3.5, 1.5], worldwide: [5.5, 2.5] },
  "Solo Mio": { domestic: [7.0, 6.4, 2.4], worldwide: [8.5, 7.5, 3.0] },
  "Iron Lung": { domestic: [17.8, 6.0, 3.3], worldwide: [22.0, 7.5, 4.0] },
  "Dracula: A Love Tale": { domestic: [4.4, 2.9], worldwide: [9.0, 5.0] },
  "Stray Kids: The dominATE Experience": { domestic: [5.7], worldwide: [12.0] },
  "The Strangers: Chapter 3": { domestic: [3.5], worldwide: [6.0] },
  "Good Luck, Have Fun, Don't Die": { domestic: [3.6], worldwide: [6.0] },
  "Twenty One Pilots: More Than We Ever Imagined": { domestic: [4.3], worldwide: [8.0] },
  "Melania": { domestic: [7.2, 2.4], worldwide: [8.0, 2.8] },
  "Shelter": { domestic: [5.5, 2.5], worldwide: [9.0, 4.0] },
  // ── January releases / holdovers ──
  "Send Help": { domestic: [19.1, 9.0, 8.9, 4.4, 2.8, 1.5], worldwide: [36.0, 17.0, 16.0, 8.0, 5.0, 2.8] },
  "Mercy": { domestic: [10.8, 4.6], worldwide: [17.0, 7.0] },
  "28 Years Later: The Bone Temple": { domestic: [12.5, 3.4, 1.6], worldwide: [30.0, 8.0, 3.5] },
  "Return to Silent Hill": { domestic: [3.3], worldwide: [8.0] },
  "Primate": { domestic: [11.2, 5.0], worldwide: [17.0, 7.5] },
  "Greenland 2: Migration": { domestic: [8.4, 3.5], worldwide: [20.0, 8.0] },
  "Avatar: Fire and Ash": { domestic: [41.4, 21.5, 14.5, 6.4, 5.6, 3.5, 3.5, 1.8], worldwide: [170.0, 85.0, 55.0, 25.0, 20.0, 14.0, 14.0, 7.0] },
  "Zootopia 2": { domestic: [19.4, 10.0, 9.2, 5.3, 5.9, 4.0, 3.8, 2.2, 1.6], worldwide: [48.0, 24.0, 22.0, 12.0, 14.0, 9.0, 8.5, 5.0, 3.5] },
  "The Housemaid": { domestic: [15.1, 10.9, 8.5, 3.9, 3.5], worldwide: [22.0, 16.0, 13.0, 6.0, 5.0] },
  "Marty Supreme": { domestic: [12.6, 7.5, 5.6, 3.5, 2.8], worldwide: [19.0, 11.0, 8.0, 5.0, 4.0] },
  "Anaconda": { domestic: [10.0, 5.0, 3.3], worldwide: [15.0, 7.5, 5.0] },
  "The SpongeBob Movie: Search for SquarePants": { domestic: [8.3, 3.9, 2.4], worldwide: [20.0, 9.0, 5.5] },
  "David": { domestic: [7.7, 3.0], worldwide: [11.0, 4.5] },
  "Song Sung Blue": { domestic: [5.9, 3.1], worldwide: [8.5, 4.5] },
  "Wicked: For Good": { domestic: [3.3], worldwide: [6.0] },
  "Five Nights at Freddy's 2": { domestic: [2.7], worldwide: [4.5] },
  "Hamnet": { domestic: [1.9], worldwide: [3.0] },
  "The Lord of the Rings: The Fellowship of the Ring": { domestic: [3.6, 2.0], worldwide: [5.0, 3.0] },
  "The Lord of the Rings: The Return of the King": { domestic: [1.6], worldwide: [2.5] },
  "Demon Slayer: Infinity Castle": { domestic: [1.3], worldwide: [4.0] },
};

const modalThemes = {
  current: {
    overlay: "rgba(0,0,0,0.6)",
    cardBg: "#fff",
    cardBorder: "none",
    textColor: "",
    titleColor: "",
    subtitleColor: "text-gray-500",
    metaColor: "text-gray-400",
    closeBg: "bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-700",
    badgeBg: "bg-rose-600 text-white",
    newBg: "bg-rose-100 text-rose-600",
    accentColor: "text-rose-600",
    hoverColor: "hover:text-rose-600",
    borderColor: "border-gray-100",
    reviewColor: "text-gray-500",
    reviewHover: "hover:text-gray-700",
    statsHoverBg: "hover:bg-gray-50",
    labelColor: "text-gray-400",
    valueColor: "",
    trendBar: "bg-rose-500",
    trendNumColor: "text-rose-600",
    trendLabelColor: "text-gray-400",
    trendValColor: "text-gray-500",
  },
  midnight: {
    overlay: "rgba(0,0,0,0.75)",
    cardBg: "#1a1a1a",
    cardBorder: "1px solid #262626",
    textColor: "text-gray-100",
    titleColor: "text-white",
    subtitleColor: "text-gray-400",
    metaColor: "text-gray-500",
    closeBg: "text-gray-400 hover:text-white",
    closeBgStyle: { background: "#262626" },
    badgeBg: "",
    badgeStyle: { background: "#f59e0b", color: "#000" },
    newBg: "",
    newStyle: { background: "#2a2000", color: "#f59e0b" },
    accentColor: "",
    accentStyle: { color: "#f59e0b" },
    hoverColor: "hover:text-amber-400",
    borderColor: "",
    borderStyle: { borderColor: "#262626" },
    reviewColor: "text-gray-400",
    reviewHover: "hover:text-amber-400",
    statsHoverBg: "hover:opacity-80",
    labelColor: "text-gray-500",
    valueColor: "text-white",
    trendBar: "bg-amber-500",
    trendNumColor: "",
    trendNumStyle: { color: "#f59e0b" },
    trendLabelColor: "text-gray-500",
    trendValColor: "text-gray-400",
  },
  noir: {
    overlay: "rgba(0,0,0,0.8)",
    cardBg: "#0a0a0a",
    cardBorder: "1px solid #1a1a1a",
    textColor: "text-white",
    titleColor: "text-white",
    subtitleColor: "text-gray-500",
    metaColor: "text-gray-600",
    closeBg: "text-gray-500 hover:text-white",
    closeBgStyle: { background: "#1a1a1a" },
    badgeBg: "",
    badgeStyle: { background: "#dc2626", color: "#fff", textTransform: "uppercase", letterSpacing: "0.05em" },
    newBg: "",
    newStyle: { border: "1px solid #333", color: "#888", textTransform: "uppercase", letterSpacing: "0.05em" },
    accentColor: "",
    accentStyle: { color: "#dc2626" },
    hoverColor: "hover:text-red-400",
    borderColor: "",
    borderStyle: { borderColor: "#1a1a1a" },
    reviewColor: "text-gray-500",
    reviewHover: "hover:text-red-400",
    statsHoverBg: "hover:opacity-80",
    labelColor: "text-gray-600",
    valueColor: "text-white",
    trendBar: "bg-red-600",
    trendNumColor: "",
    trendNumStyle: { color: "#dc2626" },
    trendLabelColor: "text-gray-600",
    trendValColor: "text-gray-500",
  },
};

export function MiniBarChart({ data, color = "bg-rose-500", numColor, numStyle, valColor, labelColor }) {
  const max = Math.max(...data);
  const nc = numColor || "text-rose-600";
  const vc = valColor || "text-gray-500";
  const lc = labelColor || "text-gray-400";
  const containerH = "h-[68px]";
  if (data.length === 1) {
    return (
      <div className={`flex items-end gap-2 ${containerH}`}>
        <div className="flex flex-col items-center gap-0.5">
          <span className={`text-[10px] font-medium ${vc}`} style={numStyle || {}}>${data[0]}M</span>
          <div className={`w-8 h-8 ${color} rounded-sm opacity-90`} />
          <span className={`text-[10px] ${lc}`}>W1</span>
        </div>
      </div>
    );
  }
  const maxBarHeight = 48;
  return (
    <div className={`flex items-end gap-2 ${containerH}`}>
      {data.map((val, i) => {
        const barHeight = Math.max(Math.round((val / max) * maxBarHeight), 4);
        return (
          <div key={i} className="flex flex-col items-center gap-0.5">
            <span className={`text-[10px] font-medium ${vc}`}>${val}M</span>
            <div
              className={`w-8 ${color} rounded-sm opacity-80 hover:opacity-100 transition-opacity`}
              style={{ height: `${barHeight}px` }}
              title={`Week ${i + 1}: $${val}M`}
            />
            <span className={`text-[10px] ${lc}`}>W{i + 1}</span>
          </div>
        );
      })}
    </div>
  );
}

export default function PosterModal({ movie, onClose, theme = "current", trendData: trendDataProp }) {
  if (!movie) return null;
  const t = modalThemes[theme] || modalThemes.current;
  const hiResPoster = movie.poster.replace("/w500/", "/w780/");
  const td = trendDataProp || trendData;
  const trendEntry = td[movie.title];
  const allWeeks = trendEntry ? trendEntry.domestic : [+(movie.weekend / 1_000_000).toFixed(1)];
  const trend = allWeeks.slice(0, movie.weeks);

  const ExtLink = ({ href, children, className = "" }) => (
    <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
      {children}
    </a>
  );

  return (
    <div
      className="animate-fadeIn"
      style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: t.overlay, backdropFilter: 'blur(4px)', overflow: 'auto', padding: '24px 0' }}
      onClick={onClose}
    >
      <div
        className={`relative rounded-2xl shadow-2xl max-w-4xl w-full mx-3 sm:mx-4 animate-scaleIn my-auto ${t.textColor}`}
        style={{ padding: '16px', background: t.cardBg, border: t.cardBorder }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className={`absolute top-3 right-3 z-10 w-8 h-8 rounded-full flex items-center justify-center transition-colors ${t.closeBg}`}
          style={t.closeBgStyle || {}}
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="flex flex-col md:flex-row gap-4 md:gap-5 md:items-stretch">
          <div className="shrink-0 md:w-80">
            <img src={hiResPoster} alt={movie.title} className="w-full max-h-[50vh] md:max-h-none md:h-full object-cover rounded-xl" />
          </div>

          <div className="flex-1 flex flex-col justify-between md:pr-4 min-h-0">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${t.badgeBg}`} style={t.badgeStyle || {}}>
                  #{movie.rank}
                </span>
                {movie.change === null && (
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${t.newBg}`} style={t.newStyle || {}}>
                    NEW
                  </span>
                )}
              </div>
              <ExtLink href={movie.rottentomatoes} className={`${t.titleColor} ${t.hoverColor} transition-colors`}>
                <h2 className="text-2xl font-extrabold mb-1">{movie.title}</h2>
              </ExtLink>
              <p className={`text-sm ${t.subtitleColor}`}>{movie.studio}</p>
              <p className={`text-sm ${t.metaColor} mb-3`}>
                {movie.rating} · {movie.genre}{movie.runtime ? ` · ${Math.floor(movie.runtime / 60)}h ${movie.runtime % 60}m` : ''}
              </p>

              <div className={`flex items-center gap-4 mb-3 pb-3 border-b ${t.borderColor}`} style={t.borderStyle || {}}>
                <ExtLink href={movie.rottentomatoes} className="flex items-center gap-1 hover:opacity-70 transition-opacity">
                  <span className="text-lg">🍅</span>
                  <div>
                    <p className="text-sm font-bold">{movie.rt.critics}%</p>
                    <p className={`text-[10px] ${t.labelColor}`}>Critics</p>
                  </div>
                </ExtLink>
                {movie.rt.audience && (
                  <ExtLink href={movie.rottentomatoes} className="flex items-center gap-1 hover:opacity-70 transition-opacity">
                    <span className="text-lg">🍿</span>
                    <div>
                      <p className="text-sm font-bold">{movie.rt.audience}%</p>
                      <p className={`text-[10px] ${t.labelColor}`}>Audience</p>
                    </div>
                  </ExtLink>
                )}
              </div>

              {movie.reviews && movie.reviews.length > 0 && (
                <div className={`space-y-1.5 mb-3 pb-3 border-b ${t.borderColor}`} style={t.borderStyle || {}}>
                  {movie.reviews.map((r, i) => (
                    <ExtLink key={i} href={movie.rottentomatoes ? `${movie.rottentomatoes}/reviews` : '#'} className={`block text-xs ${t.reviewColor} italic leading-relaxed ${t.reviewHover} transition-colors`}>
                      "{r.quote}" <span className={`${t.labelColor} not-italic font-medium`}>— {r.source}</span>
                    </ExtLink>
                  ))}
                </div>
              )}

              <ExtLink href={movie.boxofficemojo} className={`block ${t.statsHoverBg} -mx-1 px-1 rounded-lg transition-colors`}>
                <div className="grid grid-cols-2 gap-x-4 gap-y-3 mb-3">
                  <div>
                    <p className={`text-[10px] ${t.labelColor} uppercase tracking-wider`}>Weekend Gross</p>
                    <p className={`text-base font-bold ${t.accentColor}`} style={t.accentStyle || {}}>{formatMoneyFull(movie.weekend)}</p>
                  </div>
                  <div>
                    <p className={`text-[10px] ${t.labelColor} uppercase tracking-wider`}>Domestic Total</p>
                    <p className={`text-base font-bold ${t.valueColor}`}>{formatMoneyFull(movie.total)}</p>
                  </div>
                  <div>
                    <p className={`text-[10px] ${t.labelColor} uppercase tracking-wider`}>Theaters (US)</p>
                    <p className={`text-sm font-semibold ${t.valueColor}`}>{movie.theaters.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className={`text-[10px] ${t.labelColor} uppercase tracking-wider`}>Per Theater Avg</p>
                    <p className={`text-sm font-semibold ${t.valueColor}`}>{formatMoney(Math.round(movie.weekend / movie.theaters))}</p>
                  </div>
                </div>
              </ExtLink>
            </div>

            <div className="mt-3">
              <p className={`text-[10px] ${t.labelColor} uppercase tracking-wider mb-3`}>Weekly Trend ($M)</p>
              <MiniBarChart
                data={trend}
                color={t.trendBar}
                numColor={t.trendNumColor}
                numStyle={t.trendNumStyle}
                valColor={t.trendValColor}
                labelColor={t.trendLabelColor}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
