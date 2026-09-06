/**
 * Growth trajectory graphic for the results card: five ascending bars, a rising
 * arrow and a rocket. Hand-authored SVG — no photographic asset is involved.
 */
export function RocketChart({ className }: { className?: string }) {
  const bars = [
    { x: 96, h: 44 },
    { x: 134, h: 68 },
    { x: 172, h: 96 },
    { x: 210, h: 128 },
    { x: 248, h: 166 },
  ];

  return (
    <svg
      className={className}
      viewBox="0 0 320 250"
      fill="none"
      role="img"
      aria-label="Growth trajectory: traffic, leads, customers and revenue rising month over month"
    >
      <defs>
        <linearGradient id="kx-bar-a" x1="0" y1="1" x2="0" y2="0">
          <stop stopColor="#A472F2" />
          <stop offset="1" stopColor="#8B5CF6" />
        </linearGradient>
        <linearGradient id="kx-bar-b" x1="0" y1="1" x2="0" y2="0">
          <stop stopColor="#9B5CF0" />
          <stop offset="1" stopColor="#A855F7" />
        </linearGradient>
        <linearGradient id="kx-bar-c" x1="0" y1="1" x2="0" y2="0">
          <stop stopColor="#A855F7" />
          <stop offset="1" stopColor="#C13FD6" />
        </linearGradient>
        <linearGradient id="kx-bar-d" x1="0" y1="1" x2="0" y2="0">
          <stop stopColor="#C13FD6" />
          <stop offset="1" stopColor="#E22FA8" />
        </linearGradient>
        <linearGradient id="kx-bar-e" x1="0" y1="1" x2="0" y2="0">
          <stop stopColor="#EE2694" />
          <stop offset="1" stopColor="#F0197F" />
        </linearGradient>
        <linearGradient id="kx-trend" x1="30" y1="220" x2="290" y2="40" gradientUnits="userSpaceOnUse">
          <stop stopColor="#9B5CF0" />
          <stop offset="1" stopColor="#F0197F" />
        </linearGradient>
        <linearGradient id="kx-rk-body" x1="-18" y1="-40" x2="18" y2="26" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FFFFFF" />
          <stop offset="1" stopColor="#EDE6F6" />
        </linearGradient>
        <linearGradient id="kx-rk-nose" x1="0" y1="-44" x2="0" y2="-10" gradientUnits="userSpaceOnUse">
          <stop stopColor="#F94E9E" />
          <stop offset="1" stopColor="#EC1B7B" />
        </linearGradient>
        <linearGradient id="kx-rk-flame" x1="0" y1="24" x2="0" y2="52" gradientUnits="userSpaceOnUse">
          <stop stopColor="#F94E9E" />
          <stop offset="1" stopColor="#FBBF6B" stopOpacity="0.9" />
        </linearGradient>
      </defs>

      {/* Bars */}
      {bars.map((b, i) => (
        <rect
          key={b.x}
          x={b.x}
          y={228 - b.h}
          width="28"
          height={b.h}
          rx="6"
          fill={`url(#kx-bar-${["a", "b", "c", "d", "e"][i]})`}
        />
      ))}

      {/* Rising trend arrow */}
      <path
        d="M40 214C86 206 130 176 162 132C192 90 220 62 258 46"
        stroke="url(#kx-trend)"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M238 40L260 44L252 65"
        stroke="url(#kx-trend)"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />

      {/* Rocket */}
      <g transform="translate(268 54) rotate(40) scale(0.82)">
        <path d="M-9 25C-6 40 0 52 0 52C0 52 6 40 9 25Z" fill="url(#kx-rk-flame)" />
        <path
          d="M-16 5C-28 13 -31 26 -29 35L-16 26Z"
          fill="#EC1B7B"
        />
        <path d="M16 5C28 13 31 26 29 35L16 26Z" fill="#EC1B7B" />
        <path
          d="M0-44C13-27 17-6 17 10V22C11 27-11 27-17 22V10C-17-6-13-27 0-44Z"
          fill="url(#kx-rk-body)"
        />
        <path d="M0-44C7-35 11-25 13-14H-13C-11-25-7-35 0-44Z" fill="url(#kx-rk-nose)" />
        <circle cx="0" cy="-3" r="8" fill="#2A2150" />
        <circle cx="0" cy="-3" r="5.4" fill="#8B5CF6" />
        <path d="M-14 20H14" stroke="#EC1B7B" strokeWidth="3" strokeLinecap="round" />
      </g>

      {/* Motion trail */}
      <g stroke="#F0197F" strokeWidth="2.4" strokeLinecap="round" opacity="0.45">
        <path d="M232 96L222 108" />
        <path d="M246 104L238 114" />
      </g>
    </svg>
  );
}
