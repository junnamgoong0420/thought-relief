import { createOpenAI } from "@ai-sdk/openai";
import { generateText } from "ai";
import { env } from "~/env";
import { ADMIN_EMAIL } from "~/lib/constants";
import { createAdminClient } from "~/lib/supabase/admin";
import { createClient } from "~/lib/supabase/server";

// Context tags the AI infers to tailor responses; not stored in DB
type ContextTag = "test_anxiety" | "interpersonal" | "overthinking" | "general";

const CRISIS_KEYWORDS = [
  // Direct self-harm / suicide
  "kill myself",
  "killing myself",
  "suicide",
  "suicidal",
  "want to die",
  "end my life",
  "hurt myself",
  "self-harm",
  "self harm",
  "cutting myself",
  // Passive ideation / loss of will to live
  "no reason to live",
  "don't want to be here",
  "don't want to live",
  "not worth living",
  "life is not worth",
  "not worth it anymore",
  "rather not be here",
  "rather be dead",
  "better off dead",
  "better off without me",
  "wish i was dead",
  "wish i were dead",
  "want to disappear forever",
  "don't want to be alive",
  "tired of being alive",
  "tired of living",
  "can't go on",
  "no point in living",
  "not worth being alive",
  "maybe just not live",
  "just not live anymore",
  "don't want to exist",
  "want everything to end",
  "want it all to end",
];

function detectCrisis(text: string): boolean {
  const lower = text.toLowerCase();
  return CRISIS_KEYWORDS.some((kw) => lower.includes(kw));
}

const gateway = createOpenAI({
  baseURL: "https://ai-gateway.vercel.sh/v1",
  apiKey: env.AI_GATEWAY_API_KEY,
});

const SUPPORT_STYLE_HINTS: Record<string, string> = {
  practical:
    "The student prefers practical, action-focused support. Skip the emotional validation fluff and lead with concrete, doable steps.",
  emotional:
    "The student prefers emotional support. Prioritize warmth, validation, and empathy before anything action-oriented.",
  balanced:
    "The student prefers a balanced mix of emotional warmth and practical guidance. Blend both equally.",
};

const TONE_HINTS: Record<string, string> = {
  gentle:
    "Use a very gentle, soft tone. Never blunt, never pushy. Ease into every suggestion.",
  direct:
    "Use a direct, no-nonsense tone. Get to the point quickly without excessive softening.",
  balanced:
    "Use a balanced tone. Warm but not overly soft, clear but not blunt.",
};

