import React, { useState } from "react";
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  LineChart, Line, Legend, ScatterChart, Scatter, ZAxis,
  AreaChart, Area,
} from "recharts";
import { formatMoney, formatMoneyFull } from "./data";

// Theme presets
const themes = {
  current: {
    colors: ["#e11d48", "#f43f5e", "#fb7185", "#fda4af", "#d97706", "#f59e0b", "#fbbf24", "#ec4899", "#a855f7", "#6366f1"],
    accent: "#e11d48",
    accentName: "text-rose-600",
    cardBg: "bg-white",
    cardBorder: "border-gray-100",
    titleColor: "text-gray-800",
    gridStroke: "#fff1f2",
    tickFill: "#94a3b8",
    labelFill: "#64748b",
    tipBg: "bg-white",
    tipBorder: "border-gray-100",
    tipText: "",
    legendActiveBg: "border-rose-200 text-gray-600 bg-rose-50",
    legendInactiveBg: "border-gray-200 text-gray-300",
    openingFill: "#e11d48",
    priorFill: "#fbbf24",
    scatterFill: "#e11d48",
    barFill: "#f43f5e",
    newFill: "#e11d48",
    holdoverFill: "#fbbf24",
    cursorFill: "rgba(225,29,72,0.08)",
  },
  midnight: {
    colors: ["#f59e0b", "#fbbf24", "#d97706", "#92400e", "#ef4444", "#f97316", "#eab308", "#a855f7", "#ec4899", "#6366f1"],
    accent: "#f59e0b",
    accentName: "text-amber-500",
    cardBg: "",
    cardBorder: "",
    cardStyle: { background: "#1a1a1a", border: "1px solid #262626" },
    titleColor: "text-gray-200",
    gridStroke: "#262626",
    tickFill: "#666",
    labelFill: "#888",
    tipBg: "",
    tipBorder: "",
    tipStyle: { background: "#222", border: "1px solid #333", color: "#e5e5e5" },
    tipText: "text-gray-300",
    legendActiveBg: "text-gray-300",
    legendActiveStyle: { borderColor: "#f59e0b33", background: "#1a1a0a" },
    legendInactiveBg: "text-gray-600",
    legendInactiveStyle: { borderColor: "#333" },
    openingFill: "#f59e0b",
    priorFill: "#92400e",
    scatterFill: "#f59e0b",
    barFill: "#f59e0b",
    newFill: "#f59e0b",
    holdoverFill: "#92400e",
    cursorFill: "rgba(245,158,11,0.12)",
  },
  noir: {
    colors: ["#dc2626", "#ef4444", "#f87171", "#991b1b", "#f97316", "#fb923c", "#fbbf24", "#a855f7", "#ec4899", "#6366f1"],
    accent: "#dc2626",
    accentName: "text-red-600",
    cardBg: "",
    cardBorder: "",
    cardStyle: { background: "#0a0a0a", border: "1px solid #1a1a1a" },
    titleColor: "text-gray-200",
    gridStroke: "#1a1a1a",
    tickFill: "#555",
    labelFill: "#777",
    tipBg: "",
    tipBorder: "",
    tipStyle: { background: "#111", border: "1px solid #222", color: "#fff" },
    tipText: "text-gray-300",
    legendActiveBg: "text-gray-300",
    legendActiveStyle: { borderColor: "#dc262633", background: "#1a0a0a" },
    legendInactiveBg: "text-gray-600",
    legendInactiveStyle: { borderColor: "#222" },
    openingFill: "#dc2626",
    priorFill: "#991b1b",
    scatterFill: "#dc2626",
    barFill: "#dc2626",
    newFill: "#dc2626",
    holdoverFill: "#991b1b",
    cursorFill: "rgba(220,38,38,0.12)",
  },
};

function Tip({ children, theme }) {
  const t = themes[theme];
  return (
    <div
      className={`rounded-xl shadow-lg px-3 py-2 text-xs ${t.tipBg} ${t.tipBorder} ${t.tipText}`}
      style={t.tipStyle || {}}
    >
      {children}
    </div>
  );
}

