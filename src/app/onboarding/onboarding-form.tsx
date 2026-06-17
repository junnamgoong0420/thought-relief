"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "~/lib/supabase/client";

type SupportStyle = "practical" | "emotional" | "balanced";
type ResponseTone = "gentle" | "balanced" | "direct";

const STEP1_OPTIONS: { value: SupportStyle; label: string; sub: string }[] = [
  {
    value: "practical",
    label: "Practical steps",
    sub: "Give me something concrete to do",
  },
  {
    value: "emotional",
    label: "Emotional support",
    sub: "Help me feel heard and understood",
  },
  {
    value: "balanced",
    label: "A bit of both",
    sub: "Mix of support and action",
  },
];

const STEP2_OPTIONS: { value: ResponseTone; label: string; sub: string }[] = [
  {
    value: "gentle",
    label: "Gently and reassuringly",
    sub: "Warm, calm, and encouraging",
  },
  {
    value: "balanced",
    label: "Balanced and thoughtful",
    sub: "Honest but compassionate",
  },
  {
    value: "direct",
    label: "Directly and action-focused",
    sub: "Clear, no-nonsense, get-it-done",
  },
];

export function OnboardingForm({ userId }: { userId: string }) {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [supportStyle, setSupportStyle] = useState<SupportStyle | null>(null);
  const [responseTone, setResponseTone] = useState<ResponseTone | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const currentOptions = step === 1 ? STEP1_OPTIONS : STEP2_OPTIONS;
  const currentAnswer = step === 1 ? supportStyle : responseTone;
  const question =
    step === 1
      ? "When you're feeling overwhelmed, what helps you most?"
      : "How would you like ThoughtRelief to respond to you?";

  async function handleContinue() {
    if (step === 1) {
      if (!supportStyle) return;
      setStep(2);
      return;
    }

    if (!responseTone || !supportStyle) return;
    setSaving(true);
    setError(null);

    const supabase = createClient();
    const { error: dbError } = await supabase.from("user_preferences").insert({
      user_id: userId,
      support_style: supportStyle,
      response_tone: responseTone,
    });

    if (dbError) {
      setError("Something went wrong. Please try again.");
      setSaving(false);
      return;
    }

    router.push("/start");
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="border-b border-border py-5">
        <div className="mx-auto max-w-6xl px-6">
          <span className="font-display text-lg font-bold text-foreground">
            ThoughtRelief
          </span>
        </div>
      </header>
      <main className="flex flex-1 flex-col items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <p className="mb-3 text-xs font-medium uppercase tracking-widest text-muted-foreground">
            Step {step} of 2
          </p>
          <h1 className="font-display mb-8 text-2xl font-bold text-foreground">
            {question}
          </h1>
          <div className="mb-8 flex flex-col gap-3">
            {currentOptions.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() =>
                  step === 1
                    ? setSupportStyle(opt.value as SupportStyle)
                    : setResponseTone(opt.value as ResponseTone)
                }
                className={`rounded-xl border px-5 py-4 text-left transition-colors ${
                  currentAnswer === opt.value
                    ? "border-primary bg-primary/5"
                    : "border-border bg-card hover:border-primary/40"
                }`}
              >
                <p className="font-medium text-foreground">{opt.label}</p>
                <p className="mt-0.5 text-sm text-muted-foreground">
                  {opt.sub}
                </p>
              </button>
            ))}
          </div>
          {error && <p className="mb-4 text-sm text-destructive">{error}</p>}
          <button
            type="button"
            onClick={handleContinue}
            disabled={!currentAnswer || saving}
            className="w-full rounded-xl bg-primary px-6 py-3.5 font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-40"
          >
            {saving ? "Saving…" : step === 2 ? "Let's go →" : "Continue →"}
          </button>
        </div>
      </main>
    </div>
  );
}
