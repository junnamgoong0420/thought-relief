"use client";

import { useState } from "react";
import { createClient } from "~/lib/supabase/client";

export function WaitlistForm() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    setError(null);
    const supabase = createClient();
    const { error: dbError } = await supabase
      .from("waitlist")
      .insert({ email });
    setLoading(false);
    if (dbError) {
      if (dbError.code === "23505") {
        // unique violation — treat as success so users aren't exposed to internals
        setSubmitted(true);
        return;
      }
      setError("Something went wrong. Please try again.");
      return;
    }
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="text-center">
        <p className="text-xl font-semibold text-foreground">
          You&apos;re on the list.
        </p>
        <p className="mt-2 text-muted-foreground">
          We&apos;ll reach out when Thought Relief launches.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center"
    >
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="your@email.com"
        required
        disabled={loading}
        className="w-full rounded-lg border border-border bg-card px-4 py-3 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none disabled:opacity-60 sm:w-72"
      />
      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-lg bg-primary px-6 py-3 font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-60 sm:w-auto"
      >
        {loading ? "Saving…" : "Notify me"}
      </button>
      {error && (
        <p className="w-full text-center text-sm text-red-500 sm:col-span-2">
          {error}
        </p>
      )}
    </form>
  );
}