export async function POST(req: Request) {
  const body = await req.json();
  const text: string = typeof body?.text === "string" ? body.text.trim() : "";
  const supportStyle: string | undefined =
    typeof body?.supportStyle === "string" ? body.supportStyle : undefined;
  const responseTone: string | undefined =
    typeof body?.responseTone === "string" ? body.responseTone : undefined;

  if (!text) {
    return Response.json({ error: "No text provided" }, { status: 400 });
  }

  if (detectCrisis(text)) {
    return Response.json({ crisis: true });
  }

  // Rate limiting: authenticated users get 7 reflections per calendar week (Mon–Sun UTC)
  // Wrapped in try/catch — a Supabase failure must never block the AI feature
  let userId: string | null = null;
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      userId = user.id;

      if (user.email !== ADMIN_EMAIL) {
        const admin = createAdminClient();
        const now = new Date();
        const dayOfWeek = now.getUTCDay(); // 0=Sun, 1=Mon, ..., 6=Sat
        const daysFromMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
        const weekStart = new Date(
          Date.UTC(
            now.getUTCFullYear(),
            now.getUTCMonth(),
            now.getUTCDate() - daysFromMonday,
          ),
        ).toISOString();
        const { count } = await admin
          .from("reflections")
          .select("id", { count: "exact", head: true })
          .eq("user_id", user.id)
          .gte("created_at", weekStart);
        if ((count ?? 0) >= 10) {
          return Response.json({ error: "limit" }, { status: 429 });
        }
      }
    }
  } catch {
    // Non-fatal: if the limit check fails, let the request through
  }

  // Fetch past burnItOff and resetToZero suggestions to avoid repeating them
  let pastBurnItOff: string[] = [];
  let pastResetToZero: string[] = [];
  if (userId) {
    try {
      const admin = createAdminClient();
      const { data } = await admin
        .from("reflections")
        .select("burn_it_off, reset_to_zero")
        .eq("user_id", userId)
        .not("burn_it_off", "is", null)
        .order("created_at", { ascending: false })
        .limit(10);
      if (data) {
        pastBurnItOff = data
          .map((r: { burn_it_off: string | null }) => r.burn_it_off)
          .filter((s): s is string => Boolean(s));
        pastResetToZero = data
          .map((r: { reset_to_zero: string | null }) => r.reset_to_zero)
          .filter((s): s is string => Boolean(s));
      }
    } catch {
      // Non-fatal — history fetch failure must never block the AI call
    }
  }

  const personalizationLines = [
    supportStyle ? SUPPORT_STYLE_HINTS[supportStyle] : null,
    responseTone ? TONE_HINTS[responseTone] : null,
  ]
    .filter(Boolean)
    .join("\n");

  const personalizationBlock = personalizationLines
    ? `\n\nPersonalization for this student:\n${personalizationLines}`
    : "";

  let varietyBlock = "";
  if (pastBurnItOff.length > 0 || pastResetToZero.length > 0) {
    varietyBlock =
      "\n\nThis student has received these suggestions before. Do NOT repeat them:";
    if (pastBurnItOff.length > 0) {
      varietyBlock += `\nPast "burnItOff" suggestions: ${pastBurnItOff.map((s) => `"${s}"`).join("; ")}`;
    }
    if (pastResetToZero.length > 0) {
      varietyBlock += `\nPast "resetToZero" suggestions: ${pastResetToZero.map((s) => `"${s}"`).join("; ")}`;
    }
    varietyBlock +=
      "\nGenerate meaningfully different suggestions for burnItOff and resetToZero this time.";
  }

  let raw: string;
  try {
    const result = await generateText({
      model: gateway("openai/gpt-4.1-nano"),
      temperature: 1.0,
      system: `You are a calm, grounded, and supportive companion for high school students facing academic panic, spiraling the night before a test. A student has shared how they're feeling.

Your job is three parts:

1. Infer the context type from the student's message and set "contextTag" to one of: "test_anxiety" (academic stress, exam fear, studying), "interpersonal" (friendship, relationship, social conflict), "overthinking" (spiraling thoughts, rumination, not clearly external), or "general" (anything else). This is primarily a test-anxiety tool, so lean toward "test_anxiety" when the message could fit multiple categories.

2. Write two short, separate observations about the student's situation:
   - "fact": 1–2 sentences of hard, literal truth — only what is objectively happening right now. State it plainly and specifically: the subject, the situation, what they've actually done or not done. No interpretation, no emotional framing, no softening. Just the facts as they are.
   - "fear": 1–2 sentences naming the emotional assumption or catastrophic story they're telling themselves about the future. Explicitly flag these as assumptions — not facts. Use language like "You're assuming...", "The fear here is the belief that...", or "Your mind is treating it as certain that..." — make it clear these are interpretations or predictions, not things that have actually happened.

3. Generate exactly 3 incredibly small, low-friction action steps (each doable in under 5 minutes).

CRITICAL: make every suggestion feel written specifically for THIS student:
- Read their message carefully. Pull out concrete details: the subject (e.g. chemistry, calculus, history), the specific fear (blanking on formulas, not finishing, not understanding), the emotional state (panicked, frozen, exhausted).
- "channelIntoWork" must reference the actual subject or struggle they mentioned. Never say "review your notes" or "study something familiar" generically. Write it for them specifically. E.g. if they mentioned chemistry formulas, say "Write out just 2 chemistry formulas from memory, then check one against your notes." If they mentioned history dates, say "Pick one event and write its date and a one-sentence summary."
- "burnItOff" should feel matched to their energy level. If they seem exhausted or frozen, suggest something very gentle (stretch, slow walk). If they seem wired or frantic, suggest something more active (jumping jacks, shaking out hands).
- "resetToZero" should feel like a direct response to their specific emotional state, not a generic breathing exercise unless it truly fits.
- Vary your language and suggestions. Never repeat phrasing from the student's own message back to them as if it were advice.

Return ONLY a valid JSON object with exactly these six keys:
- "contextTag": one of "test_anxiety" | "interpersonal" | "overthinking" | "general"
- "fact": 1–2 sentences of hard, literal, objective truth — only what is concretely happening right now (no emotional framing, no softening, just the specific real situation)
- "fear": 1–2 sentences naming the emotional assumption or catastrophic story they're telling themselves — explicitly framed as assumptions, not facts (use "You're assuming...", "The fear is the belief that...", or similar language to make clear these are interpretations, not certainties)
- "channelIntoWork": a personalized test-prep action tied to the specific subject or struggle they mentioned (under 5 minutes)
- "burnItOff": a physical movement matched to their apparent energy level
- "resetToZero": a grounding or reset technique matched to their specific emotional state

Each microstep value must be a single sentence, second-person ("Try...", "Take...", "Write..."), under 35 words. No markdown. No em dashes (—). No extra text outside the JSON.${personalizationBlock}${varietyBlock}`,
      prompt: `The student wrote: "${text}"`,
    });
    raw = result.text;
  } catch (err) {
    const statusCode = (err as { statusCode?: number })?.statusCode;
    if (statusCode === 429) {
      return Response.json({ error: "busy" }, { status: 429 });
    }
    return Response.json({ error: "busy" }, { status: 503 });
  }

  let microsteps: {
    contextTag: ContextTag;
    fact: string;
    fear: string;
    channelIntoWork: string;
    burnItOff: string;
    resetToZero: string;
  };
  try {
    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    microsteps = JSON.parse(jsonMatch ? jsonMatch[0] : raw);
  } catch {
    const rawLower = raw.toLowerCase();
    const isRefusal = [
      "i cannot",
      "i can't",
      "i'm unable",
      "i am unable",
      "i won't",
      "unable to provide",
      "cannot assist",
      "can't assist",
      "i should not",
    ].some((p) => rawLower.includes(p));
    if (isRefusal) {
      return Response.json({ error: "safety" });
    }
    return Response.json({ fallback: true });
  }

  const steps = [
    microsteps.channelIntoWork,
    microsteps.burnItOff,
    microsteps.resetToZero,
  ];
  const allFilled = steps.every(
    (s) => typeof s === "string" && s.trim().length > 5,
  );
  const unique = new Set(steps.map((s) => s.trim().toLowerCase().slice(0, 30)));
  if (
    !allFilled ||
    unique.size < 3 ||
    !microsteps.fact?.trim() ||
    !microsteps.fear?.trim()
  ) {
    return Response.json({ fallback: true });
  }

  // Record the reflection (fire-and-forget — don't block the response)
  try {
    const admin = createAdminClient();
    await admin.from("reflections").insert({
      user_id: userId,
      burn_it_off: microsteps.burnItOff,
      reset_to_zero: microsteps.resetToZero,
    });
  } catch {
    // Non-fatal — analytics failure must never break the user experience
  }

  return Response.json({ crisis: false, microsteps });
}
