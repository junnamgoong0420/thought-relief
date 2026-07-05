"use client";

import { useEffect } from "react";
import { GlowOrb } from "~/components/glow-orb";
import { cn } from "~/lib/utils";

function useScrollReveal() {
  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = `
      [data-reveal] {
        opacity: 0;
        transform: translateY(32px) scale(0.96);
        transition: opacity 0.5s ease,
                    transform 0.65s cubic-bezier(0.34, 1.56, 0.64, 1);
      }
      [data-reveal].revealed {
        opacity: 1;
        transform: translateY(0) scale(1);
      }
    `;
    document.head.appendChild(style);

    const els = document.querySelectorAll("[data-reveal]");
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const el = entry.target as HTMLElement;
            const delay = el.dataset.delay ?? "0";
            setTimeout(() => {
              el.classList.add("revealed");
            }, Number(delay));
            observer.unobserve(el);
          }
        }
      },
      { threshold: 0.1 },
    );

    for (const el of els) observer.observe(el);
    return () => {
      observer.disconnect();
      style.remove();
    };
  }, []);
}

function VentIcon() {
  return (
    <svg
      width="40"
      height="40"
      viewBox="0 0 40 40"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path
        d="M7 8h22a3 3 0 013 3v12a3 3 0 01-3 3h-9l-5 5v-5H7a3 3 0 01-3-3V11a3 3 0 013-3z"
        strokeWidth="1.5"
        fill="currentColor"
        fillOpacity="0.08"
      />
      <path d="M11 16 Q13 14 15 16 Q17 18 19 16" strokeWidth="1.75" />
      <path
        d="M11 22 Q14 20 17 22 Q20 20 23 22 Q26 20 27 22"
        strokeWidth="1.75"
      />
    </svg>
  );
}

function SplitIcon() {
  return (
    <svg
      width="40"
      height="40"
      viewBox="0 0 40 40"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <line
        x1="20"
        y1="8"
        x2="20"
        y2="32"
        strokeWidth="1.5"
        strokeDasharray="2 2.5"
        strokeOpacity="0.5"
      />
      {/* Left — facts: clean bars */}
      <line x1="7" y1="13" x2="16" y2="13" strokeWidth="2" />
      <line x1="7" y1="19" x2="14" y2="19" strokeWidth="2" />
      <line x1="7" y1="25" x2="16" y2="25" strokeWidth="2" />
      {/* Right — fear: wavy */}
      <path d="M23 13 Q25 11 27 13 Q29 15 31 13" strokeWidth="1.75" />
      <path d="M23 19 Q25.5 17 28 19 Q30.5 21 32 19" strokeWidth="1.75" />
      <path d="M24 25 Q26 23 28 25 Q30 27 31 25" strokeWidth="1.75" />
    </svg>
  );
}

function ActionIcon() {
  return (
    <svg
      width="40"
      height="40"
      viewBox="0 0 40 40"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path
        d="M8 33 Q11 25 18 21 Q25 17 30 10"
        strokeWidth="1.5"
        strokeDasharray="2.5 3"
      />
      <circle
        cx="8"
        cy="33"
        r="3"
        fill="currentColor"
        fillOpacity="0.3"
        strokeWidth="1.5"
      />
      <path
        d="M30 5 L31.3 8.7 L35 10 L31.3 11.3 L30 15 L28.7 11.3 L25 10 L28.7 8.7 Z"
        fill="currentColor"
        fillOpacity="0.55"
        strokeWidth="1.2"
      />
    </svg>
  );
}

function PrivacyIcon() {
  return (
    <svg
      width="40"
      height="40"
      viewBox="0 0 40 40"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path
        d="M9 4h15l7 7v25a2 2 0 01-2 2H9a2 2 0 01-2-2V6a2 2 0 012-2z"
        strokeWidth="1.5"
        fill="currentColor"
        fillOpacity="0.07"
      />
      <path d="M24 4v7h7" strokeWidth="1.5" />
      <line
        x1="13"
        y1="17"
        x2="27"
        y2="17"
        strokeWidth="2"
        strokeOpacity="0.9"
      />
      <line
        x1="13"
        y1="22"
        x2="24"
        y2="22"
        strokeWidth="2"
        strokeOpacity="0.45"
      />
      <line
        x1="13"
        y1="27"
        x2="20"
        y2="27"
        strokeWidth="2"
        strokeOpacity="0.2"
      />
      <path d="M11 33 Q20 30 29 33" strokeWidth="2.5" />
    </svg>
  );
}

function SaveIcon() {
  return (
    <svg
      width="40"
      height="40"
      viewBox="0 0 40 40"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path
        d="M11 4h18a2 2 0 012 2v30l-11-8-11 8V6a2 2 0 012-2z"
        strokeWidth="1.5"
        fill="currentColor"
        fillOpacity="0.1"
      />
      <path
        d="M20 10 L21.5 14.5 L26 14.5 L22.5 17.5 L24 22 L20 19 L16 22 L17.5 17.5 L14 14.5 L18.5 14.5 Z"
        strokeWidth="1.2"
        fill="currentColor"
        fillOpacity="0.5"
      />
    </svg>
  );
}

