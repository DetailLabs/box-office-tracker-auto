import React from "react";

const accents = [
  { name: "1. Crimson", color: "#b91c1c", desc: "Deeper, darker red — cinematic, less saturated" },
  { name: "2. Electric White", color: "#e5e5e5", desc: "Pure monochrome — white highlights on black" },
  { name: "3. Gold", color: "#c9a227", desc: "Classic Hollywood premiere feel" },
  { name: "4. Cool Silver", color: "#94a3b8", desc: "Muted steel gray — ultra-minimal noir" },
  { name: "5. Current Red", color: "#dc2626", desc: "Current accent (for comparison)" },
];

function AccentPreview({ accent }) {
  return (
    <div style={{ background: '#0a0a0a', border: '1px solid #1a1a1a', borderRadius: 16, padding: 20, marginBottom: 20 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
        <div style={{ width: 6, height: 24, background: accent.color, borderRadius: 3 }} />
        <span style={{ color: '#fff', fontSize: 14, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>The Box Office</span>
        <span style={{ marginLeft: 'auto', fontSize: 11, color: '#555', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Weekend</span>
      </div>
      <div style={{ display: 'flex', gap: 16 }}>
        <img
          src="https://image.tmdb.org/t/p/w500/yihdXomYb5kTeSivtFndMy5iDmf.jpg"
          alt=""
          style={{ width: 100, borderRadius: 10, aspectRatio: '2/3', objectFit: 'cover' }}
        />
        <div style={{ flex: 1 }}>
          <span style={{ background: accent.color, color: accent.color === '#e5e5e5' ? '#000' : '#fff', fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 4, textTransform: 'uppercase', letterSpacing: '0.05em' }}>#1</span>
          <h3 style={{ color: '#fff', fontSize: 20, fontWeight: 800, margin: '6px 0 4px' }}>Project Hail Mary</h3>
          <p style={{ color: '#777', fontSize: 12 }}>Amazon MGM Studios</p>
          <p style={{ color: '#555', fontSize: 11 }}>PG-13 · Sci-Fi / Drama · 2h 17m</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 12, marginTop: 12, paddingTop: 12, borderTop: '1px solid #1a1a1a' }}>
            <div>
              <div style={{ fontSize: 8, color: '#555', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Weekend</div>
              <div style={{ fontSize: 16, fontWeight: 700, color: accent.color }}>$80.5M</div>
            </div>
            <div>
              <div style={{ fontSize: 8, color: '#555', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Total</div>
              <div style={{ fontSize: 16, fontWeight: 700, color: '#fff' }}>$80.5M</div>
            </div>
            <div>
              <div style={{ fontSize: 8, color: '#555', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Theaters</div>
              <div style={{ fontSize: 14, fontWeight: 600, color: '#ccc' }}>4,007</div>
            </div>
            <div>
              <div style={{ fontSize: 8, color: '#555', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Per Theater</div>
              <div style={{ fontSize: 14, fontWeight: 600, color: '#ccc' }}>$20K</div>
            </div>
          </div>
          <div style={{ marginTop: 10 }}>
            <div style={{ fontSize: 8, color: '#555', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 4 }}>Weekly Trend</div>
            <div style={{ display: 'flex', alignItems: 'end', gap: 6 }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                <span style={{ fontSize: 9, color: accent.color, fontWeight: 600 }}>$80.5M</span>
                <div style={{ width: 28, height: 28, background: accent.color, borderRadius: 3, opacity: 0.85 }} />
                <span style={{ fontSize: 9, color: '#555' }}>Opening</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Table row preview */}
      <div style={{ marginTop: 16, borderTop: '1px solid #1a1a1a', paddingTop: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '6px 0' }}>
          <span style={{ color: '#333', fontWeight: 700, width: 20 }}>1</span>
          <span style={{ color: '#fff', fontWeight: 600, fontSize: 13, flex: 1 }}>Project Hail Mary</span>
          <span style={{ color: '#ccc', fontWeight: 600, fontSize: 13 }}>$80.5M</span>
          <span style={{ background: accent.color, color: accent.color === '#e5e5e5' ? '#000' : '#fff', fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 4 }}>NEW</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '6px 0' }}>
          <span style={{ color: '#333', fontWeight: 700, width: 20 }}>2</span>
          <span style={{ color: '#fff', fontWeight: 600, fontSize: 13, flex: 1 }}>Hoppers</span>
          <span style={{ color: '#ccc', fontWeight: 600, fontSize: 13 }}>$17.8M</span>
          <span style={{ color: accent.color === '#e5e5e5' ? '#999' : '#ef4444', fontSize: 12, fontWeight: 500 }}>-38%</span>
        </div>
      </div>
    </div>
  );
}

export default function NoirAccentShowcase() {
  return (
    <div style={{ background: '#000', minHeight: '100vh', padding: 32, fontFamily: "'Inter', system-ui, sans-serif" }}>
      <h1 style={{ color: '#fff', fontSize: 24, fontWeight: 700, marginBottom: 4 }}>Noir Accent Options</h1>
      <p style={{ color: '#555', fontSize: 13, marginBottom: 24 }}>Pick a number to apply it.</p>
      <div style={{ maxWidth: 700 }}>
        {accents.map((a, i) => (
          <div key={i}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
              <div style={{ width: 16, height: 16, borderRadius: 8, background: a.color, border: '1px solid #333' }} />
              <span style={{ color: '#fff', fontSize: 14, fontWeight: 700 }}>{a.name}</span>
              <span style={{ color: '#666', fontSize: 12 }}>{a.desc}</span>
            </div>
            <AccentPreview accent={a} />
          </div>
        ))}
      </div>
    </div>
  );
}
