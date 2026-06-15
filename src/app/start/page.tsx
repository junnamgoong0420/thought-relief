"use client";

import { useState } from "react";

function BonfireIllustration() {
  return (
    <svg
      viewBox="0 0 200 250"
      xmlns="http://www.w3.org/2000/svg"
      className="mx-auto w-44 sm:w-64"
      aria-hidden="true"
    >
      <defs>
        <linearGradient
          id="bf-outer"
          x1="100"
          y1="230"
          x2="100"
          y2="30"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#7c2d12" />
          <stop offset="25%" stopColor="#c2410c" />
          <stop offset="55%" stopColor="#ea580c" />
          <stop offset="80%" stopColor="#f97316" />
          <stop offset="95%" stopColor="#fb923c" />
          <stop offset="100%" stopColor="#fed7aa" stopOpacity="0.1" />
        </linearGradient>
        <linearGradient
          id="bf-mid"
          x1="100"
          y1="230"
          x2="100"
          y2="55"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#c2410c" />
          <stop offset="30%" stopColor="#ea580c" />
          <stop offset="60%" stopColor="#f97316" />
          <stop offset="85%" stopColor="#fbbf24" />
          <stop offset="100%" stopColor="#fef9c3" stopOpacity="0.2" />
        </linearGradient>
        <linearGradient
          id="bf-inner"
          x1="100"
          y1="230"
          x2="100"
          y2="95"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#ea580c" />
          <stop offset="35%" stopColor="#f97316" />
          <stop offset="65%" stopColor="#fbbf24" />
          <stop offset="88%" stopColor="#fde68a" />
          <stop offset="100%" stopColor="#fffbeb" stopOpacity="0.5" />
        </linearGradient>
        <linearGradient
          id="bf-core"
          x1="100"
          y1="230"
          x2="100"
          y2="130"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#fb923c" />
          <stop offset="40%" stopColor="#fbbf24" />
          <stop offset="75%" stopColor="#fde68a" />
          <stop offset="100%" stopColor="#fff" stopOpacity="0.7" />
        </linearGradient>
        <radialGradient
          id="bf-glow"
          cx="100"
          cy="232"
          r="90"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#ea580c" stopOpacity="0.55" />
          <stop offset="55%" stopColor="#c2410c" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#c2410c" stopOpacity="0" />
        </radialGradient>
        <style>{`
          @keyframes bf-sway {
            0%,100% { transform: scaleX(1) skewX(0deg); opacity:1; }
            28% { transform: scaleX(0.96) skewX(-2deg); opacity:0.9; }
            65% { transform: scaleX(1.03) skewX(1.5deg); opacity:0.95; }
          }
          @keyframes bf-sway2 {
            0%,100% { transform: scaleX(1) skewX(0deg); opacity:1; }
            38% { transform: scaleX(1.04) skewX(2deg); opacity:0.88; }
            72% { transform: scaleX(0.95) skewX(-1.5deg); opacity:0.95; }
          }
          @keyframes bf-flicker {
            0%,100% { opacity:0.9; transform:scaleY(1); }
            45% { opacity:0.75; transform:scaleY(0.97); }
            80% { opacity:0.95; transform:scaleY(1.02); }
          }
          .bf-a { animation: bf-sway 2.9s ease-in-out infinite; transform-origin: 100px 225px; }
          .bf-b { animation: bf-sway2 2.2s ease-in-out infinite; transform-origin: 100px 225px; animation-delay:-0.4s; }
          .bf-c { animation: bf-sway 1.8s ease-in-out infinite reverse; transform-origin: 100px 225px; animation-delay:-1s; }
          .bf-d { animation: bf-flicker 1.3s ease-in-out infinite; transform-origin: 100px 225px; animation-delay:-0.2s; }
        `}</style>
      </defs>

      {/* Base glow */}
      <ellipse cx="100" cy="232" rx="90" ry="20" fill="url(#bf-glow)" />

      {/* Logs */}
      <rect
        x="25"
        y="218"
        width="68"
        height="13"
        rx="6.5"
        fill="#1c0a03"
        transform="rotate(-20 59 224)"
      />
      <rect
        x="107"
        y="218"
        width="68"
        height="13"
        rx="6.5"
        fill="#2a0f05"
        transform="rotate(20 141 224)"
      />
      <ellipse cx="100" cy="228" rx="16" ry="9" fill="#3d1207" />

      {/* Outer flame */}
      <g className="bf-a">
        <path
          d="M 38,228
             C 22,208 24,178 36,152
             C 44,172 46,194 48,212
             C 52,185 58,152 64,118
             C 70,150 68,184 68,215
             C 72,182 78,146 84,112
             C 90,146 88,182 88,216
             C 92,178 98,140 100,105
             C 106,140 106,178 106,218
             C 108,180 116,146 122,115
             C 128,148 126,182 124,216
             C 128,185 136,152 142,125
             C 148,155 144,190 142,218
             C 147,194 153,170 158,153
             C 164,174 160,206 154,228 Z"
          fill="url(#bf-outer)"
          opacity="0.88"
        />
      </g>

      {/* Mid flame */}
      <g className="bf-b">
        <path
          d="M 52,228
             C 40,210 40,184 50,162
             C 57,180 59,200 61,216
             C 65,188 70,158 76,126
             C 82,158 80,192 80,218
             C 84,186 90,154 95,124
             C 100,156 99,190 98,220
             C 102,186 108,154 112,126
             C 117,158 116,192 114,222
             C 118,190 125,158 130,132
             C 135,162 132,196 128,224
             C 133,202 140,178 144,160
             C 148,182 144,212 136,228 Z"
          fill="url(#bf-mid)"
        />
      </g>

      {/* Inner flame */}
      <g className="bf-c">
        <path
          d="M 66,228
             C 58,212 57,190 65,170
             C 70,188 72,206 74,220
             C 78,196 83,168 88,140
             C 92,168 91,198 90,222
             C 94,196 99,165 103,138
             C 107,165 106,198 104,224
             C 108,196 113,165 117,140
             C 121,168 120,200 116,226
             C 121,204 127,184 130,168
             C 133,190 129,218 120,228 Z"
          fill="url(#bf-inner)"
        />
      </g>

      {/* Core bright */}
      <g className="bf-d">
        <path
          d="M 82,228
             C 76,214 75,196 82,178
             C 86,194 88,210 90,222
             C 93,202 97,178 100,155
             C 103,178 102,204 102,224
             C 105,200 110,175 113,156
             C 116,178 114,205 111,226
             C 114,210 119,194 122,182
             C 124,200 120,220 112,228 Z"
          fill="url(#bf-core)"
          opacity="0.85"
        />
      </g>
    </svg>
  );
}

