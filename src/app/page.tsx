import { redirect } from "next/navigation";
import { Navbar } from "~/components/navbar";
import { createClient } from "~/lib/supabase/server";

function FlameIcon() {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M8.5 14.5A2.5 2.5 0 0011 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 11-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 002.5 2.5z" />
    </svg>
  );
}

function SplitIcon() {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 22V13" />
      <path d="M12 13L5.5 6.5" />
      <path d="M12 13L18.5 6.5" />
      <path d="M4 5l1.5 1.5" />
      <path d="M20 5l-1.5 1.5" />
    </svg>
  );
}

function CheckCircleIcon() {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}

const features = [
  {
    icon: <FlameIcon />,
    title: "Vent freely",
    description:
      "No formatting required. Type the messy, panicked thing exactly as it is.",
  },
  {
    icon: <SplitIcon />,
    title: "Separate facts from fear",
    description:
      "The AI gently untangles what's actually true from the spiral your brain invented.",
  },
  {
    icon: <CheckCircleIcon />,
    title: "Pick one tiny action",
    description:
      "Choose from three low-effort microsteps: prep a little, move your body, or reset your mind.",
  },
  {
    icon: <ShieldIcon />,
    title: "No memory. Ever.",
    description:
      "The AI has no idea what you said last time — because there is no last time. Each session starts completely fresh. Vent the messy, irrational thing without it echoing back.",
  },
];

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    const { data: prefs } = await supabase
      .from("user_preferences")
      .select("user_id")
      .eq("user_id", user.id)
      .maybeSingle();

    redirect(prefs ? "/start" : "/onboarding");
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      {/* Hero */}
      <section className="px-6 pb-24 pt-24 text-center">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
          className="mx-auto mb-6 w-12 text-primary sm:w-14"
        >
          <path d="M8.5 14.5A2.5 2.5 0 0011 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 11-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 002.5 2.5z" />
        </svg>
        <span className="mb-8 inline-flex items-center gap-2 rounded-full border border-border px-4 py-1.5 text-sm text-muted-foreground">
          Free · No account needed
        </span>

        <h1 className="font-display mx-auto mb-6 max-w-5xl text-5xl font-bold leading-tight tracking-tight text-foreground md:text-6xl lg:text-7xl">
          Spiraling before your test?
          <br />
          Let it out. Then let it go.
        </h1>

        <div className="mx-auto max-w-xl">
          <p className="mb-10 text-lg text-muted-foreground">
            Thought Relief helps you dump what&apos;s in your head, see
            what&apos;s real vs. what&apos;s panic, and pick one tiny thing to
            do next — in under 3 minutes. What you share here stays here.
          </p>

          <a
            href="/start"
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-12 py-4 text-lg font-semibold text-primary-foreground transition-opacity hover:opacity-90"
          >
            Start
            <span aria-hidden>→</span>
          </a>

          <p className="mt-5 text-sm italic text-muted-foreground">
            No sign-up. No judgment. Just you and the page.
          </p>
        </div>
      </section>

      {/* Feature cards */}
      <section className="px-6 pb-24">
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-5 sm:grid-cols-2">
          {features.map((f) => (
            <div
              key={f.title}
              className="rounded-xl border border-border bg-card p-7"
            >
              <div className="mb-5 text-primary">{f.icon}</div>
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
        <div className="mx-auto max-w-3xl rounded-2xl border border-border bg-card px-8 py-16 text-center">
          <p className="mb-4 text-sm uppercase tracking-widest text-muted-foreground">
            Built different
          </p>
          <h2 className="font-display mb-6 text-4xl font-bold leading-tight text-foreground md:text-5xl lg:text-6xl">
            Gone when you&apos;re done.
          </h2>
          <p className="mx-auto max-w-lg text-lg text-muted-foreground">
            Most AI tools remember everything you&apos;ve ever said.
            ThoughtRelief doesn&apos;t. No history. No &ldquo;based on what you
            told me last time.&rdquo; Each session is a clean slate — so you can
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
    </div>
  );
}
