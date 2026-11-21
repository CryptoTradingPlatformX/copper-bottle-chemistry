import { Legend } from "./Legend";

export function Hero() {
  return (
    <header className="hero">
      <p className="eyebrow">A molecule-level tour</p>
      <h1>Copper bottle chemistry</h1>
      <div className="hero-art" aria-hidden="true">
        <svg className="bottle" viewBox="0 0 220 340">
          <defs>
            <linearGradient id="hero-copper" x1="0" x2="1" y1="0" y2="1">
              <stop offset="0%" stopColor="#f6d3b4" />
              <stop offset="28%" stopColor="#e3a56a" />
              <stop offset="68%" stopColor="#c56d3c" />
              <stop offset="100%" stopColor="#7d3d24" />
            </linearGradient>
            <linearGradient id="hero-water" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#e7f8fb" />
              <stop offset="42%" stopColor="#7ec8d8" />
              <stop offset="100%" stopColor="#2d738a" />
            </linearGradient>
            <clipPath id="hero-clip">
              <path d="M90 36 H130 V78 C130 98 164 100 164 128 V248 A54 54 0 0 1 56 248 V128 C56 100 90 98 90 78 Z" />
            </clipPath>
          </defs>
          <ellipse cx="110" cy="318" rx="70" ry="12" fill="rgba(90,48,28,0.16)" />
          <path
            d="M90 36 H130 V78 C130 98 164 100 164 128 V248 A54 54 0 0 1 56 248 V128 C56 100 90 98 90 78 Z"
            fill="url(#hero-copper)"
          />
          <g clipPath="url(#hero-clip)">
            <g className="tide">
              <path d="M40 176 Q75 166 110 176 T180 176 V310 H40 Z" fill="url(#hero-water)" />
              <g fill="#ef6b57">
                <circle cx="86" cy="214" r="7" />
                <circle cx="128" cy="236" r="7" />
                <circle cx="104" cy="262" r="7" />
              </g>
              <g fill="#f7f4ee" stroke="#d9d3c8" strokeWidth="0.5">
                <circle cx="74" cy="206" r="4" />
                <circle cx="98" cy="206" r="4" />
                <circle cx="116" cy="228" r="4" />
                <circle cx="140" cy="230" r="4" />
                <circle cx="92" cy="254" r="4" />
                <circle cx="116" cy="256" r="4" />
              </g>
            </g>
          </g>
          <path
            d="M90 36 H130 V78 C130 98 164 100 164 128 V248 A54 54 0 0 1 56 248 V128 C56 100 90 98 90 78 Z"
            fill="none"
            stroke="rgba(255,248,240,0.55)"
            strokeWidth="3"
          />
          <ellipse cx="110" cy="36" rx="20" ry="7" fill="#f8dcc6" />
          <ellipse cx="110" cy="36" rx="12" ry="4" fill="#214650" />
          <path d="M78 70 v46" stroke="rgba(255,255,255,0.45)" strokeWidth="5" strokeLinecap="round" />
        </svg>
      </div>
      <div className="hero-copy">
        <p className="lede">
          What the water, the metal, and the tarnish are actually doing, shown for anyone who last met chemistry a long time ago.
          Eight short scenes. Each one moves. Pause it, or step through the captions.
        </p>
        <p className="lede lede-second">
          This tour assumes a bare copper surface on the inside. Many bottles sold as copper are lined, and then the water never meets the metal.
        </p>
        <a className="start" href="#scene-zoom">
          Start with the water
        </a>
        <Legend />
      </div>
    </header>
  );
}
