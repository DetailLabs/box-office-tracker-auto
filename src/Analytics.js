import React, { useState } from "react";
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  LineChart, Line, Legend,
} from "recharts";
import { movies, formatMoney, formatMoneyFull } from "./data";
import { trendData } from "./PosterModal";

const COLORS = [
  "#e11d48", "#7c3aed", "#2563eb", "#059669", "#d97706",
  "#ec4899", "#6366f1", "#0891b2", "#ea580c", "#84cc16",
];

function CustomTooltip({ active, payload, label, prefix = "" }) {
  if (!active || !payload || !payload.length) return null;
  return (
    <div className="bg-white rounded-lg shadow-lg border border-gray-100 px-3 py-2 text-xs">
      {label && <p className="font-semibold text-gray-700 mb-1">{label}</p>}
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color || p.fill }}>
          {p.name}: {prefix}{typeof p.value === 'number' ? p.value.toLocaleString() : p.value}
        </p>
      ))}
    </div>
  );
}

// Chart A: Market Share Donut
function MarketShareChart() {
  const totalWeekend = movies.reduce((s, m) => s + m.weekend, 0);
  const data = movies.map((m) => ({
    name: m.title,
    value: m.weekend,
    pct: ((m.weekend / totalWeekend) * 100).toFixed(1),
  }));

  return (
    <div>
      <h3 className="text-sm font-bold mb-3">Market Share</h3>
      <ResponsiveContainer width="100%" height={280}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={110}
            dataKey="value"
            stroke="none"
            paddingAngle={2}
          >
            {data.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            content={({ active, payload }) => {
              if (!active || !payload?.length) return null;
              const d = payload[0].payload;
              return (
                <div className="bg-white rounded-lg shadow-lg border border-gray-100 px-3 py-2 text-xs">
                  <p className="font-semibold text-gray-700">{d.name}</p>
                  <p className="text-gray-500">{formatMoneyFull(d.value)} ({d.pct}%)</p>
                </div>
              );
            }}
          />
        </PieChart>
      </ResponsiveContainer>
      <div className="flex flex-wrap gap-2 mt-2 justify-center">
        {data.slice(0, 5).map((d, i) => (
          <span key={i} className="flex items-center gap-1 text-[10px] text-gray-500">
            <span className="w-2 h-2 rounded-full" style={{ background: COLORS[i] }} />
            {d.name} ({d.pct}%)
          </span>
        ))}
      </div>
    </div>
  );
}

// Chart B: Weekend Gross Horizontal Bar
function WeekendGrossChart() {
  const data = [...movies].reverse().map((m) => ({
    name: m.title.length > 18 ? m.title.slice(0, 18) + "…" : m.title,
    fullName: m.title,
    weekend: m.weekend,
    genre: m.genre,
  }));

  return (
    <div>
      <h3 className="text-sm font-bold mb-3">Weekend Gross Comparison</h3>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={data} layout="vertical" margin={{ left: 10, right: 20, top: 5, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
          <XAxis
            type="number"
            tickFormatter={(v) => formatMoney(v)}
            tick={{ fontSize: 10, fill: "#94a3b8" }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            type="category"
            dataKey="name"
            width={120}
            tick={{ fontSize: 10, fill: "#64748b" }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            content={({ active, payload }) => {
              if (!active || !payload?.length) return null;
              const d = payload[0].payload;
              return (
                <div className="bg-white rounded-lg shadow-lg border border-gray-100 px-3 py-2 text-xs">
                  <p className="font-semibold text-gray-700">{d.fullName}</p>
                  <p className="text-gray-500">{formatMoneyFull(d.weekend)}</p>
                  <p className="text-gray-400">{d.genre}</p>
                </div>
              );
            }}
          />
          <Bar dataKey="weekend" radius={[0, 4, 4, 0]}>
            {data.map((_, i) => (
              <Cell key={i} fill={COLORS[(data.length - 1 - i) % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

// Chart C: Weekly Trend Lines
function WeeklyTrendChart() {
  const moviesWithTrends = Object.entries(trendData)
    .filter(([, data]) => data.length >= 2)
    .sort((a, b) => b[1][0] - a[1][0]);

  const maxWeeks = Math.max(...moviesWithTrends.map(([, d]) => d.length));
  const chartData = Array.from({ length: maxWeeks }, (_, i) => {
    const point = { week: `Week ${i + 1}` };
    moviesWithTrends.forEach(([title, data]) => {
      point[title] = data[i] || null;
    });
    return point;
  });

  const [hiddenLines, setHiddenLines] = useState({});
  const toggleLine = (title) => {
    setHiddenLines((prev) => ({ ...prev, [title]: !prev[title] }));
  };

  const movieColorMap = {};
  moviesWithTrends.forEach(([title], i) => {
    const movieIdx = movies.findIndex((m) => m.title === title);
    movieColorMap[title] = COLORS[movieIdx >= 0 ? movieIdx : i];
  });

  return (
    <div>
      <h3 className="text-sm font-bold mb-3">Weekly Box Office Trends</h3>
      <ResponsiveContainer width="100%" height={280}>
        <LineChart data={chartData} margin={{ left: 10, right: 20, top: 5, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
          <XAxis dataKey="week" tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
          <YAxis
            tick={{ fontSize: 10, fill: "#94a3b8" }}
            tickFormatter={(v) => `$${v}M`}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            content={({ active, payload, label }) => {
              if (!active || !payload?.length) return null;
              return (
                <div className="bg-white rounded-lg shadow-lg border border-gray-100 px-3 py-2 text-xs">
                  <p className="font-semibold text-gray-700 mb-1">{label}</p>
                  {payload.filter(p => p.value != null).map((p, i) => (
                    <p key={i} style={{ color: p.color }}>
                      {p.name}: ${p.value}M
                    </p>
                  ))}
                </div>
              );
            }}
          />
          {moviesWithTrends.map(([title]) => (
            <Line
              key={title}
              type="monotone"
              dataKey={title}
              stroke={movieColorMap[title]}
              strokeWidth={2}
              dot={{ r: 3 }}
              activeDot={{ r: 5 }}
              connectNulls={false}
              hide={hiddenLines[title]}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
      <div className="flex flex-wrap gap-2 mt-2 justify-center">
        {moviesWithTrends.map(([title]) => (
          <button
            key={title}
            onClick={() => toggleLine(title)}
            className={`flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full border transition-all ${
              hiddenLines[title]
                ? "border-gray-200 text-gray-300 bg-white"
                : "border-gray-300 text-gray-600 bg-gray-50"
            }`}
          >
            <span
              className="w-2 h-2 rounded-full"
              style={{ background: hiddenLines[title] ? "#d1d5db" : movieColorMap[title] }}
            />
            {title.length > 15 ? title.slice(0, 15) + "…" : title}
          </button>
        ))}
      </div>
    </div>
  );
}

// Chart D: Opening Weekend vs Total Gross
function CumulativeGrossChart() {
  const data = movies.map((m) => ({
    name: m.title.length > 12 ? m.title.slice(0, 12) + "…" : m.title,
    fullName: m.title,
    opening: m.weekend,
    prior: m.total - m.weekend,
  }));

  return (
    <div>
      <h3 className="text-sm font-bold mb-3">Opening Weekend vs Total Gross</h3>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={data} margin={{ left: 10, right: 20, top: 5, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
          <XAxis
            dataKey="name"
            tick={{ fontSize: 9, fill: "#94a3b8" }}
            axisLine={false}
            tickLine={false}
            interval={0}
            angle={-30}
            textAnchor="end"
            height={50}
          />
          <YAxis
            tick={{ fontSize: 10, fill: "#94a3b8" }}
            tickFormatter={(v) => formatMoney(v)}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            content={({ active, payload }) => {
              if (!active || !payload?.length) return null;
              const d = payload[0].payload;
              return (
                <div className="bg-white rounded-lg shadow-lg border border-gray-100 px-3 py-2 text-xs">
                  <p className="font-semibold text-gray-700 mb-1">{d.fullName}</p>
                  <p className="text-rose-600">Opening: {formatMoneyFull(d.opening)}</p>
                  <p className="text-blue-600">Prior Weeks: {formatMoneyFull(d.prior)}</p>
                  <p className="font-semibold text-gray-700 mt-1">Total: {formatMoneyFull(d.opening + d.prior)}</p>
                </div>
              );
            }}
          />
          <Bar dataKey="opening" stackId="a" fill="#e11d48" name="Opening Weekend" radius={[0, 0, 0, 0]} />
          <Bar dataKey="prior" stackId="a" fill="#3b82f6" name="Prior Weeks" radius={[4, 4, 0, 0]} />
          <Legend
            wrapperStyle={{ fontSize: 10, paddingTop: 8 }}
            iconType="circle"
            iconSize={8}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default function Analytics() {
  return (
    <div className="grid grid-cols-2 gap-6">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <MarketShareChart />
      </div>
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <WeekendGrossChart />
      </div>
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <WeeklyTrendChart />
      </div>
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <CumulativeGrossChart />
      </div>
    </div>
  );
}