const features = [
  {
    icon: <VentIcon />,
    title: "Vent freely",
    description:
      "No formatting required. Type the messy, panicked, half-formed thing exactly as it is inside your head. You don't need to explain yourself or make it coherent. Getting it out is the first step toward thinking clearly.",
  },
  {
    icon: <SplitIcon />,
    title: "Separate facts from fear",
    description:
      "The AI reads what you wrote and separates what's literally true from the catastrophic story your brain invented. Anxiety lives in the gap between what's actually happening and what your mind predicts will happen. Seeing them split is often enough to break the spiral.",
  },
  {
    icon: <ActionIcon />,
    title: "Pick one tiny action",
    description:
      "Choose from three low-effort paths: channel it into a focused 5-minute study sprint on the specific thing you're stuck on, burn off the physical tension with movement, or use a grounding reset to quiet the noise. Small enough that starting feels easy.",
  },
  {
    icon: <PrivacyIcon />,
    title: "No memory. Ever.",
    description:
      'The AI has no idea what you said last time. There is no last time. Each session starts completely fresh — no history, no tracking, no "based on what you told me before." Vent the messy, irrational thing without it echoing back at you later.',
  },
  {
    icon: <SaveIcon />,
    title: "Save what works",
    description:
      "When you find a microstep that actually helps, you can save it to your account. Next time panic hits, go straight to what already worked for you instead of starting from scratch.",
  },
];

export function LandingSections() {
  useScrollReveal();

  const isLastOdd = features.length % 2 === 1;

  return (
    <>
      {/* Hero */}
      <section className="px-6 pb-24 pt-24 text-center">
        <div data-reveal className="relative mx-auto mb-6 w-fit">
          <GlowOrb className="left-1/2 top-1/2 h-20 w-20 -translate-x-1/2 -translate-y-1/2 animate-ember-breathe" />
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            className="relative w-12 text-primary sm:w-14"
          >
            <path d="M8.5 14.5A2.5 2.5 0 0011 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 11-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 002.5 2.5z" />
          </svg>
        </div>
        <div
          data-reveal
          data-delay="80"
          className="mb-8 flex flex-wrap items-center justify-center gap-3"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-1.5 text-sm text-muted-foreground">
            Free · No account needed
          </span>
          <span className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-1.5 text-sm text-muted-foreground">
            No memory, ever — nothing you type is stored
          </span>
        </div>

        <h1
          data-reveal
          data-delay="160"
          className="font-display mx-auto mb-6 max-w-5xl text-5xl font-bold leading-tight tracking-tight text-foreground md:text-6xl lg:text-7xl"
        >
          Spiraling before your test?
          <br />
          <span className="text-primary">Let it out. Then let it go.</span>
        </h1>

        <div className="mx-auto max-w-xl">
          <p
            data-reveal
            data-delay="240"
            className="mb-10 text-lg text-muted-foreground"
          >
            Thought Relief helps you dump what&apos;s in your head, see
            what&apos;s real vs. what&apos;s panic, and pick one tiny thing to
            do next, in under 3 minutes. What you share here stays here.
          </p>

          <a
            data-reveal
            data-delay="320"
            href="/start"
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-12 py-4 text-lg font-semibold text-primary-foreground transition-all hover:shadow-lg hover:shadow-primary/30 hover:opacity-90 active:scale-[0.98]"
          >
            Start
            <span aria-hidden>→</span>
          </a>

          <p className="mt-5 text-sm italic text-muted-foreground">
            No sign-up. No judgment. Just you and the page.
          </p>
        </div>
      </section>

      {/* Credibility / Why it works */}
      <section className="px-6 pb-24">
        <div
          data-reveal
          className="glass-card mx-auto max-w-3xl px-8 py-14 text-center"
        >
          <p className="mb-4 text-sm uppercase tracking-widest text-muted-foreground">
            Why it works
          </p>
          <h2 className="font-display mb-6 text-3xl font-bold leading-tight text-foreground md:text-4xl">
            Rooted in how therapy actually works
          </h2>
          <p className="mx-auto max-w-lg text-lg text-muted-foreground">
            Anxiety spirals don&apos;t stop on their own. The most effective
            technique therapists recommend: separate what&apos;s actually true
            from the fear story your brain invented, then redirect that anxious
            energy into one concrete action. That shift is often enough to break
            the loop.
          </p>
        </div>
      </section>

      {/* Feature cards */}
      <section className="px-6 pb-24">
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-5 sm:grid-cols-2">
          {features.map((f, i) => (
            <div
              key={f.title}
              data-reveal
              data-delay={String(i * 90)}
              className={cn(
                "rounded-xl border border-border bg-card p-7 transition-all duration-200 hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/15",
                isLastOdd &&
                  i === features.length - 1 &&
                  "sm:col-span-2 sm:mx-auto sm:w-[calc(50%-0.625rem)]",
              )}
            >
              <div className="mb-5">
                <div className="inline-flex rounded-xl bg-primary/10 p-3 text-primary">
                  {f.icon}
                </div>
              </div>
              <h3 className="mb-2 font-semibold text-foreground">{f.title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {f.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Privacy differentiator */}
      <section className="px-6 pb-24">
        <div
          data-reveal
          className="glass-card mx-auto max-w-3xl px-8 py-16 text-center"
        >
          <p className="mb-4 text-sm uppercase tracking-widest text-muted-foreground">
            Built different
          </p>
          <h2 className="font-display mb-6 text-4xl font-bold leading-tight text-primary md:text-5xl lg:text-6xl">
            Gone when you&apos;re done.
          </h2>
          <p className="mx-auto max-w-lg text-lg text-muted-foreground">
            Most AI tools remember everything you&apos;ve ever said.
            ThoughtRelief doesn&apos;t. No history. No &ldquo;based on what you
            told me last time.&rdquo; Each session is a clean slate, so you can
            actually let it go, not just say it out loud.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border px-6 py-6">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-2 text-center text-xs text-muted-foreground sm:flex-row sm:justify-between sm:text-left">
          <p>
            Thought Relief is not a therapy or crisis service. If you&apos;re in
            crisis, call or text{" "}
            <span className="font-semibold text-foreground">988</span>.
          </p>
          <p className="shrink-0">thoughtrelief.app</p>
        </div>
      </footer>
    </>
  );
}