function ChartCard({ title, children, theme, span2 }) {
  const t = themes[theme];
  return (
    <div
      className={`rounded-2xl shadow-sm p-5 ${t.cardBg} ${t.cardBorder ? `border ${t.cardBorder}` : ""} ${span2 ? "md:col-span-2" : ""}`}
      style={t.cardStyle || {}}
    >
      <h3 className={`text-sm font-bold mb-3 ${t.titleColor}`}>{title}</h3>
      {children}
    </div>
  );
}

// ── Helper: short weekend label ──────────────────────────────────────
function shortWk(label) {
  const m = label.match(/(\w+) (\d+)/);
  return m ? `${m[1]} ${m[2]}` : label;
}

// ═══════════════════════════════════════════════════════════════════════
// 1. Box Office Trend — total top-10 gross per weekend (line chart)
// ═══════════════════════════════════════════════════════════════════════
function BoxOfficeTrend({ theme, weekends }) {
  const t = themes[theme];
  const data = [...weekends].reverse().map((w) => ({
    name: shortWk(w.label),
    total: w.movies.reduce((s, m) => s + m.weekend, 0),
  }));
  return (
    <ChartCard title="Total Box Office by Weekend" theme={theme}>
      <ResponsiveContainer width="100%" height={260}>
        <LineChart data={data} margin={{ left: 10, right: 20, top: 5, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={t.gridStroke} />
          <XAxis dataKey="name" tick={{ fontSize: 10, fill: t.tickFill }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 10, fill: t.tickFill }} tickFormatter={formatMoney} axisLine={false} tickLine={false} />
          <Tooltip cursor={{ fill: t.cursorFill }} content={({ active, payload }) => {
            if (!active || !payload?.length) return null;
            return <Tip theme={theme}><p className="font-semibold">{payload[0].payload.name}</p><p style={{ color: t.accent }}>{formatMoneyFull(payload[0].value)}</p></Tip>;
          }} />
          <Line type="monotone" dataKey="total" stroke={t.accent} strokeWidth={3} dot={{ r: 5, fill: t.accent }} activeDot={{ r: 7 }} />
        </LineChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// 2. Weekend Comparison — grouped bar for top 5 movies per weekend
// ═══════════════════════════════════════════════════════════════════════
function WeekendComparison({ theme, weekends }) {
  const t = themes[theme];
  // Collect all unique titles across weekends, pick top 5 by max weekend gross
  const titleMax = {};
  weekends.forEach(w => w.movies.forEach(m => {
    titleMax[m.title] = Math.max(titleMax[m.title] || 0, m.weekend);
  }));
  const top5 = Object.entries(titleMax).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([t]) => t);

  const data = [...weekends].reverse().map(w => {
    const pt = { name: shortWk(w.label) };
    top5.forEach(title => {
      const movie = w.movies.find(m => m.title === title);
      pt[title] = movie ? movie.weekend : 0;
    });
    return pt;
  });

  return (
    <ChartCard title="Top Movies Across Weekends" theme={theme}>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={data} margin={{ left: 10, right: 20, top: 5, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={t.gridStroke} vertical={false} />
          <XAxis dataKey="name" tick={{ fontSize: 10, fill: t.tickFill }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 10, fill: t.tickFill }} tickFormatter={formatMoney} axisLine={false} tickLine={false} />
          <Tooltip cursor={{ fill: t.cursorFill }} content={({ active, payload, label }) => {
            if (!active || !payload?.length) return null;
            return <Tip theme={theme}><p className="font-semibold mb-1">{label}</p>{payload.filter(p => p.value > 0).map((p, i) => <p key={i} style={{ color: p.color }}>{p.name}: {formatMoney(p.value)}</p>)}</Tip>;
          }} />
          {top5.map((title, i) => (
            <Bar key={title} dataKey={title} fill={t.colors[i]} radius={[3, 3, 0, 0]} />
          ))}
        </BarChart>
      </ResponsiveContainer>
      <div className="flex flex-wrap gap-2 mt-1 justify-center">
        {top5.map((title, i) => (
          <span key={i} className={`flex items-center gap-1 text-[10px] ${theme === "current" ? "text-gray-500" : "text-gray-400"}`}>
            <span className="w-2 h-2 rounded-full" style={{ background: t.colors[i] }} />
            {title.length > 18 ? title.slice(0, 18) + "…" : title}
          </span>
        ))}
      </div>
    </ChartCard>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// 3. Movie Performance Tracker — multi-line across weekends (with toggle)
// ═══════════════════════════════════════════════════════════════════════
function MoviePerformanceTracker({ theme, weekends }) {
  const t = themes[theme];
  // Find movies appearing in 2+ weekends
  const titleCount = {};
  weekends.forEach(w => w.movies.forEach(m => {
    titleCount[m.title] = (titleCount[m.title] || 0) + 1;
  }));
  const multiWeek = Object.entries(titleCount).filter(([, c]) => c >= 2).map(([t]) => t);
  // Sort by max weekend gross
  multiWeek.sort((a, b) => {
    const maxA = Math.max(...weekends.map(w => { const m = w.movies.find(x => x.title === a); return m ? m.weekend : 0; }));
    const maxB = Math.max(...weekends.map(w => { const m = w.movies.find(x => x.title === b); return m ? m.weekend : 0; }));
    return maxB - maxA;
  });

  const data = [...weekends].reverse().map(w => {
    const pt = { name: shortWk(w.label) };
    multiWeek.forEach(title => {
      const movie = w.movies.find(m => m.title === title);
      pt[title] = movie ? +(movie.weekend / 1_000_000).toFixed(1) : null;
    });
    return pt;
  });

  const [hidden, setHidden] = useState({});
  const colorMap = {};
  multiWeek.forEach((title, i) => { colorMap[title] = t.colors[i % t.colors.length]; });

  return (
    <ChartCard title="Movie Performance Tracker" theme={theme}>
      <ResponsiveContainer width="100%" height={280}>
        <LineChart data={data} margin={{ left: 10, right: 20, top: 5, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={t.gridStroke} />
          <XAxis dataKey="name" tick={{ fontSize: 10, fill: t.tickFill }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 10, fill: t.tickFill }} tickFormatter={(v) => `$${v}M`} axisLine={false} tickLine={false} />
          <Tooltip cursor={{ fill: t.cursorFill }} content={({ active, payload, label }) => {
            if (!active || !payload?.length) return null;
            return <Tip theme={theme}><p className="font-semibold mb-1">{label}</p>{payload.filter(p => p.value != null).map((p, i) => <p key={i} style={{ color: p.color }}>{p.name}: ${p.value}M</p>)}</Tip>;
          }} />
          {multiWeek.map(title => (
            <Line key={title} type="monotone" dataKey={title} stroke={colorMap[title]} strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 5 }} connectNulls={false} hide={hidden[title]} />
          ))}
        </LineChart>
      </ResponsiveContainer>
      <div className="flex flex-wrap gap-1.5 mt-2 justify-center">
        {multiWeek.map(title => (
          <button key={title} onClick={() => setHidden(p => ({ ...p, [title]: !p[title] }))}
            className={`flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full border transition-all cursor-pointer ${hidden[title] ? t.legendInactiveBg : t.legendActiveBg}`}
            style={hidden[title] ? (t.legendInactiveStyle || {}) : (t.legendActiveStyle || {})}>
            <span className="w-2 h-2 rounded-full" style={{ background: hidden[title] ? "#555" : colorMap[title] }} />
            {title.length > 16 ? title.slice(0, 16) + "…" : title}
          </button>
        ))}
      </div>
    </ChartCard>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// 4. Market Share Evolution — stacked area across weekends
// ═══════════════════════════════════════════════════════════════════════
function MarketShareEvolution({ theme, weekends }) {
  const t = themes[theme];
  // Get top 6 movies by total weekend gross across all weekends
  const titleTotals = {};
  weekends.forEach(w => w.movies.forEach(m => {
    titleTotals[m.title] = (titleTotals[m.title] || 0) + m.weekend;
  }));
  const top6 = Object.entries(titleTotals).sort((a, b) => b[1] - a[1]).slice(0, 6).map(([t]) => t);

  const data = [...weekends].reverse().map(w => {
    const total = w.movies.reduce((s, m) => s + m.weekend, 0);
    const pt = { name: shortWk(w.label) };
    top6.forEach(title => {
      const movie = w.movies.find(m => m.title === title);
      pt[title] = movie ? +((movie.weekend / total) * 100).toFixed(1) : 0;
    });
    // "Others" share
    const top6Share = top6.reduce((s, title) => s + (pt[title] || 0), 0);
    pt["Others"] = +(100 - top6Share).toFixed(1);
    return pt;
  });

  const allKeys = [...top6, "Others"];

  return (
    <ChartCard title="Market Share Evolution (%)" theme={theme}>
      <ResponsiveContainer width="100%" height={280}>
        <AreaChart data={data} margin={{ left: 10, right: 20, top: 5, bottom: 5 }} stackOffset="none">
          <CartesianGrid strokeDasharray="3 3" stroke={t.gridStroke} />
          <XAxis dataKey="name" tick={{ fontSize: 10, fill: t.tickFill }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 10, fill: t.tickFill }} tickFormatter={(v) => `${v}%`} axisLine={false} tickLine={false} />
          <Tooltip cursor={{ fill: t.cursorFill }} content={({ active, payload, label }) => {
            if (!active || !payload?.length) return null;
            return <Tip theme={theme}><p className="font-semibold mb-1">{label}</p>{payload.filter(p => p.value > 0).map((p, i) => <p key={i} style={{ color: p.color }}>{p.name}: {p.value}%</p>)}</Tip>;
          }} />
          {allKeys.map((key, i) => (
            <Area key={key} type="monotone" dataKey={key} stackId="1" fill={i < top6.length ? t.colors[i] : "#666"} stroke={i < top6.length ? t.colors[i] : "#666"} fillOpacity={0.7} />
          ))}
        </AreaChart>
      </ResponsiveContainer>
      <div className="flex flex-wrap gap-2 mt-1 justify-center">
        {allKeys.map((key, i) => (
          <span key={i} className={`flex items-center gap-1 text-[10px] ${theme === "current" ? "text-gray-500" : "text-gray-400"}`}>
            <span className="w-2 h-2 rounded-full" style={{ background: i < top6.length ? t.colors[i] : "#666" }} />
            {key.length > 18 ? key.slice(0, 18) + "…" : key}
          </span>
        ))}
      </div>
    </ChartCard>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// 5. New vs Returning — stacked bar per weekend
// ═══════════════════════════════════════════════════════════════════════
function NewVsReturning({ theme, weekends }) {
  const t = themes[theme];
  const data = [...weekends].reverse().map(w => {
    const newGross = w.movies.filter(m => m.weeks === 1).reduce((s, m) => s + m.weekend, 0);
    const holdoverGross = w.movies.filter(m => m.weeks > 1).reduce((s, m) => s + m.weekend, 0);
    return { name: shortWk(w.label), "New Releases": newGross, "Holdovers": holdoverGross };
  });
  return (
    <ChartCard title="New Releases vs Holdovers" theme={theme}>
      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={data} margin={{ left: 10, right: 20, top: 5, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={t.gridStroke} vertical={false} />
          <XAxis dataKey="name" tick={{ fontSize: 10, fill: t.tickFill }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 10, fill: t.tickFill }} tickFormatter={formatMoney} axisLine={false} tickLine={false} />
          <Tooltip cursor={{ fill: t.cursorFill }} content={({ active, payload, label }) => {
            if (!active || !payload?.length) return null;
            return <Tip theme={theme}><p className="font-semibold mb-1">{label}</p>{payload.map((p, i) => <p key={i} style={{ color: p.color }}>{p.name}: {formatMoneyFull(p.value)}</p>)}</Tip>;
          }} />
          <Bar dataKey="New Releases" stackId="a" fill={t.newFill} />
          <Bar dataKey="Holdovers" stackId="a" fill={t.holdoverFill} radius={[4, 4, 0, 0]} />
          <Legend wrapperStyle={{ fontSize: 10, paddingTop: 8, color: t.labelFill }} iconType="circle" iconSize={8} />
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// 6. Weekend Gross (selected weekend) — horizontal bar
// ═══════════════════════════════════════════════════════════════════════
function WeekendGross({ theme, movies }) {
  const t = themes[theme];
  const data = [...movies].reverse().map((m) => ({
    name: m.title.length > 18 ? m.title.slice(0, 18) + "…" : m.title, fullName: m.title, weekend: m.weekend, genre: m.genre,
  }));
  return (
    <ChartCard title="Weekend Gross Comparison" theme={theme}>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={data} layout="vertical" margin={{ left: 10, right: 20, top: 5, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={t.gridStroke} horizontal={false} />
          <XAxis type="number" tickFormatter={formatMoney} tick={{ fontSize: 10, fill: t.tickFill }} axisLine={false} tickLine={false} />
          <YAxis type="category" dataKey="name" width={120} tick={{ fontSize: 10, fill: t.labelFill }} axisLine={false} tickLine={false} />
          <Tooltip cursor={{ fill: t.cursorFill }} content={({ active, payload }) => {
            if (!active || !payload?.length) return null;
            const d = payload[0].payload;
            return <Tip theme={theme}><p className="font-semibold">{d.fullName}</p><p style={{ color: t.accent }}>{formatMoneyFull(d.weekend)}</p><p style={{ color: t.tickFill }}>{d.genre}</p></Tip>;
          }} />
          <Bar dataKey="weekend" radius={[0, 6, 6, 0]}>
            {data.map((_, i) => <Cell key={i} fill={t.colors[(data.length - 1 - i) % t.colors.length]} />)}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// 7. Market Share (selected weekend) — donut
// ═══════════════════════════════════════════════════════════════════════
function MarketShare({ theme, movies }) {
  const t = themes[theme];
  const total = movies.reduce((s, m) => s + m.weekend, 0);
  const data = movies.map((m) => ({ name: m.title, value: m.weekend, pct: ((m.weekend / total) * 100).toFixed(1) }));
  return (
    <ChartCard title="Market Share" theme={theme}>
      <ResponsiveContainer width="100%" height={260}>
        <PieChart>
          <Pie data={data} cx="50%" cy="50%" innerRadius={55} outerRadius={105} dataKey="value" stroke="none" paddingAngle={2}>
            {data.map((_, i) => <Cell key={i} fill={t.colors[i]} />)}
          </Pie>
          <Tooltip cursor={{ fill: t.cursorFill }} content={({ active, payload }) => {
            if (!active || !payload?.length) return null;
            const d = payload[0].payload;
            return <Tip theme={theme}><p className="font-semibold">{d.name}</p><p style={{ color: t.accent }}>{formatMoneyFull(d.value)} ({d.pct}%)</p></Tip>;
          }} />
        </PieChart>
      </ResponsiveContainer>
      <div className="flex flex-wrap gap-2 mt-1 justify-center">
        {data.slice(0, 5).map((d, i) => (
          <span key={i} className={`flex items-center gap-1 text-[10px] ${theme === "current" ? "text-gray-500" : "text-gray-400"}`}>
            <span className="w-2 h-2 rounded-full" style={{ background: t.colors[i] }} />{d.name} ({d.pct}%)
          </span>
        ))}
      </div>
    </ChartCard>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// 8. Per-Theater Average Trend — line across weekends
// ═══════════════════════════════════════════════════════════════════════
function PerTheaterAvgTrend({ theme, weekends }) {
  const t = themes[theme];
  const data = [...weekends].reverse().map(w => {
    const avgs = w.movies.map(m => m.weekend / m.theaters);
    const avg = avgs.reduce((s, v) => s + v, 0) / avgs.length;
    return { name: shortWk(w.label), avg: Math.round(avg) };
  });
  return (
    <ChartCard title="Avg Per-Theater (Top 10 Mean)" theme={theme}>
      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={data} margin={{ left: 10, right: 20, top: 5, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={t.gridStroke} vertical={false} />
          <XAxis dataKey="name" tick={{ fontSize: 10, fill: t.tickFill }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 10, fill: t.tickFill }} tickFormatter={formatMoney} axisLine={false} tickLine={false} />
          <Tooltip cursor={{ fill: t.cursorFill }} content={({ active, payload }) => {
            if (!active || !payload?.length) return null;
            return <Tip theme={theme}><p className="font-semibold">{payload[0].payload.name}</p><p style={{ color: t.accent }}>{formatMoney(payload[0].value)} avg per theater</p></Tip>;
          }} />
          <Bar dataKey="avg" fill={t.accent} radius={[4, 4, 0, 0]}>
            {data.map((_, i) => <Cell key={i} fill={t.colors[i % t.colors.length]} />)}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// 9. Genre Breakdown — aggregated across all weekends
// ═══════════════════════════════════════════════════════════════════════
function GenreBreakdown({ theme, movies }) {
  const t = themes[theme];
  const genres = {};
  movies.forEach(m => {
    genres[m.genre] = (genres[m.genre] || 0) + m.weekend;
  });
  const data = Object.entries(genres).sort((a, b) => b[1] - a[1]).map(([genre, value]) => ({ genre, value }));
  return (
    <ChartCard title="Weekend Gross by Genre" theme={theme}>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={data} margin={{ left: 10, right: 20, top: 5, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={t.gridStroke} vertical={false} />
          <XAxis dataKey="genre" tick={{ fontSize: 9, fill: t.tickFill }} axisLine={false} tickLine={false} interval={0} angle={-20} textAnchor="end" height={55} />
          <YAxis tick={{ fontSize: 10, fill: t.tickFill }} tickFormatter={formatMoney} axisLine={false} tickLine={false} />
          <Tooltip cursor={{ fill: t.cursorFill }} content={({ active, payload }) => {
            if (!active || !payload?.length) return null;
            return <Tip theme={theme}><p className="font-semibold">{payload[0].payload.genre}</p><p style={{ color: t.accent }}>{formatMoneyFull(payload[0].value)}</p></Tip>;
          }} />
          <Bar dataKey="value" radius={[4, 4, 0, 0]}>
            {data.map((_, i) => <Cell key={i} fill={t.colors[i % t.colors.length]} />)}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// 10. Score vs Gross — scatter from all weekends
// ═══════════════════════════════════════════════════════════════════════
function ScoreVsGross({ theme, movies }) {
  const t = themes[theme];
  const data = movies.filter(m => m.rt.critics != null).map(m => ({
    name: m.title, critics: m.rt.critics, weekend: +(m.weekend / 1_000_000).toFixed(1), weekendRaw: m.weekend,
  }));
  return (
    <ChartCard title="Critics Score vs Weekend Gross" theme={theme}>
      <ResponsiveContainer width="100%" height={280}>
        <ScatterChart margin={{ left: 10, right: 20, top: 10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={t.gridStroke} />
          <XAxis type="number" dataKey="critics" name="Critics" domain={[0, 100]} tick={{ fontSize: 10, fill: t.tickFill }} axisLine={false} tickLine={false} label={{ value: "RT Critics %", position: "bottom", fontSize: 10, fill: t.tickFill }} />
          <YAxis type="number" dataKey="weekend" name="Weekend" tick={{ fontSize: 10, fill: t.tickFill }} tickFormatter={(v) => `$${v}M`} axisLine={false} tickLine={false} />
          <ZAxis range={[60, 60]} />
          <Tooltip cursor={{ fill: t.cursorFill }} content={({ active, payload }) => {
            if (!active || !payload?.length) return null;
            const d = payload[0].payload;
            return <Tip theme={theme}><p className="font-semibold">{d.name}</p><p>🍅 {d.critics}%</p><p style={{ color: t.accent }}>{formatMoneyFull(d.weekendRaw)}</p></Tip>;
          }} />
          <Scatter data={data} fill={t.scatterFill}>
            {data.map((_, i) => <Cell key={i} fill={t.colors[i % t.colors.length]} />)}
          </Scatter>
        </ScatterChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// 11. Top Movers — biggest rank changes vs prior weekend
// ═══════════════════════════════════════════════════════════════════════
function TopMovers({ theme, weekends, selectedWeekend }) {
  const t = themes[theme];
  const idx = weekends.findIndex(w => w.id === selectedWeekend.id);
  const prevWeekend = idx < weekends.length - 1 ? weekends[idx + 1] : null;

  if (!prevWeekend) {
    return (
      <ChartCard title="Rank Changes vs Prior Weekend" theme={theme}>
        <p className={`text-sm ${theme === "current" ? "text-gray-400" : "text-gray-500"}`}>No prior weekend data available for this selection.</p>
      </ChartCard>
    );
  }

  const prevRanks = {};
  prevWeekend.movies.forEach(m => { prevRanks[m.title] = m.rank; });

  const movers = selectedWeekend.movies.map(m => {
    const prevRank = prevRanks[m.title];
    if (prevRank == null) return { name: m.title, change: null, label: "NEW", isNew: true };
    return { name: m.title, change: prevRank - m.rank, label: prevRank - m.rank > 0 ? `+${prevRank - m.rank}` : `${prevRank - m.rank}`, isNew: false };
  }).sort((a, b) => {
    if (a.isNew && !b.isNew) return 1;
    if (!a.isNew && b.isNew) return -1;
    return (b.change || 0) - (a.change || 0);
  });

  const data = movers.map(m => ({
    name: m.name.length > 18 ? m.name.slice(0, 18) + "…" : m.name,
    fullName: m.name,
    change: m.isNew ? 0 : m.change,
    label: m.label,
    isNew: m.isNew,
  }));

  return (
    <ChartCard title="Rank Changes vs Prior Weekend" theme={theme}>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={data} layout="vertical" margin={{ left: 10, right: 30, top: 5, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={t.gridStroke} horizontal={false} />
          <XAxis type="number" tick={{ fontSize: 10, fill: t.tickFill }} axisLine={false} tickLine={false} />
          <YAxis type="category" dataKey="name" width={120} tick={{ fontSize: 10, fill: t.labelFill }} axisLine={false} tickLine={false} />
          <Tooltip cursor={{ fill: t.cursorFill }} content={({ active, payload }) => {
            if (!active || !payload?.length) return null;
            const d = payload[0].payload;
            return <Tip theme={theme}><p className="font-semibold">{d.fullName}</p><p style={{ color: d.isNew ? t.accent : d.change > 0 ? '#22c55e' : d.change < 0 ? '#ef4444' : t.tickFill }}>{d.isNew ? "New Entry" : `${d.label} positions`}</p></Tip>;
          }} />
          <Bar dataKey="change" radius={[0, 4, 4, 0]}>
            {data.map((d, i) => (
              <Cell key={i} fill={d.isNew ? t.accent : d.change > 0 ? '#22c55e' : d.change < 0 ? '#ef4444' : t.tickFill} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      <p style={{ fontSize: 10, color: t.tickFill, marginTop: 4, textAlign: 'center' }}>
        <span style={{ color: '#22c55e' }}>Green: climbed</span> · <span style={{ color: '#ef4444' }}>Red: dropped</span> · <span style={{ color: t.accent }}>Accent: new entry</span>
      </p>
    </ChartCard>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// Main Analytics Layout
// ═══════════════════════════════════════════════════════════════════════
export default function Analytics({ theme = "current", weekends = [], selectedWeekend }) {
  const movies = selectedWeekend ? selectedWeekend.movies : [];
  // Compute a 4-weekend window: selected weekend + 3 prior (weekends is newest-first)
  const selIdx = weekends.findIndex(w => w.id === selectedWeekend?.id);
  const endIdx = Math.min(weekends.length, selIdx + 4);
  const window4 = weekends.slice(selIdx, endIdx);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      <MarketShare theme={theme} movies={movies} />
      <WeekendGross theme={theme} movies={movies} />
      <BoxOfficeTrend theme={theme} weekends={window4} />
      <MoviePerformanceTracker theme={theme} weekends={window4} />
      <WeekendComparison theme={theme} weekends={window4} />
      <NewVsReturning theme={theme} weekends={window4} />
      <MarketShareEvolution theme={theme} weekends={window4} />
      <TopMovers theme={theme} weekends={weekends} selectedWeekend={selectedWeekend} />
      <GenreBreakdown theme={theme} movies={movies} />
      <ScoreVsGross theme={theme} movies={movies} />
    </div>
  );
}
