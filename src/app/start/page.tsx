"use client";

import React, { useEffect, useState } from "react";
import { GlowOrb } from "~/components/glow-orb";
import { SignOutButton } from "~/components/sign-out-button";
import { ADMIN_EMAIL } from "~/lib/constants";
import { createClient } from "~/lib/supabase/client";

function BonfireIllustration({ size = "md" }: { size?: "sm" | "md" }) {
  const cls = size === "sm" ? "mx-auto w-28 sm:w-36" : "mx-auto w-44 sm:w-64";
  return (
    <svg
      viewBox="0 0 200 250"
      xmlns="http://www.w3.org/2000/svg"
      className={cls}
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
          @keyframes bf-sway { 0%,100%{transform:scaleX(1) skewX(0deg);opacity:1} 28%{transform:scaleX(0.96) skewX(-2deg);opacity:0.9} 65%{transform:scaleX(1.03) skewX(1.5deg);opacity:0.95} }
          @keyframes bf-sway2 { 0%,100%{transform:scaleX(1) skewX(0deg);opacity:1} 38%{transform:scaleX(1.04) skewX(2deg);opacity:0.88} 72%{transform:scaleX(0.95) skewX(-1.5deg);opacity:0.95} }
          @keyframes bf-flicker { 0%,100%{opacity:0.9;transform:scaleY(1)} 45%{opacity:0.75;transform:scaleY(0.97)} 80%{opacity:0.95;transform:scaleY(1.02)} }
          .bf-a{animation:bf-sway 2.9s ease-in-out infinite;transform-origin:100px 225px}
          .bf-b{animation:bf-sway2 2.2s ease-in-out infinite;transform-origin:100px 225px;animation-delay:-0.4s}
          .bf-c{animation:bf-sway 1.8s ease-in-out infinite reverse;transform-origin:100px 225px;animation-delay:-1s}
          .bf-d{animation:bf-flicker 1.3s ease-in-out infinite;transform-origin:100px 225px;animation-delay:-0.2s}
        `}</style>
      </defs>
      <ellipse cx="100" cy="232" rx="90" ry="20" fill="url(#bf-glow)" />
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
      <g className="bf-a">
        <path
          d="M 38,228 C 22,208 24,178 36,152 C 44,172 46,194 48,212 C 52,185 58,152 64,118 C 70,150 68,184 68,215 C 72,182 78,146 84,112 C 90,146 88,182 88,216 C 92,178 98,140 100,105 C 106,140 106,178 106,218 C 108,180 116,146 122,115 C 128,148 126,182 124,216 C 128,185 136,152 142,125 C 148,155 144,190 142,218 C 147,194 153,170 158,153 C 164,174 160,206 154,228 Z"
          fill="url(#bf-outer)"
          opacity="0.88"
        />
      </g>
      <g className="bf-b">
        <path
          d="M 52,228 C 40,210 40,184 50,162 C 57,180 59,200 61,216 C 65,188 70,158 76,126 C 82,158 80,192 80,218 C 84,186 90,154 95,124 C 100,156 99,190 98,220 C 102,186 108,154 112,126 C 117,158 116,192 114,222 C 118,190 125,158 130,132 C 135,162 132,196 128,224 C 133,202 140,178 144,160 C 148,182 144,212 136,228 Z"
          fill="url(#bf-mid)"
        />
      </g>
      <g className="bf-c">
        <path
          d="M 66,228 C 58,212 57,190 65,170 C 70,188 72,206 74,220 C 78,196 83,168 88,140 C 92,168 91,198 90,222 C 94,196 99,165 103,138 C 107,165 106,198 104,224 C 108,196 113,165 117,140 C 121,168 120,200 116,226 C 121,204 127,184 130,168 C 133,190 129,218 120,228 Z"
          fill="url(#bf-inner)"
        />
      </g>
      <g className="bf-d">
        <path
          d="M 82,228 C 76,214 75,196 82,178 C 86,194 88,210 90,222 C 93,202 97,178 100,155 C 103,178 102,204 102,224 C 105,200 110,175 113,156 C 116,178 114,205 111,226 C 114,210 119,194 122,182 C 124,200 120,220 112,228 Z"
          fill="url(#bf-core)"
          opacity="0.85"
        />
      </g>
    </svg>
  );
}

function EmberIllustration() {
  return (
    <svg
      viewBox="0 0 200 110"
      xmlns="http://www.w3.org/2000/svg"
      className="mx-auto w-40 sm:w-52"
      aria-hidden="true"
    >
      <defs>
        <radialGradient
          id="em-glow"
          cx="100"
          cy="80"
          r="70"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#c2410c" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#c2410c" stopOpacity="0" />
        </radialGradient>
        <style>{`
          @keyframes em-pulse { 0%,100%{opacity:0.5} 50%{opacity:0.9} }
          @keyframes em-pulse2 { 0%,100%{opacity:0.7} 50%{opacity:0.4} }
          @keyframes em-smoke { 0%{transform:translateY(0) scaleX(1);opacity:0.25} 100%{transform:translateY(-28px) scaleX(1.5);opacity:0} }
          .em-g1{animation:em-pulse 2.1s ease-in-out infinite}
          .em-g2{animation:em-pulse2 1.7s ease-in-out infinite;animation-delay:0.5s}
          .em-g3{animation:em-pulse 2.6s ease-in-out infinite;animation-delay:1.1s}
          .em-s1{animation:em-smoke 3s ease-out infinite}
          .em-s2{animation:em-smoke 3.8s ease-out infinite;animation-delay:1.2s}
          .em-s3{animation:em-smoke 2.8s ease-out infinite;animation-delay:2.1s}
        `}</style>
      </defs>
      <ellipse cx="100" cy="82" rx="70" ry="18" fill="url(#em-glow)" />
      <rect
        x="18"
        y="70"
        width="74"
        height="14"
        rx="7"
        fill="#1c0a03"
        transform="rotate(-18 55 77)"
      />
      <rect
        x="108"
        y="70"
        width="74"
        height="14"
        rx="7"
        fill="#2a0f05"
        transform="rotate(18 145 77)"
      />
      <ellipse cx="100" cy="82" rx="42" ry="10" fill="#140401" />
      <ellipse
        cx="82"
        cy="79"
        rx="10"
        ry="4.5"
        fill="#9a3412"
        className="em-g1"
      />
      <ellipse
        cx="112"
        cy="77"
        rx="8"
        ry="3.5"
        fill="#b45309"
        className="em-g2"
      />
      <ellipse cx="97" cy="81" rx="7" ry="3" fill="#c2410c" className="em-g3" />
      <ellipse cx="88" cy="75" rx="4" ry="2" fill="#ea580c" className="em-g2" />
      <ellipse
        cx="106"
        cy="82"
        rx="5"
        ry="2"
        fill="#d97706"
        className="em-g1"
      />
      <circle cx="94" cy="77" r="1.5" fill="#fb923c" className="em-g3" />
      <circle cx="110" cy="80" r="1" fill="#fbbf24" className="em-g1" />
      <circle cx="84" cy="82" r="1" fill="#f97316" className="em-g2" />
      <ellipse
        cx="92"
        cy="68"
        rx="3"
        ry="5"
        fill="#6b7280"
        className="em-s1"
        opacity="0"
      />
      <ellipse
        cx="106"
        cy="65"
        rx="2.5"
        ry="4"
        fill="#6b7280"
        className="em-s2"
        opacity="0"
      />
      <ellipse
        cx="100"
        cy="62"
        rx="2"
        ry="3.5"
        fill="#6b7280"
        className="em-s3"
        opacity="0"
      />
    </svg>
  );
}

const PROGRESS_MESSAGES = [
  "Creating reflection...",
  "Finding helpful perspectives...",
  "Generating next steps...",
];

const FLOATING_THOUGHTS = [
  { text: "what if I fail", left: "8%", delay: "0s", dur: "3.8s" },
  { text: "not ready", left: "62%", delay: "1.1s", dur: "4.2s" },
  { text: "I haven't studied enough", left: "22%", delay: "2.0s", dur: "3.5s" },
  { text: "everyone knows more", left: "55%", delay: "0.5s", dur: "4.5s" },
  { text: "can't think straight", left: "14%", delay: "1.7s", dur: "3.2s" },
  { text: "what if I blank", left: "68%", delay: "2.8s", dur: "4.0s" },
];

function LoadingView() {
  const [msgIndex, setMsgIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(
      () => setMsgIndex((i) => (i + 1) % PROGRESS_MESSAGES.length),
      2500,
    );
    return () => clearInterval(id);
  }, []);

  return (
    <div className="flex w-full max-w-xl flex-col items-center text-center">
      <style>{`
        @keyframes thought-rise {
          0%   { transform: translateY(0px);   opacity: 0; }
          12%  { opacity: 0.65; }
          75%  { opacity: 0.5; }
          100% { transform: translateY(-140px); opacity: 0; }
        }
        @keyframes dot-bounce {
          0%,80%,100% { transform: scale(0.7); opacity: 0.4; }
          40%          { transform: scale(1);   opacity: 1;   }
        }
        @keyframes msg-fade {
          0%   { opacity: 0; transform: translateY(4px); }
          15%  { opacity: 1; transform: translateY(0);   }
          85%  { opacity: 1; transform: translateY(0);   }
          100% { opacity: 0; transform: translateY(-4px);}
        }
        .thought-tag {
          position: absolute;
          bottom: 56px;
          font-style: italic;
          font-size: 0.72rem;
          color: rgba(251,146,60,0.75);
          white-space: nowrap;
          animation: thought-rise linear infinite;
          pointer-events: none;
          text-shadow: 0 0 12px rgba(251,146,60,0.4);
        }
        .dot { animation: dot-bounce 1.4s ease-in-out infinite; }
        .progress-msg { animation: msg-fade 2.5s ease-in-out forwards; }
      `}</style>

      <div className="relative w-full">
        {FLOATING_THOUGHTS.map((t) => (
          <span
            key={t.text}
            className="thought-tag"
            style={{
              left: t.left,
              animationDelay: t.delay,
              animationDuration: t.dur,
            }}
          >
            {t.text}
          </span>
        ))}
        <BonfireIllustration />
      </div>

      <h2 className="font-display mt-4 mb-2 text-2xl font-bold text-foreground">
        Thinking about your thoughts…
      </h2>

      <p
        key={msgIndex}
        className="progress-msg mb-6 h-5 text-sm text-muted-foreground"
      >
        {PROGRESS_MESSAGES[msgIndex]}
      </p>

      <div className="flex gap-2">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="dot h-2 w-2 rounded-full bg-primary"
            style={{ animationDelay: `${i * 0.22}s` }}
          />
        ))}
      </div>
    </div>
  );
}

// ─── Types ───────────────────────────────────────────────────────────────────

const VAGUE_PATTERNS = new Set([
  "help",
  "idk",
  "sad",
  "stress",
  "nothing",
  "bad",
  "ok",
  "okay",
  "stressed",
  "scared",
  "nervous",
  "worried",
  "anxious",
  "panic",
  "dont know",
  "don't know",
  "no idea",
  "not sure",
  "lost",
  "tired",
  "ugh",
  "i don't know",
  "i dont know",
  "confused",
  "overwhelmed",
  "help me",
  "i'm scared",
  "im scared",
  "i'm nervous",
  "im nervous",
]);

function isVague(text: string): boolean {
  const t = text
    .trim()
    .toLowerCase()
    .replace(/[.!?,\s]+$/, "");
  if (t.length < 12) return true;
  if (VAGUE_PATTERNS.has(t)) return true;
  return t.split(/\s+/).filter(Boolean).length <= 2;
}

const FALLBACK_MICROSTEPS = {
  fact: "You're here, still trying, and that matters.",
  fear: "It feels like everything is on the line tonight, but that's the anxiety talking.",
  contextTag: "general",
  channelIntoWork:
    "Review one familiar topic for just 5 minutes. Pick something you already know a bit.",
  burnItOff:
    "Stand up and walk around for 3 minutes to shake the tension out of your body.",
  resetToZero:
    "Pour a glass of water, sit quietly, and take three slow full breaths.",
};

type Microsteps = {
  fact: string;
  fear: string;
  contextTag: string;
  channelIntoWork: string;
  burnItOff: string;
  resetToZero: string;
};
type MicrostepKey = "channelIntoWork" | "burnItOff" | "resetToZero";

type SavedPlan = {
  id: string;
  title: string;
  chosen_key: string;
  chosen_step: string;
  steps: string[];
  created_at: string;
};

const SIDEBAR_WIDTH = "280px";
const SIDEBAR_TRANSITION = "0.28s cubic-bezier(0.4, 0, 0.2, 1)";

const CARDS: { key: MicrostepKey; label: string; icon: string }[] = [
  { key: "channelIntoWork", label: "Channel into Work", icon: "📚" },
  { key: "burnItOff", label: "Burn it Off", icon: "🚶" },
  { key: "resetToZero", label: "Reset to Zero", icon: "🌬️" },
];

const CARD_LABEL = Object.fromEntries(CARDS.map((c) => [c.key, c.label]));

const ANON_STORAGE_KEY = "thoughtrelief_anon_usage";

// ─── Saved Actions Sidebar ───────────────────────────────────────────────────

function SavedActionsPanel({
  plans,
  loading,
}: {
  plans: SavedPlan[];
  loading: boolean;
}) {
  return (
    <div className="flex h-full flex-col">
      <div className="shrink-0 border-b border-border px-5 py-4">
        <h2 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
          Saved actions
        </h2>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4">
        {loading ? (
          <p className="py-10 text-center text-sm text-muted-foreground">
            Loading...
          </p>
        ) : plans.length === 0 ? (
          <p className="py-10 text-center text-sm leading-relaxed text-muted-foreground">
            No saved actions yet. Complete a reflection and save one to see it
            here.
          </p>
        ) : (
          <div className="space-y-2">
            {plans.map((plan) => (
              <a
                key={plan.id}
                href={`/saved-plan/${plan.id}`}
                className="flex items-start justify-between gap-3 rounded-xl border border-border bg-card px-4 py-3 transition-colors hover:border-primary/40 hover:bg-accent"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-foreground">
                    {plan.title}
                  </p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {CARD_LABEL[plan.chosen_key] ?? plan.chosen_key}
                  </p>
                </div>
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 14 14"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  className="mt-1 shrink-0 text-muted-foreground"
                  aria-hidden="true"
                >
                  <polyline points="5 2 10 7 5 12" />
                </svg>
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Page Shell ───────────────────────────────────────────────────────────────

function PageShell({
  children,
  signedIn,
  isAdmin,
  sidebar,
  sidebarOpen,
  onToggleSidebar,
}: {
  children: React.ReactNode;
  signedIn: boolean;
  isAdmin: boolean;
  sidebar?: React.ReactNode;
  sidebarOpen?: boolean;
  onToggleSidebar?: () => void;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <GlowOrb className="-z-10 fixed inset-x-0 top-0 h-[640px] w-full rounded-none opacity-[0.22] blur-3xl" />
      <header className="border-b border-border py-5">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6">
          <a
            href="/"
            className="font-display text-lg font-bold text-foreground transition-opacity hover:opacity-70"
          >
            ThoughtRelief
          </a>
          <div className="flex items-center gap-2">
            {signedIn ? (
              <>
                {isAdmin && (
                  <a
                    href="/admin"
                    className="rounded-lg px-4 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                  >
                    Admin
                  </a>
                )}
                <SignOutButton />
              </>
            ) : (
              <>
                <a
                  href="/auth/login"
                  className="rounded-lg px-4 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                >
                  Sign in
                </a>
                <a
                  href="/auth/signup"
                  className="rounded-lg bg-primary px-4 py-1.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
                >
                  Sign up
                </a>
              </>
            )}
          </div>
        </div>
      </header>
      <div className="flex flex-1 overflow-hidden">
        {sidebar && (
          <aside
            className="hidden shrink-0 border-r border-border xl:flex xl:flex-col"
            style={{
              width: sidebarOpen ? SIDEBAR_WIDTH : "0px",
              overflow: "hidden",
              transition: `width ${SIDEBAR_TRANSITION}`,
            }}
          >
            <div style={{ width: SIDEBAR_WIDTH, minWidth: SIDEBAR_WIDTH }}>
              {sidebar}
            </div>
          </aside>
        )}
        <main className="flex flex-1 flex-col items-center justify-center px-6 py-12">
          {children}
        </main>
      </div>
      {sidebar && onToggleSidebar && (
        <button
          type="button"
          onClick={onToggleSidebar}
          aria-label={sidebarOpen ? "Close sidebar" : "Open sidebar"}
          className="fixed top-1/2 z-50 hidden -translate-y-1/2 items-center justify-center rounded-r-lg border border-l-0 border-border bg-background p-1.5 text-muted-foreground shadow-sm transition-colors hover:bg-accent hover:text-foreground xl:flex"
          style={{
            left: sidebarOpen ? SIDEBAR_WIDTH : "0px",
            transition: `left ${SIDEBAR_TRANSITION}`,
          }}
        >
          {sidebarOpen ? (
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              aria-hidden="true"
            >
              <polyline points="10 4 6 8 10 12" />
            </svg>
          ) : (
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              aria-hidden="true"
            >
              <polyline points="6 4 10 8 6 12" />
            </svg>
          )}
        </button>
      )}
      <footer className="border-t border-border py-5 text-center">
        <p className="text-xs uppercase tracking-widest text-muted-foreground">
          Thought Relief is not a therapy or crisis service. If you&apos;re in
          crisis, text or call 988.
        </p>
      </footer>
    </div>
  );
}

// ─── View Components ──────────────────────────────────────────────────────────

function MicrostepResults({
  microsteps,
  onSelect,
  isFallback,
}: {
  microsteps: Microsteps;
  onSelect: (key: MicrostepKey) => void;
  isFallback: boolean;
}) {
  return (
    <div className="w-full max-w-2xl">
      <div className="mb-6 text-center">
        <BonfireIllustration />
        <h2 className="font-display mt-4 mb-1 text-2xl font-bold text-foreground">
          {isFallback
            ? "Here's something you can still do right now."
            : "Good. You let it out."}
        </h2>
        <p className="text-sm text-muted-foreground">
          {isFallback
            ? "I couldn't personalize suggestions this time, so here are a few simple options."
            : "Pick one thing to do right now. Just one."}
        </p>
      </div>

      {!isFallback && (
        <div className="mb-6 grid gap-3 sm:grid-cols-2">
          <div className="glass-card px-5 py-4">
            <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              What&apos;s actually true
            </p>
            <p className="text-sm leading-relaxed text-foreground">
              {microsteps.fact}
            </p>
          </div>
          <div className="glass-card px-5 py-4">
            <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              What fear looks like
            </p>
            <p className="text-sm leading-relaxed text-foreground">
              {microsteps.fear}
            </p>
          </div>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-3">
        {CARDS.map(({ key, label, icon }) => (
          <button
            key={key}
            type="button"
            onClick={() => onSelect(key)}
            className="group glass-card flex flex-col p-5 text-left shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08)] transition-all hover:-translate-y-1 hover:border-primary hover:shadow-xl hover:shadow-primary/25 active:scale-[0.98]"
          >
            <div className="mb-3 flex items-center gap-2">
              <span className="text-xl">{icon}</span>
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground group-hover:text-foreground">
                {label}
              </span>
            </div>
            <p className="text-sm leading-relaxed text-foreground">
              {microsteps[key]}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
}

function PlanView({
  chosenKey,
  chosenStep,
  actionPlan,
  actionPlanLoading,
  actionPlanIsFallback,
  actionPlanResourceUrl,
  onAdvance,
}: {
  chosenKey: MicrostepKey;
  chosenStep: string;
  actionPlan: string[] | null;
  actionPlanLoading: boolean;
  actionPlanIsFallback: boolean;
  actionPlanResourceUrl: string | null;
  onAdvance: () => void;
}) {
  const card = CARDS.find((c) => c.key === chosenKey) ?? CARDS[0];
  return (
    <div className="flex w-full max-w-lg flex-col items-center text-center">
      <BonfireIllustration size="sm" />

      <h2 className="font-display mt-4 mb-1 text-2xl font-bold text-foreground">
        Here&apos;s your plan.
      </h2>
      <p className="mb-6 text-sm text-muted-foreground">
        {actionPlanIsFallback && !actionPlanLoading
          ? "I couldn't personalize this one, so here are standard steps."
          : "Small steps. Right now."}
      </p>

      <div className="glass-card mb-5 w-full px-6 py-4 text-left">
        <div className="mb-2 flex items-center gap-2">
          <span className="text-lg">{card.icon}</span>
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {card.label}
          </span>
        </div>
        <p className="text-sm leading-relaxed text-foreground">{chosenStep}</p>
      </div>

      {actionPlanLoading && (
        <div className="mb-5 flex w-full items-center justify-center gap-2 rounded-2xl border border-border bg-card px-6 py-6">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="dot h-2 w-2 rounded-full bg-primary"
              style={{ animationDelay: `${i * 0.22}s` }}
            />
          ))}
        </div>
      )}

      {!actionPlanLoading && actionPlan && (
        <div className="mb-5 w-full rounded-2xl border border-border bg-card px-6 py-5 text-left">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Steps
          </p>
          <ol className="space-y-3">
            {actionPlan.map((step, i) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: steps are ordered and stable, no reordering occurs
              <li key={i} className="flex gap-3">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                  {i + 1}
                </span>
                <p className="text-sm leading-relaxed text-foreground">
                  {step}
                </p>
              </li>
            ))}
          </ol>
          {actionPlanResourceUrl && (
            <a
              href={actionPlanResourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-block text-xs font-medium text-primary underline-offset-2 hover:underline"
            >
              Watch / read more →
            </a>
          )}
        </div>
      )}

      <button
        type="button"
        onClick={onAdvance}
        className="rounded-full bg-primary px-14 py-4 text-base font-semibold uppercase tracking-widest text-primary-foreground transition-all hover:opacity-90 hover:shadow-lg hover:shadow-primary/30 active:scale-[0.98]"
      >
        Done
      </button>
    </div>
  );
}

function DoneView({
  onReset,
  signedIn,
  onRegenerate,
  regenerateCount,
  actionPlan,
  chosenKey,
  chosenStep,
  onSave,
}: {
  onReset: () => void;
  signedIn: boolean;
  onRegenerate: () => void;
  regenerateCount: number;
  actionPlan: string[] | null;
  chosenKey: MicrostepKey | null;
  chosenStep: string | null;
  onSave: () => Promise<void>;
}) {
  const [feedback, setFeedback] = useState<"yes" | "no" | null>(null);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  const canSave = !!(actionPlan?.length && chosenKey && chosenStep);

  async function handleSave() {
    if (saving || saved) return;
    setSaving(true);
    await onSave();
    setSaving(false);
    setSaved(true);
  }

  function handleNo() {
    if (regenerateCount >= 10) {
      setFeedback("no");
      return;
    }
    onRegenerate();
  }

  return (
    <div className="flex w-full max-w-lg flex-col items-center text-center">
      <EmberIllustration />

      <h2 className="font-display mt-6 mb-2 text-3xl font-bold text-foreground sm:text-4xl">
        Nice work.
      </h2>
      <p className="mb-8 text-muted-foreground">
        One small step chosen. That&apos;s enough.
      </p>

      {signedIn ? (
        <>
          {/* Feedback + optional save */}
          <div className="glass-card mb-8 w-full px-6 py-5">
            {feedback === null && (
              <>
                <p className="mb-4 text-sm font-medium text-foreground">
                  Did this help?
                </p>
                <div className="flex justify-center gap-3">
                  <button
                    type="button"
                    onClick={() => setFeedback("yes")}
                    className="rounded-full border border-border bg-background px-6 py-2.5 text-sm font-medium text-foreground transition-colors hover:border-primary hover:text-primary"
                  >
                    👍 Yes
                  </button>
                  <button
                    type="button"
                    onClick={handleNo}
                    className="rounded-full border border-border bg-background px-6 py-2.5 text-sm font-medium text-foreground transition-colors hover:border-primary hover:text-primary"
                  >
                    👎 Not really
                  </button>
                </div>
              </>
            )}

            {feedback === "yes" && (
              <div className="flex flex-col items-center gap-3">
                <p className="font-display text-lg font-bold text-foreground">
                  Glad it helped.
                </p>
                {canSave && !saved && (
                  <button
                    type="button"
                    onClick={handleSave}
                    disabled={saving}
                    className="mt-1 rounded-full border border-border bg-background px-6 py-2.5 text-sm font-medium text-foreground transition-colors hover:border-primary hover:text-primary disabled:opacity-60"
                  >
                    {saving ? "Saving..." : "Save this plan"}
                  </button>
                )}
                {saved && (
                  <p className="text-sm text-muted-foreground">
                    Saved to your Saved actions.
                  </p>
                )}
                <button
                  type="button"
                  onClick={onReset}
                  className="mt-2 rounded-full bg-primary px-14 py-4 text-base font-semibold uppercase tracking-widest text-primary-foreground transition-all hover:opacity-90 hover:shadow-lg hover:shadow-primary/30 active:scale-[0.98]"
                >
                  Start Over
                </button>
              </div>
            )}

            {feedback === "no" && regenerateCount >= 10 && (
              <div className="flex flex-col items-center gap-3">
                <p className="text-sm text-muted-foreground">
                  You&apos;ve reached the regeneration limit for this session.
                </p>
                <button
                  type="button"
                  onClick={onReset}
                  className="rounded-full bg-primary px-14 py-4 text-base font-semibold uppercase tracking-widest text-primary-foreground transition-all hover:opacity-90 hover:shadow-lg hover:shadow-primary/30 active:scale-[0.98]"
                >
                  Start Over
                </button>
              </div>
            )}
          </div>
        </>
      ) : (
        /* Unauthenticated: no feedback, just sign up + home */
        <div className="flex w-full flex-col items-center gap-3">
          <a
            href="/auth/signup"
            className="inline-block w-full max-w-xs rounded-full bg-primary px-14 py-4 text-base font-semibold uppercase tracking-widest text-primary-foreground transition-all hover:opacity-90 hover:shadow-lg hover:shadow-primary/30 active:scale-[0.98]"
          >
            Sign Up Free
          </a>
          <a
            href="/"
            className="inline-block rounded-full border border-border bg-background px-14 py-4 text-base font-semibold uppercase tracking-widest text-foreground transition-colors hover:border-primary hover:text-primary"
          >
            Return Home
          </a>
        </div>
      )}
    </div>
  );
}

function CrisisView({
  onReset,
  signedIn,
}: {
  onReset: () => void;
  signedIn: boolean;
}) {
  return (
    <div className="w-full max-w-lg text-center">
      <div className="mb-6 rounded-2xl border border-border bg-card px-8 py-8">
        <p className="mb-4 text-2xl">💛</p>
        <h2 className="font-display mb-3 text-xl font-bold text-foreground">
          We hear you. What you&apos;re feeling is real.
        </h2>
        <p className="mb-7 text-sm leading-relaxed text-muted-foreground">
          This app isn&apos;t the right place for what you&apos;re carrying
          right now, but trained people are, and they want to help.
        </p>
        <div className="mb-6 space-y-2 text-left">
          <div className="rounded-xl border border-border px-5 py-4">
            <p className="text-sm font-semibold text-foreground">
              Talk to your school counselor
            </p>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
              They&apos;re there exactly for moments like this. Reach out first
              thing tomorrow, or ask a trusted teacher to connect you today.
            </p>
          </div>
          <div className="rounded-xl border border-border px-5 py-4">
            <p className="text-sm font-semibold text-foreground">
              Call or text <span className="text-primary">988</span>
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Suicide &amp; Crisis Lifeline: free, confidential, 24/7
            </p>
          </div>
          <div className="rounded-xl border border-border px-5 py-4">
            <p className="text-sm font-semibold text-foreground">
              Text HOME to <span className="text-primary">741741</span>
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Crisis Text Line: free, confidential, 24/7
            </p>
          </div>
        </div>
        <p className="text-xs text-muted-foreground">
          You don&apos;t have to carry this alone.
        </p>
      </div>

      {!signedIn && (
        <div className="mb-4 rounded-2xl border border-border bg-card px-6 py-5">
          <p className="mb-1 text-sm font-semibold text-foreground">
            Want to come back to this?
          </p>
          <p className="mb-4 text-xs text-muted-foreground">
            Create a free account to access ThoughtRelief anytime.
          </p>
          <a
            href="/auth/signup"
            className="inline-block rounded-full bg-primary px-8 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
          >
            Sign up free
          </a>
        </div>
      )}

      <button
        type="button"
        onClick={onReset}
        className="mt-2 text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
      >
        Go back
      </button>
    </div>
  );
}

function LimitView({
  signedIn,
  onBack,
}: {
  signedIn: boolean;
  onBack: () => void;
}) {
  return (
    <div className="flex w-full max-w-md flex-col items-center text-center">
      <div className="w-full rounded-2xl border border-border bg-card px-8 py-10">
        <p className="mb-4 text-3xl">🌙</p>
        {signedIn ? (
          <>
            <h2 className="font-display mb-3 text-xl font-bold text-foreground">
              You&apos;ve used all 10 reflections this week.
            </h2>
            <p className="mb-8 text-sm leading-relaxed text-muted-foreground">
              Your reflections reset every Monday. Come back then for a fresh
              week.
            </p>
          </>
        ) : (
          <>
            <h2 className="font-display mb-3 text-xl font-bold text-foreground">
              You&apos;ve used your free reflection for today.
            </h2>
            <p className="mb-8 text-sm leading-relaxed text-muted-foreground">
              Sign in to get 10 reflections every week, or come back tomorrow
              for another free one.
            </p>
          </>
        )}
        <div className="flex flex-col gap-3">
          {!signedIn && (
            <a
              href="/auth/login"
              className="rounded-full bg-primary px-10 py-3.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
            >
              Sign in
            </a>
          )}
          <button
            type="button"
            onClick={onBack}
            className="text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
          >
            Return to Reflection
          </button>
        </div>
      </div>
    </div>
  );
}

function BusyView({
  onRetry,
  onBack,
}: {
  onRetry: () => void;
  onBack: () => void;
}) {
  return (
    <div className="flex w-full max-w-md flex-col items-center text-center">
      <div className="w-full rounded-2xl border border-border bg-card px-8 py-10">
        <p className="mb-4 text-3xl">🕯️</p>
        <h2 className="font-display mb-3 text-xl font-bold text-foreground">
          ThoughtRelief is temporarily busy.
        </h2>
        <p className="mb-8 text-sm leading-relaxed text-muted-foreground">
          We&apos;re having trouble generating your reflection right now. Please
          try again in a minute.
        </p>
        <div className="flex flex-col gap-3">
          <button
            type="button"
            onClick={onRetry}
            className="rounded-full bg-primary px-10 py-3.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
          >
            Retry
          </button>
          <button
            type="button"
            onClick={onBack}
            className="text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
          >
            Return to Reflection
          </button>
        </div>
      </div>
    </div>
  );
}

function VagueView({ onBack }: { onBack: () => void }) {
  return (
    <div className="flex w-full max-w-md flex-col items-center text-center">
      <div className="w-full rounded-2xl border border-border bg-card px-8 py-10">
        <h2 className="font-display mb-3 text-xl font-bold text-foreground">
          I&apos;d like to understand a little more.
        </h2>
        <p className="mb-6 text-sm leading-relaxed text-muted-foreground">
          I&apos;m not fully sure what you&apos;re struggling with yet.
        </p>
        <div className="mb-8 space-y-2 text-left">
          {[
            "What test are you worried about?",
            "What thought keeps repeating?",
            "What feels most overwhelming right now?",
          ].map((prompt) => (
            <div
              key={prompt}
              className="rounded-xl border border-border px-4 py-3"
            >
              <p className="text-sm italic text-muted-foreground">{prompt}</p>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={onBack}
          className="rounded-full bg-primary px-10 py-3.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
        >
          Continue Writing
        </button>
      </div>
    </div>
  );
}

function SafetyView({
  onBack,
  onGetSupport,
}: {
  onBack: () => void;
  onGetSupport: () => void;
}) {
  return (
    <div className="flex w-full max-w-md flex-col items-center text-center">
      <div className="w-full rounded-2xl border border-border bg-card px-8 py-10">
        <h2 className="font-display mb-3 text-xl font-bold text-foreground">
          I can&apos;t help with that request.
        </h2>
        <p className="mb-8 text-sm leading-relaxed text-muted-foreground">
          I can help you think through what&apos;s going on, explore safer
          alternatives, or help you find support.
        </p>
        <div className="flex flex-col gap-3">
          <button
            type="button"
            onClick={onBack}
            className="rounded-full bg-primary px-10 py-3.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
          >
            Return to Reflection
          </button>
          <button
            type="button"
            onClick={onGetSupport}
            className="text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
          >
            Get Support
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

type Phase =
  | "input"
  | "loading"
  | "results"
  | "action-loading"
  | "plan"
  | "crisis"
  | "done"
  | "busy"
  | "vague"
  | "safety"
  | "limit";
type UserPrefs = { supportStyle: string; responseTone: string } | null;

export default function StartPage() {
  const [text, setText] = useState("");
  const [phase, setPhase] = useState<Phase>("input");
  const [microsteps, setMicrosteps] = useState<Microsteps | null>(null);
  const [chosenKey, setChosenKey] = useState<MicrostepKey | null>(null);
  const [isFallback, setIsFallback] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [userPrefs, setUserPrefs] = useState<UserPrefs>(null);
  const [userLoaded, setUserLoaded] = useState(false);
  const [serverLimitHit, setServerLimitHit] = useState(false);
  const [actionPlan, setActionPlan] = useState<string[] | null>(null);
  const [actionPlanTitle, setActionPlanTitle] = useState<string | null>(null);
  const [actionPlanIsFallback, setActionPlanIsFallback] = useState(false);
  const [actionPlanLoading, setActionPlanLoading] = useState(false);
  const [actionPlanResourceUrl, setActionPlanResourceUrl] = useState<
    string | null
  >(null);
  const [regenerateCount, setRegenerateCount] = useState(0);
  const [savedPlans, setSavedPlans] = useState<SavedPlan[]>([]);
  const [savedPlansLoading, setSavedPlansLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const supabaseRef = React.useRef(createClient());

  useEffect(() => {
    const supabase = supabaseRef.current;
    supabase.auth.getUser().then(async ({ data }) => {
      const email = data.user?.email ?? null;
      const uid = data.user?.id ?? null;
      setUserEmail(email);
      setUserId(uid);
      if (data.user) {
        setSavedPlansLoading(true);
        const [prefsResult, plansResult] = await Promise.all([
          supabase
            .from("user_preferences")
            .select("support_style, response_tone")
            .eq("user_id", data.user.id)
            .single(),
          supabase
            .from("saved_plans")
            .select("id, title, chosen_key, chosen_step, steps, created_at")
            .order("created_at", { ascending: false }),
        ]);
        if (prefsResult.data) {
          setUserPrefs({
            supportStyle: prefsResult.data.support_style,
            responseTone: prefsResult.data.response_tone,
          });
        }
        setSavedPlans((plansResult.data as SavedPlan[]) ?? []);
        setSavedPlansLoading(false);
      }
      setUserLoaded(true);
    });
  }, []);

  async function handleSubmit() {
    if (!text.trim()) return;

    if (isVague(text)) {
      setPhase("vague");
      return;
    }

    if (userLoaded && !signedIn) {
      const today = new Date().toISOString().slice(0, 10);
      const stored = JSON.parse(localStorage.getItem(ANON_STORAGE_KEY) ?? "{}");
      const count = stored.date === today ? (stored.count ?? 0) : 0;
      if (count >= 1) {
        setPhase("limit");
        return;
      }
    }

    setPhase("loading");
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, ...(userPrefs ?? {}) }),
      });

      if (res.status === 429) {
        const data = await res.json();
        if (data.error === "limit") {
          setServerLimitHit(true);
          setPhase("limit");
        } else {
          // AI provider is rate-limited — fall back to generalized
          // suggestions instead of blocking the student with a busy screen.
          setMicrosteps(FALLBACK_MICROSTEPS);
          setIsFallback(true);
          setPhase("results");
        }
        return;
      }

      if (res.status === 503 || res.status === 500) {
        setPhase("busy");
        return;
      }

      const data = await res.json();

      if (data.crisis) {
        setPhase("crisis");
      } else if (data.error === "safety") {
        setPhase("safety");
      } else if (data.fallback) {
        setMicrosteps(FALLBACK_MICROSTEPS);
        setIsFallback(true);
        setPhase("results");
      } else if (data.microsteps) {
        setMicrosteps(data.microsteps);
        setIsFallback(false);
        if (!signedIn) {
          const today = new Date().toISOString().slice(0, 10);
          const stored = JSON.parse(
            localStorage.getItem(ANON_STORAGE_KEY) ?? "{}",
          );
          const count = stored.date === today ? (stored.count ?? 0) : 0;
          localStorage.setItem(
            ANON_STORAGE_KEY,
            JSON.stringify({ date: today, count: count + 1 }),
          );
        }
        setPhase("results");
      } else {
        setPhase("busy");
      }
    } catch {
      setPhase("busy");
    }
  }

  const FALLBACK_STEPS: Record<MicrostepKey, string[]> = {
    channelIntoWork: [
      "Open your notes to one specific topic you're worried about.",
      "Write down what you already know about it from memory.",
      "Check your notes for anything you missed and circle it.",
      "Read that circled part once slowly out loud.",
      "Close your notes and repeat it back to yourself in one sentence.",
    ],
    burnItOff: [
      "Stand up from where you are right now.",
      "Shake out your hands and roll your shoulders back.",
      "Walk to another room or step outside for 2 minutes.",
      "Take three slow, deep breaths while you walk.",
      "Return to your space and sit back down.",
    ],
    resetToZero: [
      "Put down whatever is in your hands and sit up straight.",
      "Close your eyes and breathe in slowly for 4 counts.",
      "Hold for 2 counts, then breathe out for 6 counts.",
      "Repeat that breath cycle two more times.",
      "Open your eyes and notice one thing around you that is calm.",
    ],
  };

  // Both the step-by-step plan and its save-ready title come back from the
  // SAME /api/action-plan model call — no separate title request.
  function fallbackTitle(key: MicrostepKey, ms: Microsteps): string {
    const first = ms[key].split(/[.!?]/)[0].trim();
    return first.length > 20 ? `${first.slice(0, 17)}...` : first;
  }

  async function fetchActionPlan(
    key: MicrostepKey,
    ms: Microsteps,
  ): Promise<{
    steps: string[];
    title: string;
    isFallback: boolean;
    resourceUrl: string | null;
  }> {
    try {
      const res = await fetch("/api/action-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chosenKey: key,
          microstep: ms[key],
          originalText: text,
          contextTag: ms.contextTag,
          ...(userPrefs ?? {}),
        }),
      });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.steps) && data.steps.length >= 3) {
          const title =
            typeof data.title === "string" && data.title.trim()
              ? data.title.trim()
              : fallbackTitle(key, ms);
          const resourceUrl =
            typeof data.resourceUrl === "string" ? data.resourceUrl : null;
          return {
            steps: data.steps as string[],
            title,
            isFallback: false,
            resourceUrl,
          };
        }
      }
    } catch {
      // non-fatal — fall through to fallback
    }
    return {
      steps: FALLBACK_STEPS[key],
      title: fallbackTitle(key, ms),
      isFallback: true,
      resourceUrl: null,
    };
  }

  async function handleSelect(key: MicrostepKey) {
    if (!microsteps) return;
    setChosenKey(key);
    setActionPlan(null);
    setActionPlanTitle(null);
    setActionPlanIsFallback(false);
    setActionPlanResourceUrl(null);
    setPhase("action-loading");
    const {
      steps,
      title,
      isFallback: fallback,
      resourceUrl,
    } = await fetchActionPlan(key, microsteps);
    setActionPlan(steps);
    setActionPlanTitle(title);
    setActionPlanIsFallback(fallback);
    setActionPlanResourceUrl(resourceUrl);
    setPhase("plan");
  }

  async function handleRegenerate() {
    if (regenerateCount >= 10 || !chosenKey || !microsteps) return;
    setRegenerateCount((c) => c + 1);
    setActionPlanLoading(true);
    setPhase("plan");
    const {
      steps,
      title,
      isFallback: fallback,
      resourceUrl,
    } = await fetchActionPlan(chosenKey, microsteps);
    setActionPlan(steps);
    setActionPlanTitle(title);
    setActionPlanIsFallback(fallback);
    setActionPlanResourceUrl(resourceUrl);
    setActionPlanLoading(false);
  }

  async function handleSavePlan() {
    if (!chosenKey || !microsteps || !actionPlan || !userId) return;
    const supabase = supabaseRef.current;
    const chosenStep = microsteps[chosenKey];
    const title = actionPlanTitle ?? fallbackTitle(chosenKey, microsteps);
    const { data: inserted } = await supabase
      .from("saved_plans")
      .insert({
        user_id: userId,
        title,
        chosen_key: chosenKey,
        chosen_step: chosenStep,
        steps: actionPlan,
      })
      .select("id, title, chosen_key, chosen_step, steps, created_at")
      .single();
    if (inserted) {
      setSavedPlans((prev) => [inserted as SavedPlan, ...prev]);
    }
  }

  function goBack() {
    setServerLimitHit(false);
    setPhase("input");
  }

  function reset() {
    setText("");
    setMicrosteps(null);
    setChosenKey(null);
    setIsFallback(false);
    setServerLimitHit(false);
    setActionPlan(null);
    setActionPlanTitle(null);
    setActionPlanIsFallback(false);
    setActionPlanLoading(false);
    setActionPlanResourceUrl(null);
    setRegenerateCount(0);
    setPhase("input");
  }

  const signedIn = userEmail !== null;
  const isAdmin = userEmail === ADMIN_EMAIL;

  const savedActionsSidebar = signedIn ? (
    <SavedActionsPanel plans={savedPlans} loading={savedPlansLoading} />
  ) : undefined;

  function wrap(content: React.ReactNode) {
    return (
      <PageShell
        signedIn={signedIn}
        isAdmin={isAdmin}
        sidebar={savedActionsSidebar}
        sidebarOpen={sidebarOpen}
        onToggleSidebar={() => setSidebarOpen((o) => !o)}
      >
        <div
          key={phase}
          className="flex w-full flex-col items-center animate-fade-rise"
        >
          {content}
        </div>
      </PageShell>
    );
  }

  if (phase === "loading" || phase === "action-loading") {
    return wrap(<LoadingView />);
  }

  if (phase === "limit") {
    return wrap(
      <LimitView signedIn={signedIn || serverLimitHit} onBack={goBack} />,
    );
  }

  if (phase === "busy") {
    return wrap(<BusyView onRetry={handleSubmit} onBack={goBack} />);
  }

  if (phase === "vague") {
    return wrap(<VagueView onBack={goBack} />);
  }

  if (phase === "safety") {
    return wrap(
      <SafetyView onBack={goBack} onGetSupport={() => setPhase("crisis")} />,
    );
  }

  if (phase === "results" && microsteps) {
    return wrap(
      <MicrostepResults
        microsteps={microsteps}
        onSelect={handleSelect}
        isFallback={isFallback}
      />,
    );
  }

  if (phase === "plan" && microsteps && chosenKey) {
    return wrap(
      <PlanView
        chosenKey={chosenKey}
        chosenStep={microsteps[chosenKey]}
        actionPlan={actionPlan}
        actionPlanLoading={actionPlanLoading}
        actionPlanIsFallback={actionPlanIsFallback}
        actionPlanResourceUrl={actionPlanResourceUrl}
        onAdvance={() => setPhase("done")}
      />,
    );
  }

  if (phase === "done") {
    return wrap(
      <DoneView
        onReset={reset}
        signedIn={signedIn}
        onRegenerate={handleRegenerate}
        regenerateCount={regenerateCount}
        actionPlan={actionPlan}
        chosenKey={chosenKey}
        chosenStep={chosenKey && microsteps ? microsteps[chosenKey] : null}
        onSave={handleSavePlan}
      />,
    );
  }

  if (phase === "crisis") {
    return wrap(<CrisisView onReset={reset} signedIn={signedIn} />);
  }

  return wrap(
    <>
      <div className="relative mx-auto mb-6 w-fit">
        <GlowOrb className="left-1/2 top-1/2 h-16 w-16 -translate-x-1/2 -translate-y-1/2 animate-ember-breathe" />
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
          className="relative w-10 text-primary sm:w-12"
        >
          <path d="M8.5 14.5A2.5 2.5 0 0011 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 11-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 002.5 2.5z" />
        </svg>
      </div>

      <div className="w-full max-w-2xl text-center">
        <h1 className="font-display mb-3 text-4xl font-bold text-foreground md:text-5xl">
          What&apos;s on your mind tonight?
        </h1>
        <p className="mb-8 text-muted-foreground">
          No need to organize it. Just let it out, and we&apos;ll help you make
          sense of it.
        </p>

        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={
            "I'm freaking out about tomorrow's chem test...\nJust type. There's no wrong way to start."
          }
          maxLength={1000}
          rows={8}
          className="glass-card mb-6 w-full resize-none px-6 py-5 text-left text-base text-foreground placeholder:italic placeholder:text-muted-foreground/60 focus:border-primary focus:outline-none focus-visible:ring-1 focus-visible:ring-primary/40"
        />
        {text.length >= 1000 && (
          <p className="-mt-4 mb-4 text-right text-xs text-muted-foreground">
            You&apos;ve reached the character limit.
          </p>
        )}

        <div className="flex flex-col items-center gap-3">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!text.trim()}
            className="rounded-full bg-primary px-16 py-4 text-lg font-semibold text-primary-foreground transition-all hover:opacity-90 hover:shadow-lg hover:shadow-primary/30 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:shadow-none"
          >
            Let it out
          </button>
          <p className="text-xs text-muted-foreground">
            Private and session-only. Nothing is saved.
          </p>
        </div>
      </div>
    </>,
  );
}
