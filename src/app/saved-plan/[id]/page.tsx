import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { GlowOrb } from "~/components/glow-orb";
import { createClient } from "~/lib/supabase/server";

const CARD_LABEL: Record<string, string> = {
  channelIntoWork: "Channel into Work",
  burnItOff: "Burn it Off",
  resetToZero: "Reset to Zero",
};

export default async function SavedPlanPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/auth/sign-in");

  const { data: plan } = await supabase
    .from("saved_plans")
    .select("id, title, chosen_key, chosen_step, steps, created_at")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (!plan) notFound();

  const steps = plan.steps as string[];
  const date = new Date(plan.created_at as string).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="min-h-screen">
      <GlowOrb className="-z-10 fixed inset-x-0 top-0 h-[640px] w-full rounded-none opacity-[0.22] blur-3xl" />
      <div className="mx-auto max-w-xl px-6 py-12">
        <Link
          href="/start"
          className="mb-8 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            aria-hidden="true"
          >
            <polyline points="9 2 4 7 9 12" />
          </svg>
          Back
        </Link>

        <p className="mb-1 text-xs uppercase tracking-widest text-muted-foreground">
          {CARD_LABEL[plan.chosen_key as string] ?? plan.chosen_key}
        </p>
        <h1 className="font-display mb-1 text-3xl font-semibold text-foreground">
          {plan.title}
        </h1>
        <p className="mb-8 text-xs text-muted-foreground">{date}</p>

        <div className="glass-card mb-8 px-6 py-5">
          <p className="text-sm leading-relaxed text-muted-foreground">
            {plan.chosen_step}
          </p>
        </div>

        <hr className="my-8 border-border/40" />

        <ol className="space-y-3">
          {steps.map((step, i) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: steps are ordered and stable
            <li key={i} className="flex gap-3">
              <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                {i + 1}
              </span>
              <p className="text-sm leading-relaxed text-foreground">{step}</p>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
