import React from "react";
import Analytics from "./AnalyticsBase";

export function AnalyticsCurrentPage() {
  return (
    <div className="min-h-screen bg-[#faf9f6] text-gray-900 font-sans">
      <div className="max-w-6xl mx-auto px-6 py-10">
        <h1 className="text-2xl font-serif font-bold mb-6 flex items-center gap-2">
          <span className="w-8 h-px bg-gray-300" />
          Weekend Analytics
        </h1>
        <Analytics theme="current" />
      </div>
    </div>
  );
}

export function AnalyticsMidnightPage() {
  return (
    <div className="min-h-screen font-sans" style={{ background: '#0f0f0f', color: '#e5e5e5' }}>
      <div className="max-w-6xl mx-auto px-6 py-10">
        <h1 className="text-2xl font-extrabold mb-6 flex items-center gap-2 text-white">
          <span className="w-8 h-px" style={{ background: '#333' }} />
          Weekend Analytics
        </h1>
        <Analytics theme="midnight" />
      </div>
    </div>
  );
}

export function AnalyticsNoirPage() {
  return (
    <div className="min-h-screen font-sans" style={{ background: '#000', color: '#fff' }}>
      <div className="max-w-6xl mx-auto px-6 py-10">
        <h1 className="text-sm font-extrabold mb-6 flex items-center gap-2 uppercase tracking-widest text-gray-400">
          <span className="w-8 h-px" style={{ background: '#222' }} />
          Weekend Analytics
        </h1>
        <Analytics theme="noir" />
      </div>
    </div>
  );
}