function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="border-b border-border py-5 text-center">
        <a href="/" className="font-display text-lg font-bold text-foreground transition-opacity hover:opacity-70">
          ThoughtRelief
        </a>
      </header>
      <main className="flex flex-1 flex-col items-center justify-center px-6 py-12">
        {children}
      </main>
      <footer className="border-t border-border py-5 text-center">
        <p className="text-xs uppercase tracking-widest text-muted-foreground">
          Thought Relief is not a therapy or crisis service. If you&apos;re in
          crisis, text or call 988.
        </p>
      </footer>
    </div>
  );
}

export default function StartPage() {
  const [text, setText] = useState("");
  const [submitted, setSubmitted] = useState(false);

  if (submitted) {
    return (
      <PageShell>
        <div className="flex flex-col items-center text-center">
          <BonfireIllustration />
          <h2 className="font-display mt-6 mb-2 text-3xl font-bold text-foreground">
            Still in development.
          </h2>
          <p className="mb-8 text-muted-foreground">Check back soon.</p>
          <a
            href="/"
            className="rounded-xl border border-border bg-card px-8 py-3 font-semibold text-foreground transition-opacity hover:opacity-70"
          >
            Learn more about ThoughtRelief
          </a>
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        className="mx-auto mb-6 w-10 text-primary sm:w-12"
      >
        <path d="M8.5 14.5A2.5 2.5 0 0011 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 11-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 002.5 2.5z" />
      </svg>

      <div className="w-full max-w-2xl text-center">
        <h1 className="font-display mb-3 text-4xl font-bold text-foreground md:text-5xl">
          What&apos;s on your mind tonight?
        </h1>
        <p className="mb-8 text-muted-foreground">
          No need to organize it. Just let it out — we&apos;ll help you make
          sense of it.
        </p>

        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={
            "I'm freaking out about tomorrow's chem test...\nJust type. There's no wrong way to start."
          }
          rows={8}
          className="mb-6 w-full resize-none rounded-2xl border border-border bg-card px-6 py-5 text-left text-base text-foreground placeholder:italic placeholder:text-muted-foreground/60 focus:border-primary focus:outline-none"
        />

        <div className="flex flex-col items-center gap-3">
          <button
            type="button"
            onClick={() => setSubmitted(true)}
            className="rounded-full bg-primary px-16 py-4 text-lg font-semibold text-primary-foreground transition-opacity hover:opacity-90"
          >
            Let it out
          </button>
          <p className="text-xs text-muted-foreground">
            Private and session-only. Nothing is saved.
          </p>
        </div>
      </div>
    </PageShell>
  );
}
