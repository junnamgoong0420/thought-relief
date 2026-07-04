import { createOpenAI } from "@ai-sdk/openai";
import { generateText } from "ai";
import { env } from "~/env";
import { ADMIN_EMAIL } from "~/lib/constants";
import { createAdminClient } from "~/lib/supabase/admin";
import { createClient } from "~/lib/supabase/server";

// Context tags the AI infers to tailor responses; not stored in DB
type ContextTag = "test_anxiety" | "interpersonal" | "overthinking" | "general";

// Instant, zero-cost safety net for explicit crisis language. This short-
// circuits BEFORE the model call (and before rate limiting) so an obvious
// crisis is never gated by quota. Subtler / contextual cases are judged by
// the AI as part of the main analysis call (see the "crisis" output field).
const CRISIS_FALLBACK_KEYWORDS = [
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
  "no reason to live",
  "don't want to be here",
  "don't want to live",
  "not worth living",
  "better off dead",
  "wish i was dead",
  "wish i were dead",
];

function detectCrisisByKeyword(text: string): boolean {
  const lower = text.toLowerCase();
  return CRISIS_FALLBACK_KEYWORDS.some((kw) => lower.includes(kw));
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

// How the "fear" sentence should be delivered, tuned to the student's tone preference.
const FEAR_TONE_ADDENDUM: Record<string, string> = {
  direct:
    'In "fear", after naming the mental leap, add a brief clause calling out the specific assumption being made and why it might not hold true.',
  gentle:
    'In "fear", name the mental leap softly, then add a brief supportive turn that eases it (e.g. "however, that doesn\'t mean...") rather than a blunt correction.',
  balanced:
    'In "fear", name the assumption being made like a direct correction would, but deliver it warmly — softer than a pure logical rebuttal, firmer than pure reassurance.',
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

  // Fast path: explicit crisis language short-circuits before any model call.
  if (detectCrisisByKeyword(text)) {
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

  const fearToneBlock = responseTone
    ? (FEAR_TONE_ADDENDUM[responseTone] ?? "")
    : "";
  const fearToneAddendum = fearToneBlock ? `\n\n${fearToneBlock}` : "";

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
      model: gateway("google/gemini-2.5-flash-lite"),
      temperature: 0.8,
      system: `You are a calm, grounded companion for high school students spiraling with academic panic the night before a test.

Think through the steps below silently — never reveal reasoning, never mention "step 1/2/3," output only the final JSON.

SAFETY CHECK (most important): Decide if the message shows a genuine sign of danger — suicidal thoughts, self-harm, wanting to die or disappear, passive ideation ("don't want to be here anymore"), or immediate physical danger. Read for meaning, not alarming words: ordinary stress or figures of speech ("this test will kill me") are NOT a crisis. If genuinely ambiguous, err toward crisis. If crisis, set "crisis": true and use brief placeholders for the rest (the app shows crisis resources instead). Otherwise set "crisis": false and continue.

SILENT ANALYSIS: Split the student's claims into (a) objective facts — things that already happened, are currently true, or are verifiable, including real stakes (e.g. "the exam is 30% of the grade" is still a fact, not a distortion), and (b) mental predictions — catastrophizing, all-or-nothing thinking, mind reading, fortune telling, overgeneralization. Don't manufacture a distortion if the worry is mild and proportionate. Never flatten a real fact into "fear" just because it's uncomfortable — the fact is what's true, the fear is the story about how it turns out. Name genuine uncertainty as uncertainty rather than forcing it into either bucket.

OUTPUT — three parts:
1. "contextTag": one of "test_anxiety" | "interpersonal" | "overthinking" | "general" (lean "test_anxiety" when ambiguous — this is primarily a test-anxiety tool).
2. Two short observations from the analysis above:
   - "fact": 1–2 sentences, only what's objectively true right now plus any real stakes — specific, no predictions, no softening.
   - "fear": 1–2 sentences naming the specific mental leap on top of the fact, in plain language a perceptive friend would use (e.g. "you're treating one hard test as proof you'll fail the class") — never clinical terms like "catastrophizing." Never dismiss the fact or imply the student is wrong to feel something.${fearToneAddendum}
3. Exactly 3 tiny, low-friction action steps, each doable in under 5 minutes, written specifically for THIS student:
   - "channelIntoWork": tied to the actual subject/struggle they mentioned — never generic ("review your notes"). E.g. "Write out just 2 chemistry formulas from memory, then check one against your notes."
   - "burnItOff": matched to their energy level — gentle (stretch, slow walk) if exhausted/frozen, active (jumping jacks) if wired/frantic.
   - "resetToZero": matched to their specific emotional state, not a generic breathing exercise unless it truly fits.
   - Vary language across suggestions; never echo the student's own words back as advice.

Return ONLY a valid JSON object with exactly these seven keys:
- "crisis": boolean
- "contextTag": one of "test_anxiety" | "interpersonal" | "overthinking" | "general"
- "fact": 1–2 sentences, no predictions
- "fear": 1–2 sentences, plain conversational language
- "channelIntoWork": personalized test-prep action (under 5 minutes)
- "burnItOff": physical movement matched to energy level
- "resetToZero": grounding technique matched to emotional state

Each microstep value: one sentence, second-person ("Try...", "Take...", "Write..."), under 35 words. No markdown, no em dashes (—), no extra text outside the JSON.${personalizationBlock}${varietyBlock}`,
      prompt: `The student wrote: "${text}"`,
    });
    raw = result.text;
  } catch (err) {
    // Any AI-provider failure (rate limit, quota/credit exhaustion, timeout,
    // etc.) should degrade to generalized suggestions rather than a dead-end
    // "busy" screen — the app doesn't distinguish 429 from other provider
    // errors here, since the gateway doesn't always surface a clean statusCode.
    console.error("Fact/fear analysis call failed:", err);
    return Response.json({ error: "busy" }, { status: 429 });
  }

  let microsteps: {
    crisis?: boolean;
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

  // The model judges crisis as part of this single call (folded in from what
  // used to be a separate classifier request). Honor it before anything else.
  if (microsteps.crisis === true) {
    return Response.json({ crisis: true });
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
