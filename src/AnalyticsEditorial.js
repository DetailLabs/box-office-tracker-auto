import React, { useState } from "react";
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  LineChart, Line, Legend, ScatterChart, Scatter, ZAxis,
} from "recharts";
import { movies, formatMoney, formatMoneyFull } from "./data";
import { trendData } from "./PosterModal";

// Monochrome palette with single accent for Editorial design
const COLORS = [
  "#111827", "#374151", "#4b5563", "#6b7280", "#9ca3af",
  "#1f2937", "#334155", "#475569", "#64748b", "#94a3b8",
];
const ACCENT = "#111827";

function Tip({ children }) {
  return (
    <div className="bg-white rounded-sm shadow-lg border border-gray-200 px-3 py-2 text-xs">
      {children}
    </div>
  );
}

function ChartCard({ title, children }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
      <h3 className="text-sm font-black uppercase tracking-tight text-gray-800 mb-3">{title}</h3>
      {children}
    </div>
  );
}

// 1. Market Share
function MarketShare() {
  const total = movies.reduce((s, m) => s + m.weekend, 0);
  const data = movies.map((m) => ({ name: m.title, value: m.weekend, pct: ((m.weekend / total) * 100).toFixed(1) }));
  return (
    <ChartCard title="Market Share">
      <ResponsiveContainer width="100%" height={260}>
        <PieChart>
          <Pie data={data} cx="50%" cy="50%" innerRadius={55} outerRadius={105} dataKey="value" stroke="#fff" strokeWidth={2} paddingAngle={1}>
            {data.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
          </Pie>
          <Tooltip content={({ active, payload }) => {
            if (!active || !payload?.length) return null;
            const d = payload[0].payload;
            return <Tip><p className="font-black">{d.name}</p><p className="text-gray-500">{formatMoneyFull(d.value)} ({d.pct}%)</p></Tip>;
          }} />
        </PieChart>
      </ResponsiveContainer>
      <div className="flex flex-wrap gap-2 mt-1 justify-center">
        {data.slice(0, 5).map((d, i) => (
          <span key={i} className="flex items-center gap-1 text-[10px] text-gray-500">
            <span className="w-2 h-2 rounded-full" style={{ background: COLORS[i] }} />{d.name} ({d.pct}%)
          </span>
        ))}
      </div>
    </ChartCard>
  );
}

// 2. Weekend Gross
function WeekendGross() {
  const data = [...movies].reverse().map((m) => ({
    name: m.title.length > 18 ? m.title.slice(0, 18) + "…" : m.title, fullName: m.title, weekend: m.weekend, genre: m.genre,
  }));
  return (
    <ChartCard title="Weekend Gross Comparison">
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={data} layout="vertical" margin={{ left: 10, right: 20, top: 5, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" horizontal={false} />
          <XAxis type="number" tickFormatter={formatMoney} tick={{ fontSize: 10, fill: "#6b7280" }} axisLine={false} tickLine={false} />
          <YAxis type="category" dataKey="name" width={120} tick={{ fontSize: 10, fill: "#374151" }} axisLine={false} tickLine={false} />
          <Tooltip content={({ active, payload }) => {
            if (!active || !payload?.length) return null;
            const d = payload[0].payload;
            return <Tip><p className="font-black">{d.fullName}</p><p>{formatMoneyFull(d.weekend)}</p><p className="text-gray-400">{d.genre}</p></Tip>;
          }} />
          <Bar dataKey="weekend" radius={[0, 2, 2, 0]}>
            {data.map((_, i) => <Cell key={i} fill={COLORS[(data.length - 1 - i) % COLORS.length]} />)}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

// 3. Weekly Trends
function WeeklyTrends() {
  const entries = Object.entries(trendData).filter(([, d]) => d.domestic.length >= 2).sort((a, b) => b[1].domestic[0] - a[1].domestic[0]);
  const maxW = Math.max(...entries.map(([, d]) => d.domestic.length));
  const chartData = Array.from({ length: maxW }, (_, i) => {
    const pt = { week: `Wk ${i + 1}` };
    entries.forEach(([t, d]) => { pt[t] = d.domestic[i] || null; });
    return pt;
  });
  const [hidden, setHidden] = useState({});
  const colorMap = {};
  entries.forEach(([t]) => { const idx = movies.findIndex((m) => m.title === t); colorMap[t] = COLORS[idx >= 0 ? idx : 0]; });

  return (
    <ChartCard title="Weekly Box Office Trends">
      <ResponsiveContainer width="100%" height={260}>
        <LineChart data={chartData} margin={{ left: 10, right: 20, top: 5, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="week" tick={{ fontSize: 10, fill: "#6b7280" }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 10, fill: "#6b7280" }} tickFormatter={(v) => `$${v}M`} axisLine={false} tickLine={false} />
          <Tooltip content={({ active, payload, label }) => {
            if (!active || !payload?.length) return null;
            return <Tip><p className="font-black mb-1">{label}</p>{payload.filter(p => p.value != null).map((p, i) => <p key={i} style={{ color: p.color }}>{p.name}: ${p.value}M</p>)}</Tip>;
          }} />
          {entries.map(([t]) => <Line key={t} type="monotone" dataKey={t} stroke={colorMap[t]} strokeWidth={2} dot={{ r: 3, strokeWidth: 0 }} activeDot={{ r: 5 }} connectNulls={false} hide={hidden[t]} />)}
        </LineChart>
      </ResponsiveContainer>
      <div className="flex flex-wrap gap-1.5 mt-2 justify-center">
        {entries.map(([t]) => (
          <button key={t} onClick={() => setHidden(p => ({ ...p, [t]: !p[t] }))}
            className={`flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full border transition-all ${hidden[t] ? "border-gray-200 text-gray-300" : "border-gray-300 text-gray-600 bg-gray-50"}`}>
            <span className="w-2 h-2" style={{ background: hidden[t] ? "#d1d5db" : colorMap[t] }} />
            {t.length > 14 ? t.slice(0, 14) + "…" : t}
          </button>
        ))}
      </div>
    </ChartCard>
  );
}

// 4. Opening vs Total
function OpeningVsTotal() {
  const data = movies.map((m) => ({
    name: m.title.length > 12 ? m.title.slice(0, 12) + "…" : m.title, fullName: m.title,
    opening: m.weekend, prior: m.total - m.weekend,
  }));
  return (
    <ChartCard title="Opening Weekend vs Total Gross">
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={data} margin={{ left: 10, right: 20, top: 5, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
          <XAxis dataKey="name" tick={{ fontSize: 9, fill: "#6b7280" }} axisLine={false} tickLine={false} interval={0} angle={-30} textAnchor="end" height={50} />
          <YAxis tick={{ fontSize: 10, fill: "#6b7280" }} tickFormatter={formatMoney} axisLine={false} tickLine={false} />
          <Tooltip content={({ active, payload }) => {
            if (!active || !payload?.length) return null;
            const d = payload[0].payload;
            return <Tip><p className="font-black mb-1">{d.fullName}</p><p>Opening: {formatMoneyFull(d.opening)}</p><p className="text-gray-500">Prior: {formatMoneyFull(d.prior)}</p><p className="font-black mt-1">Total: {formatMoneyFull(d.opening + d.prior)}</p></Tip>;
          }} />
          <Bar dataKey="opening" stackId="a" fill="#111827" name="Opening Weekend" />
          <Bar dataKey="prior" stackId="a" fill="#9ca3af" name="Prior Weeks" radius={[2, 2, 0, 0]} />
          <Legend wrapperStyle={{ fontSize: 10, paddingTop: 8 }} iconType="square" iconSize={8} />
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

// 5. Per-Theater Average
function PerTheaterAvg() {
  const data = [...movies].sort((a, b) => (b.weekend / b.theaters) - (a.weekend / a.theaters)).map((m) => ({
    name: m.title.length > 18 ? m.title.slice(0, 18) + "…" : m.title, fullName: m.title,
    avg: Math.round(m.weekend / m.theaters), theaters: m.theaters,
  }));
  return (
    <ChartCard title="Per-Theater Average">
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={data} layout="vertical" margin={{ left: 10, right: 20, top: 5, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" horizontal={false} />
          <XAxis type="number" tickFormatter={formatMoney} tick={{ fontSize: 10, fill: "#6b7280" }} axisLine={false} tickLine={false} />
          <YAxis type="category" dataKey="name" width={120} tick={{ fontSize: 10, fill: "#374151" }} axisLine={false} tickLine={false} />
          <Tooltip content={({ active, payload }) => {
            if (!active || !payload?.length) return null;
            const d = payload[0].payload;
            return <Tip><p className="font-black">{d.fullName}</p><p>{formatMoney(d.avg)} per theater</p><p className="text-gray-400">{d.theaters.toLocaleString()} theaters</p></Tip>;
          }} />
          <Bar dataKey="avg" fill="#374151" radius={[0, 2, 2, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

// 6. Genre Breakdown
function GenreBreakdown() {
  const genres = {};
  movies.forEach((m) => { genres[m.genre] = (genres[m.genre] || 0) + m.weekend; });
  const data = Object.entries(genres).sort((a, b) => b[1] - a[1]).map(([genre, value]) => ({ genre, value }));
  return (
    <ChartCard title="Weekend Gross by Genre">
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={data} margin={{ left: 10, right: 20, top: 5, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
          <XAxis dataKey="genre" tick={{ fontSize: 9, fill: "#6b7280" }} axisLine={false} tickLine={false} interval={0} angle={-20} textAnchor="end" height={55} />
          <YAxis tick={{ fontSize: 10, fill: "#6b7280" }} tickFormatter={formatMoney} axisLine={false} tickLine={false} />
          <Tooltip content={({ active, payload }) => {
            if (!active || !payload?.length) return null;
            return <Tip><p className="font-black">{payload[0].payload.genre}</p><p>{formatMoneyFull(payload[0].value)}</p></Tip>;
          }} />
          <Bar dataKey="value" radius={[2, 2, 0, 0]}>
            {data.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

// 7. RT Score vs Box Office Scatter
function ScoreVsGross() {
  const data = movies.map((m) => ({
    name: m.title, critics: m.rt.critics, weekend: m.weekend / 1_000_000, weekendRaw: m.weekend,
  }));
  return (
    <ChartCard title="Critics Score vs Weekend Gross">
      <ResponsiveContainer width="100%" height={280}>
        <ScatterChart margin={{ left: 10, right: 20, top: 10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis type="number" dataKey="critics" name="Critics" domain={[0, 100]} tick={{ fontSize: 10, fill: "#6b7280" }} axisLine={false} tickLine={false} label={{ value: "RT Critics %", position: "bottom", fontSize: 10, fill: "#6b7280" }} />
          <YAxis type="number" dataKey="weekend" name="Weekend" tick={{ fontSize: 10, fill: "#6b7280" }} tickFormatter={(v) => `$${v}M`} axisLine={false} tickLine={false} />
          <ZAxis range={[60, 60]} />
          <Tooltip content={({ active, payload }) => {
            if (!active || !payload?.length) return null;
            const d = payload[0].payload;
            return <Tip><p className="font-black">{d.name}</p><p>🍅 {d.critics}%</p><p>{formatMoneyFull(d.weekendRaw)}</p></Tip>;
          }} />
          <Scatter data={data} fill={ACCENT}>
            {data.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
          </Scatter>
        </ScatterChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

// 8. Studio Performance
function StudioPerformance() {
  const studios = {};
  movies.forEach((m) => { studios[m.studio] = (studios[m.studio] || 0) + m.weekend; });
  const data = Object.entries(studios).sort((a, b) => b[1] - a[1]).map(([studio, value]) => ({
    studio: studio.length > 16 ? studio.slice(0, 16) + "…" : studio, fullStudio: studio, value,
  }));
  return (
    <ChartCard title="Studio Weekend Performance">
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={data} layout="vertical" margin={{ left: 10, right: 20, top: 5, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" horizontal={false} />
          <XAxis type="number" tickFormatter={formatMoney} tick={{ fontSize: 10, fill: "#6b7280" }} axisLine={false} tickLine={false} />
          <YAxis type="category" dataKey="studio" width={110} tick={{ fontSize: 10, fill: "#374151" }} axisLine={false} tickLine={false} />
          <Tooltip content={({ active, payload }) => {
            if (!active || !payload?.length) return null;
            const d = payload[0].payload;
            return <Tip><p className="font-black">{d.fullStudio}</p><p>{formatMoneyFull(d.value)}</p></Tip>;
          }} />
          <Bar dataKey="value" fill={ACCENT} radius={[0, 2, 2, 0]}>
            {data.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

export default function AnalyticsEditorial() {
  return (
    <div className="grid grid-cols-2 gap-5">
      <MarketShare />
      <WeekendGross />
      <WeeklyTrends />
      <OpeningVsTotal />
      <PerTheaterAvg />
      <GenreBreakdown />
      <ScoreVsGross />
      <StudioPerformance />
    </div>
  );
}
