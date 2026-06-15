export function FlameCharacter({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 220 285"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className={className}
    >
      <defs>
        <linearGradient
          id="fc-fire"
          x1="110"
          y1="190"
          x2="110"
          y2="2"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#c2410c" />
          <stop offset="18%" stopColor="#ea580c" />
          <stop offset="38%" stopColor="#f97316" />
          <stop offset="58%" stopColor="#fb923c" />
          <stop offset="76%" stopColor="#fbbf24" />
          <stop offset="90%" stopColor="#fef08a" />
          <stop offset="100%" stopColor="#fefce8" stopOpacity="0.9" />
        </linearGradient>
        <radialGradient
          id="fc-head"
          cx="110"
          cy="228"
          r="66"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#fef3c7" />
          <stop offset="20%" stopColor="#fde68a" />
          <stop offset="42%" stopColor="#fbbf24" />
          <stop offset="62%" stopColor="#f97316" />
          <stop offset="80%" stopColor="#ea580c" />
          <stop offset="94%" stopColor="#c2410c" />
          <stop offset="100%" stopColor="#9a3412" />
        </radialGradient>
        <radialGradient
          id="fc-glow"
          cx="110"
          cy="250"
          r="100"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#f97316" stopOpacity="0.45" />
          <stop offset="100%" stopColor="#f97316" stopOpacity="0" />
        </radialGradient>
        <filter id="fc-blur" x="-25%" y="-10%" width="150%" height="125%">
          <feGaussianBlur stdDeviation="3" />
        </filter>
      </defs>

      <ellipse cx="110" cy="254" rx="96" ry="48" fill="url(#fc-glow)" />
      <ellipse cx="110" cy="275" rx="36" ry="6" fill="#1a0804" opacity="0.5" />

      {/* Arms */}
      <path
        d="M 46,232 C 24,224 8,210 12,193 C 16,179 30,184 42,201 C 44,217 45,228 46,232 Z"
        fill="url(#fc-fire)"
      />
      <path
        d="M 174,232 C 196,224 212,210 208,193 C 204,179 190,184 178,201 C 176,217 175,228 174,232 Z"
        fill="url(#fc-fire)"
      />

      {/* Soft glow aura behind flame */}
      <path
        d="M 42,188
           C 24,162 12,126 15,92
           C 16,76 24,52 38,26
           C 58,10 82,2 110,4
           C 138,2 162,10 182,26
           C 196,52 204,76 205,92
           C 208,126 196,162 178,188
           Z"
        fill="url(#fc-fire)"
        filter="url(#fc-blur)"
        opacity="0.8"
      />

      {/* Main flame — base ~head width, flares outward mid-height, single center tip */}
      <path
        d="M 42,188
           C 24,162 12,126 15,92
           C 16,76 24,52 38,26
           C 58,10 82,2 110,4
           C 138,2 162,10 182,26
           C 196,52 204,76 205,92
           C 208,126 196,162 178,188
           Z"
        fill="url(#fc-fire)"
      />

      {/* Round glowing head */}
      <ellipse cx="110" cy="228" rx="66" ry="62" fill="url(#fc-head)" />

      {/* Brows */}
      <path
        d="M 78,212 Q 90,207 100,210"
        stroke="#5c2000"
        strokeWidth="2.6"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M 120,210 Q 130,207 142,212"
        stroke="#5c2000"
        strokeWidth="2.6"
        fill="none"
        strokeLinecap="round"
      />

      {/* Eyes */}
      <circle cx="92" cy="227" r="11" fill="white" />
      <circle cx="128" cy="227" r="11" fill="white" />
      <circle cx="93" cy="228" r="7.5" fill="#1a0800" />
      <circle cx="129" cy="228" r="7.5" fill="#1a0800" />
      <circle cx="97" cy="224" r="3" fill="white" />
      <circle cx="133" cy="224" r="3" fill="white" />

      {/* Smile */}
      <path
        d="M 96,245 Q 110,255 124,245"
        stroke="#5c2000"
        strokeWidth="2.6"
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  );
}
