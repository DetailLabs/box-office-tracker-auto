import React, { useState, useEffect } from "react";
import OptionB from "./OptionB";
import Midnight from "./Midnight";

function DarkToggle({ darkMode, onToggle }) {
  return (
    <button
      onClick={onToggle}
      className="w-8 h-8 rounded-full flex items-center justify-center cursor-pointer transition-all"
      style={{
        background: darkMode ? '#fff' : '#111',
        color: darkMode ? '#111' : '#fff',
        border: 'none',
      }}
      title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
    >
      {darkMode ? (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="5" />
          <line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" />
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
          <line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" />
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
        </svg>
      ) : (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
          <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
        </svg>
      )}
    </button>
  );
}

function LoadingScreen({ darkMode }) {
  const bg = darkMode ? '#0f0f0f' : '#faf5f0';
  const text = darkMode ? '#999' : '#666';
  const accent = darkMode ? '#f59e0b' : '#e11d48';

  return (
    <div style={{ background: bg, minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '16px' }}>
      <div style={{
        width: '40px', height: '40px', border: `3px solid ${text}33`,
        borderTopColor: accent, borderRadius: '50%',
        animation: 'spin 0.8s linear infinite',
      }} />
      <p style={{ color: text, fontSize: '14px', fontWeight: 500 }}>Loading box office data...</p>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

function App() {
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('darkMode') !== 'false');
  const [page, setPage] = useState("weekend");
  const [weekends, setWeekends] = useState(null);
  const [trendData, setTrendData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedWeekendId, setSelectedWeekendId] = useState(null);

  useEffect(() => {
    Promise.all([
      fetch('/api/weekends').then(r => {
        if (!r.ok) throw new Error(`Weekends API returned ${r.status}`);
        return r.json();
      }),
      fetch('/api/trends').then(r => {
        if (!r.ok) throw new Error(`Trends API returned ${r.status}`);
        return r.json();
      }),
    ])
      .then(([weekendsData, trendsData]) => {
        setWeekends(weekendsData);
        setTrendData(trendsData);
        setSelectedWeekendId(weekendsData[0]?.id || null);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load data:', err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <LoadingScreen darkMode={darkMode} />;

  if (error || !weekends || weekends.length === 0) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: darkMode ? '#0f0f0f' : '#faf5f0' }}>
        <div style={{ textAlign: 'center', color: darkMode ? '#999' : '#666' }}>
          <p style={{ fontSize: '18px', fontWeight: 600, marginBottom: '8px' }}>Unable to load data</p>
          <p style={{ fontSize: '14px' }}>{error || 'No weekend data available.'}</p>
          <button
            onClick={() => window.location.reload()}
            style={{ marginTop: '16px', padding: '8px 20px', borderRadius: '8px', border: 'none', background: darkMode ? '#f59e0b' : '#e11d48', color: '#fff', cursor: 'pointer', fontSize: '14px' }}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const selectedWeekend = weekends.find(w => w.id === selectedWeekendId) || weekends[0];

  const toggle = <DarkToggle darkMode={darkMode} onToggle={() => {
    const next = !darkMode;
    localStorage.setItem('darkMode', next);
    setDarkMode(next);
  }} />;

  const sharedProps = {
    darkToggle: toggle,
    page,
    setPage,
    weekends,
    selectedWeekend,
    onWeekendChange: setSelectedWeekendId,
    trendData,
  };

  return darkMode
    ? <Midnight {...sharedProps} />
    : <OptionB {...sharedProps} />;
}

export default App;
