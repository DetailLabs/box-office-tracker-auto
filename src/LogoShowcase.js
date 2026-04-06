import React from "react";

// Current Design Logos (warm, modern, serif)
function CurrentLogo1() {
  return (
    <div className="flex items-center gap-2">
      <svg className="w-8 h-8 text-rose-600" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
      </svg>
      <span className="text-xl font-serif font-bold tracking-tight">The Box Office</span>
    </div>
  );
}

function CurrentLogo2() {
  return (
    <div className="flex items-center gap-2.5">
      <div className="w-8 h-8 bg-rose-600 rounded-lg flex items-center justify-center">
        <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
          <path d="M18 4l2 4h-3l-2-4h-2l2 4h-3l-2-4H8l2 4H7L5 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4h-4z"/>
        </svg>
      </div>
      <span className="text-xl font-serif font-bold tracking-tight">The Box Office</span>
    </div>
  );
}

function CurrentLogo3() {
  return (
    <div className="flex items-center gap-2">
      <div className="relative">
        <svg className="w-8 h-8 text-rose-600" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      </div>
      <div className="flex flex-col leading-none">
        <span className="text-[10px] font-semibold text-rose-500 uppercase tracking-widest">The</span>
        <span className="text-lg font-serif font-bold tracking-tight -mt-0.5">Box Office</span>
      </div>
    </div>
  );
}

function CurrentLogo4() {
  return (
    <div className="flex items-center gap-2">
      <div className="w-9 h-9 rounded-full border-2 border-rose-600 flex items-center justify-center">
        <span className="text-sm font-serif font-black text-rose-600">BO</span>
      </div>
      <span className="text-xl font-serif font-bold tracking-tight">The Box Office</span>
    </div>
  );
}

function CurrentLogo5() {
  return (
    <div className="flex items-center gap-2">
      <svg className="w-8 h-8" viewBox="0 0 32 32" fill="none">
        <rect x="2" y="6" width="28" height="20" rx="3" fill="#e11d48" />
        <rect x="5" y="9" width="22" height="14" rx="1" fill="white" />
        <circle cx="16" cy="16" r="4" fill="#e11d48" opacity="0.9" />
        <circle cx="16" cy="16" r="2" fill="white" />
      </svg>
      <span className="text-xl font-serif font-bold tracking-tight">The Box Office</span>
    </div>
  );
}

// Editorial Design Logos (bold, newspaper, heavy type)
function EditorialLogo1() {
  return (
    <div className="flex items-center gap-0">
      <span className="text-2xl font-black tracking-tighter uppercase">The Box Office</span>
    </div>
  );
}

function EditorialLogo2() {
  return (
    <div className="flex items-center gap-3">
      <div className="bg-gray-900 text-white px-2 py-1">
        <span className="text-lg font-black tracking-tight">TBO</span>
      </div>
      <span className="text-2xl font-black tracking-tighter uppercase">The Box Office</span>
    </div>
  );
}

function EditorialLogo3() {
  return (
    <div className="flex flex-col leading-none">
      <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-400">The</span>
      <span className="text-2xl font-black tracking-tighter uppercase -mt-0.5">Box Office</span>
    </div>
  );
}

function EditorialLogo4() {
  return (
    <div className="flex items-center gap-2">
      <div className="flex flex-col items-center leading-none bg-gray-900 text-white px-2.5 py-1.5 rounded-sm">
        <span className="text-[8px] font-bold uppercase tracking-[0.2em]">The</span>
        <span className="text-sm font-black uppercase tracking-tight -mt-0.5">Box Office</span>
      </div>
    </div>
  );
}

function EditorialLogo5() {
  return (
    <div className="flex items-center gap-2">
      <svg className="w-7 h-7" viewBox="0 0 28 28" fill="none">
        <rect x="1" y="1" width="26" height="26" stroke="#111827" strokeWidth="2.5" />
        <path d="M7 8h14M7 14h14M7 20h14" stroke="#111827" strokeWidth="2" />
      </svg>
      <span className="text-2xl font-black tracking-tighter uppercase">The Box Office</span>
    </div>
  );
}

export default function LogoShowcase() {
  const currentLogos = [
    { name: "Option 1: Star + Serif", component: <CurrentLogo1 />, desc: "Classic star icon with elegant serif text" },
    { name: "Option 2: Clapperboard Badge", component: <CurrentLogo2 />, desc: "Film clapperboard in a rose rounded badge" },
    { name: "Option 3: Stacked Star", component: <CurrentLogo3 />, desc: "Star icon with stacked 'The' above 'Box Office'" },
    { name: "Option 4: Circle Monogram", component: <CurrentLogo4 />, desc: "BO monogram in a circle with serif text" },
    { name: "Option 5: Film Reel", component: <CurrentLogo5 />, desc: "Stylized film reel icon with serif text" },
  ];

  const editorialLogos = [
    { name: "Option 1: Pure Typography", component: <EditorialLogo1 />, desc: "Bold uppercase lettering, no icon — newspaper masthead style" },
    { name: "Option 2: Block Monogram", component: <EditorialLogo2 />, desc: "TBO in a black block + full name" },
    { name: "Option 3: Stacked Type", component: <EditorialLogo3 />, desc: "'The' in small caps above bold 'Box Office'" },
    { name: "Option 4: Badge Lockup", component: <EditorialLogo4 />, desc: "Full name in a dark badge — compact and punchy" },
    { name: "Option 5: Grid Icon", component: <EditorialLogo5 />, desc: "Newspaper grid icon + bold type" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-10 font-sans">
      <h1 className="text-3xl font-bold mb-2">Logo Options</h1>
      <p className="text-gray-500 mb-10">Pick a number from each section to apply it.</p>

      <div className="grid grid-cols-2 gap-12">
        {/* Current Design */}
        <div>
          <h2 className="text-lg font-bold mb-1 text-rose-600">Current Design</h2>
          <p className="text-xs text-gray-400 mb-6">Warm, modern, serif-based</p>
          <div className="space-y-6">
            {currentLogos.map((logo, i) => (
              <div key={i} className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
                <div className="mb-3">{logo.component}</div>
                <p className="text-sm font-semibold text-gray-700">{logo.name}</p>
                <p className="text-xs text-gray-400">{logo.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Editorial Design */}
        <div>
          <h2 className="text-lg font-bold mb-1 text-gray-900">Editorial Design</h2>
          <p className="text-xs text-gray-400 mb-6">Bold, newspaper-inspired, heavy type</p>
          <div className="space-y-6">
            {editorialLogos.map((logo, i) => (
              <div key={i} className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
                <div className="mb-3">{logo.component}</div>
                <p className="text-sm font-semibold text-gray-700">{logo.name}</p>
                <p className="text-xs text-gray-400">{logo.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
