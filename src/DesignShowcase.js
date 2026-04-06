import React from "react";

const movie = {
  title: "Project Hail Mary",
  studio: "Amazon MGM Studios",
  rating: "PG-13",
  genre: "Sci-Fi / Drama",
  runtime: "2h 17m",
  weekend: "$80.5M",
  total: "$80.5M",
  rt: 95,
  audience: 97,
  poster: "https://image.tmdb.org/t/p/w500/yihdXomYb5kTeSivtFndMy5iDmf.jpg",
};

function DesignCard({ name, description, palette, children }) {
  return (
    <div className="mb-16">
      <div className="flex items-center gap-4 mb-4">
        <h2 className="text-2xl font-bold">{name}</h2>
        <div className="flex gap-1.5">
          {palette.map((c, i) => (
            <div key={i} className="w-5 h-5 rounded-full border border-gray-200" style={{ background: c }} />
          ))}
        </div>
      </div>
      <p className="text-sm text-gray-500 mb-6">{description}</p>
      <div className="rounded-2xl overflow-hidden border border-gray-200 shadow-lg">
        {children}
      </div>
    </div>
  );
}

// Design 1: Midnight — dark mode, amber accents
function Design1() {
  return (
    <div style={{ background: '#0f0f0f', color: '#e5e5e5', fontFamily: 'system-ui, sans-serif' }}>
      {/* Nav */}
      <div style={{ borderBottom: '1px solid #222', padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ color: '#f59e0b', fontSize: 20 }}>★</span>
          <div style={{ lineHeight: 1 }}>
            <div style={{ fontSize: 9, fontWeight: 600, color: '#f59e0b', textTransform: 'uppercase', letterSpacing: '0.15em' }}>The</div>
            <div style={{ fontSize: 16, fontWeight: 700 }}>Box Office</div>
          </div>
        </div>
        <span style={{ fontSize: 12, color: '#888', borderBottom: '2px solid #f59e0b', paddingBottom: 4 }}>This Weekend</span>
      </div>
      {/* Hero */}
      <div style={{ padding: 24 }}>
        <div style={{ background: '#1a1a1a', borderRadius: 16, border: '1px solid #262626', padding: 24, display: 'flex', gap: 24 }}>
          <img src={movie.poster} alt="" style={{ width: 140, borderRadius: 12, aspectRatio: '2/3', objectFit: 'cover' }} />
          <div style={{ flex: 1 }}>
            <span style={{ background: '#f59e0b', color: '#000', fontSize: 10, fontWeight: 700, padding: '3px 10px', borderRadius: 20 }}>#1 This Weekend</span>
            <h3 style={{ fontSize: 28, fontWeight: 700, margin: '8px 0 4px' }}>{movie.title}</h3>
            <p style={{ fontSize: 13, color: '#888' }}>{movie.studio}</p>
            <p style={{ fontSize: 12, color: '#666' }}>{movie.rating} · {movie.genre} · {movie.runtime}</p>
            <div style={{ display: 'flex', gap: 12, marginTop: 12, fontSize: 13 }}>
              <span>🍅 <strong>{movie.rt}%</strong></span>
              <span>🍿 <strong>{movie.audience}%</strong></span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginTop: 16, paddingTop: 16, borderTop: '1px solid #262626' }}>
              <div>
                <div style={{ fontSize: 9, color: '#666', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Weekend</div>
                <div style={{ fontSize: 18, fontWeight: 700, color: '#f59e0b' }}>{movie.weekend}</div>
              </div>
              <div>
                <div style={{ fontSize: 9, color: '#666', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Total</div>
                <div style={{ fontSize: 18, fontWeight: 700 }}>{movie.total}</div>
              </div>
              <div>
                <div style={{ fontSize: 9, color: '#666', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Theaters</div>
                <div style={{ fontSize: 16, fontWeight: 600 }}>4,007</div>
              </div>
            </div>
          </div>
        </div>
        {/* Table preview */}
        <div style={{ marginTop: 24 }}>
          <div style={{ background: '#1a1a1a', borderRadius: 12, border: '1px solid #262626', overflow: 'hidden' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '40px 1fr 100px 80px 60px', padding: '10px 16px', fontSize: 10, color: '#555', textTransform: 'uppercase', borderBottom: '1px solid #222' }}>
              <span>#</span><span>Film</span><span style={{ textAlign: 'right' }}>Weekend</span><span style={{ textAlign: 'right' }}>Total</span><span style={{ textAlign: 'right' }}>Wks</span>
            </div>
            {[{ r: 1, t: 'Project Hail Mary', w: '$80.5M', tot: '$80.5M', wk: 1 }, { r: 2, t: 'Hoppers', w: '$17.8M', tot: '$120.2M', wk: 3 }].map((m) => (
              <div key={m.r} style={{ display: 'grid', gridTemplateColumns: '40px 1fr 100px 80px 60px', padding: '12px 16px', fontSize: 13, borderBottom: '1px solid #1f1f1f', alignItems: 'center' }}>
                <span style={{ color: '#444', fontWeight: 700 }}>{m.r}</span>
                <span style={{ fontWeight: 600 }}>{m.t}</span>
                <span style={{ textAlign: 'right', fontWeight: 600 }}>{m.w}</span>
                <span style={{ textAlign: 'right', color: '#888' }}>{m.tot}</span>
                <span style={{ textAlign: 'right', color: '#555' }}>{m.wk}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Design 2: Cream — warm off-white, terracotta accent
function Design2() {
  return (
    <div style={{ background: '#faf5ef', color: '#2c2420', fontFamily: "'Georgia', serif" }}>
      <div style={{ borderBottom: '1px solid #e8ddd0', padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ color: '#c2410c', fontSize: 18 }}>★</span>
          <div style={{ lineHeight: 1 }}>
            <div style={{ fontSize: 9, fontWeight: 600, color: '#c2410c', textTransform: 'uppercase', letterSpacing: '0.15em', fontFamily: 'system-ui' }}>The</div>
            <div style={{ fontSize: 16, fontWeight: 700 }}>Box Office</div>
          </div>
        </div>
        <span style={{ fontSize: 12, color: '#8b7355', borderBottom: '2px solid #c2410c', paddingBottom: 4, fontFamily: 'system-ui' }}>This Weekend</span>
      </div>
      <div style={{ padding: 24 }}>
        <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #e8ddd0', padding: 24, display: 'flex', gap: 24, boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
          <img src={movie.poster} alt="" style={{ width: 140, borderRadius: 12, aspectRatio: '2/3', objectFit: 'cover' }} />
          <div style={{ flex: 1 }}>
            <span style={{ background: '#c2410c', color: '#fff', fontSize: 10, fontWeight: 700, padding: '3px 10px', borderRadius: 20 }}>#1 This Weekend</span>
            <h3 style={{ fontSize: 28, fontWeight: 700, margin: '8px 0 4px' }}>{movie.title}</h3>
            <p style={{ fontSize: 13, color: '#8b7355' }}>{movie.studio}</p>
            <p style={{ fontSize: 12, color: '#a89580' }}>{movie.rating} · {movie.genre} · {movie.runtime}</p>
            <div style={{ display: 'flex', gap: 12, marginTop: 12, fontSize: 13 }}>
              <span>🍅 <strong>{movie.rt}%</strong></span>
              <span>🍿 <strong>{movie.audience}%</strong></span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginTop: 16, paddingTop: 16, borderTop: '1px solid #e8ddd0' }}>
              <div>
                <div style={{ fontSize: 9, color: '#a89580', textTransform: 'uppercase', letterSpacing: '0.1em', fontFamily: 'system-ui' }}>Weekend</div>
                <div style={{ fontSize: 18, fontWeight: 700, color: '#c2410c' }}>{movie.weekend}</div>
              </div>
              <div>
                <div style={{ fontSize: 9, color: '#a89580', textTransform: 'uppercase', letterSpacing: '0.1em', fontFamily: 'system-ui' }}>Total</div>
                <div style={{ fontSize: 18, fontWeight: 700 }}>{movie.total}</div>
              </div>
              <div>
                <div style={{ fontSize: 9, color: '#a89580', textTransform: 'uppercase', letterSpacing: '0.1em', fontFamily: 'system-ui' }}>Theaters</div>
                <div style={{ fontSize: 16, fontWeight: 600 }}>4,007</div>
              </div>
            </div>
          </div>
        </div>
        <div style={{ marginTop: 24 }}>
          <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #e8ddd0', overflow: 'hidden' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '40px 1fr 100px 80px 60px', padding: '10px 16px', fontSize: 10, color: '#a89580', textTransform: 'uppercase', borderBottom: '1px solid #e8ddd0', fontFamily: 'system-ui' }}>
              <span>#</span><span>Film</span><span style={{ textAlign: 'right' }}>Weekend</span><span style={{ textAlign: 'right' }}>Total</span><span style={{ textAlign: 'right' }}>Wks</span>
            </div>
            {[{ r: 1, t: 'Project Hail Mary', w: '$80.5M', tot: '$80.5M', wk: 1 }, { r: 2, t: 'Hoppers', w: '$17.8M', tot: '$120.2M', wk: 3 }].map((m) => (
              <div key={m.r} style={{ display: 'grid', gridTemplateColumns: '40px 1fr 100px 80px 60px', padding: '12px 16px', fontSize: 13, borderBottom: '1px solid #f0e8dc', alignItems: 'center' }}>
                <span style={{ color: '#c9b99a', fontWeight: 700 }}>{m.r}</span>
                <span style={{ fontWeight: 600 }}>{m.t}</span>
                <span style={{ textAlign: 'right', fontWeight: 600 }}>{m.w}</span>
                <span style={{ textAlign: 'right', color: '#8b7355' }}>{m.tot}</span>
                <span style={{ textAlign: 'right', color: '#a89580' }}>{m.wk}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Design 3: Slate — cool gray, indigo accent
function Design3() {
  return (
    <div style={{ background: '#f8fafc', color: '#0f172a', fontFamily: "'Inter', system-ui, sans-serif" }}>
      <div style={{ borderBottom: '1px solid #e2e8f0', padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fff' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 28, height: 28, background: '#4f46e5', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ color: '#fff', fontSize: 14, fontWeight: 800 }}>B</span>
          </div>
          <span style={{ fontSize: 16, fontWeight: 700, letterSpacing: '-0.02em' }}>The Box Office</span>
        </div>
        <span style={{ fontSize: 12, color: '#64748b', background: '#f1f5f9', padding: '4px 12px', borderRadius: 20, fontWeight: 500 }}>This Weekend</span>
      </div>
      <div style={{ padding: 24 }}>
        <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #e2e8f0', padding: 24, display: 'flex', gap: 24, boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
          <img src={movie.poster} alt="" style={{ width: 140, borderRadius: 12, aspectRatio: '2/3', objectFit: 'cover' }} />
          <div style={{ flex: 1 }}>
            <span style={{ background: '#4f46e5', color: '#fff', fontSize: 10, fontWeight: 600, padding: '3px 10px', borderRadius: 20 }}>#1 This Weekend</span>
            <h3 style={{ fontSize: 26, fontWeight: 700, margin: '8px 0 4px', letterSpacing: '-0.02em' }}>{movie.title}</h3>
            <p style={{ fontSize: 13, color: '#64748b' }}>{movie.studio}</p>
            <p style={{ fontSize: 12, color: '#94a3b8' }}>{movie.rating} · {movie.genre} · {movie.runtime}</p>
            <div style={{ display: 'flex', gap: 12, marginTop: 12, fontSize: 13 }}>
              <span>🍅 <strong>{movie.rt}%</strong></span>
              <span>🍿 <strong>{movie.audience}%</strong></span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginTop: 16, paddingTop: 16, borderTop: '1px solid #f1f5f9' }}>
              <div>
                <div style={{ fontSize: 9, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Weekend</div>
                <div style={{ fontSize: 18, fontWeight: 700, color: '#4f46e5' }}>{movie.weekend}</div>
              </div>
              <div>
                <div style={{ fontSize: 9, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Total</div>
                <div style={{ fontSize: 18, fontWeight: 700 }}>{movie.total}</div>
              </div>
              <div>
                <div style={{ fontSize: 9, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Theaters</div>
                <div style={{ fontSize: 16, fontWeight: 600 }}>4,007</div>
              </div>
            </div>
          </div>
        </div>
        <div style={{ marginTop: 24 }}>
          <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #e2e8f0', overflow: 'hidden' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '40px 1fr 100px 80px 60px', padding: '10px 16px', fontSize: 10, color: '#94a3b8', textTransform: 'uppercase', borderBottom: '1px solid #f1f5f9' }}>
              <span>#</span><span>Film</span><span style={{ textAlign: 'right' }}>Weekend</span><span style={{ textAlign: 'right' }}>Total</span><span style={{ textAlign: 'right' }}>Wks</span>
            </div>
            {[{ r: 1, t: 'Project Hail Mary', w: '$80.5M', tot: '$80.5M', wk: 1 }, { r: 2, t: 'Hoppers', w: '$17.8M', tot: '$120.2M', wk: 3 }].map((m) => (
              <div key={m.r} style={{ display: 'grid', gridTemplateColumns: '40px 1fr 100px 80px 60px', padding: '12px 16px', fontSize: 13, borderBottom: '1px solid #f8fafc', alignItems: 'center' }}>
                <span style={{ color: '#cbd5e1', fontWeight: 700 }}>{m.r}</span>
                <span style={{ fontWeight: 600 }}>{m.t}</span>
                <span style={{ textAlign: 'right', fontWeight: 600 }}>{m.w}</span>
                <span style={{ textAlign: 'right', color: '#64748b' }}>{m.tot}</span>
                <span style={{ textAlign: 'right', color: '#94a3b8' }}>{m.wk}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Design 4: Noir — pure black/white, red accent, cinematic
function Design4() {
  return (
    <div style={{ background: '#000', color: '#fff', fontFamily: "'Inter', system-ui, sans-serif" }}>
      <div style={{ borderBottom: '1px solid #1a1a1a', padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 6, height: 24, background: '#dc2626', borderRadius: 3 }} />
          <span style={{ fontSize: 16, fontWeight: 800, letterSpacing: '0.05em', textTransform: 'uppercase' }}>The Box Office</span>
        </div>
        <span style={{ fontSize: 11, color: '#555', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Weekend</span>
      </div>
      <div style={{ padding: 24 }}>
        <div style={{ background: '#0a0a0a', borderRadius: 16, border: '1px solid #1a1a1a', padding: 24, display: 'flex', gap: 24 }}>
          <img src={movie.poster} alt="" style={{ width: 140, borderRadius: 12, aspectRatio: '2/3', objectFit: 'cover' }} />
          <div style={{ flex: 1 }}>
            <span style={{ background: '#dc2626', color: '#fff', fontSize: 10, fontWeight: 700, padding: '3px 10px', borderRadius: 4, textTransform: 'uppercase', letterSpacing: '0.05em' }}>#1</span>
            <h3 style={{ fontSize: 28, fontWeight: 800, margin: '8px 0 4px', letterSpacing: '-0.02em' }}>{movie.title}</h3>
            <p style={{ fontSize: 13, color: '#777' }}>{movie.studio}</p>
            <p style={{ fontSize: 12, color: '#555' }}>{movie.rating} · {movie.genre} · {movie.runtime}</p>
            <div style={{ display: 'flex', gap: 12, marginTop: 12, fontSize: 13 }}>
              <span>🍅 <strong>{movie.rt}%</strong></span>
              <span>🍿 <strong>{movie.audience}%</strong></span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginTop: 16, paddingTop: 16, borderTop: '1px solid #1a1a1a' }}>
              <div>
                <div style={{ fontSize: 9, color: '#555', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Weekend</div>
                <div style={{ fontSize: 18, fontWeight: 700, color: '#dc2626' }}>{movie.weekend}</div>
              </div>
              <div>
                <div style={{ fontSize: 9, color: '#555', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Total</div>
                <div style={{ fontSize: 18, fontWeight: 700 }}>{movie.total}</div>
              </div>
              <div>
                <div style={{ fontSize: 9, color: '#555', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Theaters</div>
                <div style={{ fontSize: 16, fontWeight: 600 }}>4,007</div>
              </div>
            </div>
          </div>
        </div>
        <div style={{ marginTop: 24 }}>
          <div style={{ background: '#0a0a0a', borderRadius: 12, border: '1px solid #1a1a1a', overflow: 'hidden' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '40px 1fr 100px 80px 60px', padding: '10px 16px', fontSize: 10, color: '#444', textTransform: 'uppercase', borderBottom: '1px solid #1a1a1a' }}>
              <span>#</span><span>Film</span><span style={{ textAlign: 'right' }}>Weekend</span><span style={{ textAlign: 'right' }}>Total</span><span style={{ textAlign: 'right' }}>Wks</span>
            </div>
            {[{ r: 1, t: 'Project Hail Mary', w: '$80.5M', tot: '$80.5M', wk: 1 }, { r: 2, t: 'Hoppers', w: '$17.8M', tot: '$120.2M', wk: 3 }].map((m) => (
              <div key={m.r} style={{ display: 'grid', gridTemplateColumns: '40px 1fr 100px 80px 60px', padding: '12px 16px', fontSize: 13, borderBottom: '1px solid #111', alignItems: 'center' }}>
                <span style={{ color: '#333', fontWeight: 700 }}>{m.r}</span>
                <span style={{ fontWeight: 600 }}>{m.t}</span>
                <span style={{ textAlign: 'right', fontWeight: 600 }}>{m.w}</span>
                <span style={{ textAlign: 'right', color: '#777' }}>{m.tot}</span>
                <span style={{ textAlign: 'right', color: '#555' }}>{m.wk}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Design 5: Ocean — deep navy, teal/cyan accent
function Design5() {
  return (
    <div style={{ background: '#0c1222', color: '#e2e8f0', fontFamily: "'Inter', system-ui, sans-serif" }}>
      <div style={{ borderBottom: '1px solid #1e293b', padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ color: '#06b6d4', fontSize: 20 }}>★</span>
          <div style={{ lineHeight: 1 }}>
            <div style={{ fontSize: 9, fontWeight: 600, color: '#06b6d4', textTransform: 'uppercase', letterSpacing: '0.15em' }}>The</div>
            <div style={{ fontSize: 16, fontWeight: 700 }}>Box Office</div>
          </div>
        </div>
        <span style={{ fontSize: 12, color: '#64748b', borderBottom: '2px solid #06b6d4', paddingBottom: 4 }}>This Weekend</span>
      </div>
      <div style={{ padding: 24 }}>
        <div style={{ background: '#111827', borderRadius: 16, border: '1px solid #1e293b', padding: 24, display: 'flex', gap: 24 }}>
          <img src={movie.poster} alt="" style={{ width: 140, borderRadius: 12, aspectRatio: '2/3', objectFit: 'cover' }} />
          <div style={{ flex: 1 }}>
            <span style={{ background: '#06b6d4', color: '#000', fontSize: 10, fontWeight: 700, padding: '3px 10px', borderRadius: 20 }}>#1 This Weekend</span>
            <h3 style={{ fontSize: 26, fontWeight: 700, margin: '8px 0 4px', letterSpacing: '-0.02em' }}>{movie.title}</h3>
            <p style={{ fontSize: 13, color: '#94a3b8' }}>{movie.studio}</p>
            <p style={{ fontSize: 12, color: '#64748b' }}>{movie.rating} · {movie.genre} · {movie.runtime}</p>
            <div style={{ display: 'flex', gap: 12, marginTop: 12, fontSize: 13 }}>
              <span>🍅 <strong>{movie.rt}%</strong></span>
              <span>🍿 <strong>{movie.audience}%</strong></span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginTop: 16, paddingTop: 16, borderTop: '1px solid #1e293b' }}>
              <div>
                <div style={{ fontSize: 9, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Weekend</div>
                <div style={{ fontSize: 18, fontWeight: 700, color: '#06b6d4' }}>{movie.weekend}</div>
              </div>
              <div>
                <div style={{ fontSize: 9, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Total</div>
                <div style={{ fontSize: 18, fontWeight: 700 }}>{movie.total}</div>
              </div>
              <div>
                <div style={{ fontSize: 9, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Theaters</div>
                <div style={{ fontSize: 16, fontWeight: 600 }}>4,007</div>
              </div>
            </div>
          </div>
        </div>
        <div style={{ marginTop: 24 }}>
          <div style={{ background: '#111827', borderRadius: 12, border: '1px solid #1e293b', overflow: 'hidden' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '40px 1fr 100px 80px 60px', padding: '10px 16px', fontSize: 10, color: '#475569', textTransform: 'uppercase', borderBottom: '1px solid #1e293b' }}>
              <span>#</span><span>Film</span><span style={{ textAlign: 'right' }}>Weekend</span><span style={{ textAlign: 'right' }}>Total</span><span style={{ textAlign: 'right' }}>Wks</span>
            </div>
            {[{ r: 1, t: 'Project Hail Mary', w: '$80.5M', tot: '$80.5M', wk: 1 }, { r: 2, t: 'Hoppers', w: '$17.8M', tot: '$120.2M', wk: 3 }].map((m) => (
              <div key={m.r} style={{ display: 'grid', gridTemplateColumns: '40px 1fr 100px 80px 60px', padding: '12px 16px', fontSize: 13, borderBottom: '1px solid #162032', alignItems: 'center' }}>
                <span style={{ color: '#334155', fontWeight: 700 }}>{m.r}</span>
                <span style={{ fontWeight: 600 }}>{m.t}</span>
                <span style={{ textAlign: 'right', fontWeight: 600 }}>{m.w}</span>
                <span style={{ textAlign: 'right', color: '#94a3b8' }}>{m.tot}</span>
                <span style={{ textAlign: 'right', color: '#64748b' }}>{m.wk}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function DesignShowcase() {
  return (
    <div className="min-h-screen bg-gray-100 p-10 font-sans">
      <h1 className="text-3xl font-bold mb-2">Design Options</h1>
      <p className="text-gray-500 mb-10">5 minimal UI designs. Pick a number to build it out fully.</p>

      <DesignCard
        name="Option 1: Midnight"
        description="Dark mode with amber/gold accents. Warm and cinematic — great for movie content."
        palette={['#0f0f0f', '#1a1a1a', '#f59e0b', '#e5e5e5', '#666']}
      >
        <Design1 />
      </DesignCard>

      <DesignCard
        name="Option 2: Cream"
        description="Warm off-white with terracotta accent and serif typography. Elegant and editorial."
        palette={['#faf5ef', '#fff', '#c2410c', '#2c2420', '#a89580']}
      >
        <Design2 />
      </DesignCard>

      <DesignCard
        name="Option 3: Slate"
        description="Cool gray with indigo accent. Clean, modern SaaS-style interface."
        palette={['#f8fafc', '#fff', '#4f46e5', '#0f172a', '#94a3b8']}
      >
        <Design3 />
      </DesignCard>

      <DesignCard
        name="Option 4: Noir"
        description="Pure black with red accent. High contrast, cinematic, bold typography."
        palette={['#000', '#0a0a0a', '#dc2626', '#fff', '#555']}
      >
        <Design4 />
      </DesignCard>

      <DesignCard
        name="Option 5: Ocean"
        description="Deep navy with teal/cyan accent. Premium dark theme with cool tones."
        palette={['#0c1222', '#111827', '#06b6d4', '#e2e8f0', '#64748b']}
      >
        <Design5 />
      </DesignCard>
    </div>
  );
}
