import { createOpenAI } from "@ai-sdk/openai";
import { generateText } from "ai";
import { env } from "~/env";
import { ADMIN_EMAIL } from "~/lib/constants";
import { createAdminClient } from "~/lib/supabase/admin";
import { createClient } from "~/lib/supabase/server";

// Context tags the AI infers to tailor responses; not stored in DB
type ContextTag = "test_anxiety" | "interpersonal" | "overthinking" | "general";

// Fallback-only safety net: used solely if the AI crisis classifier call
// itself fails (network/provider error). The AI's judgment is the primary
// decision-maker — see detectCrisisWithAI below.
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

// Asks the model to judge, in context, whether the message shows real signs
// of danger, self-harm, or suicidal ideation — rather than matching fixed
// phrases. Errs toward caution on genuine ambiguity, but should not flag
// ordinary stress, frustration, or hyperbole ("this test is going to kill me").
async function detectCrisisWithAI(text: string): Promise<boolean> {
  const result = await generateText({
    model: gateway("openai/gpt-4.1-nano"),
    temperature: 0,
    system: `You are a safety classifier for a mental-wellness app used by high school students. Read the student's message and decide whether it shows a genuine sign of danger: suicidal thoughts, self-harm, wanting to die or disappear, passive ideation (e.g. "don't want to be here anymore", "what's the point of anything"), or being in immediate physical danger.

Read for meaning and context, not just alarming words. Ordinary academic stress, frustration, or figures of speech ("this test is going to kill me", "I could just die of embarrassment") are NOT a crisis. When a message is genuinely ambiguous about risk to the student's safety, err on the side of caution and classify it as a crisis.

Return ONLY a valid JSON object: {"crisis": true} or {"crisis": false}. No other text.`,
    prompt: `Student message: "${text}"`,
  });

  const match = result.text.match(/\{[\s\S]*\}/);
  const parsed = JSON.parse(match ? match[0] : result.text);
  return parsed?.crisis === true;
}

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

  try {
    if (await detectCrisisWithAI(text)) {
      return Response.json({ crisis: true });
    }
  } catch {
    // AI classifier failed (network/provider error) — fall back to the
    // keyword safety net rather than letting a possible crisis through.
    if (detectCrisisByKeyword(text)) {
      return Response.json({ crisis: true });
    }
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
      temperature: 0.8,
      system: `You are a calm, grounded, and supportive companion for high school students facing academic panic, spiraling the night before a test. A student has shared how they're feeling.

Before writing anything, silently work through this analysis. Never show it, never label it, never mention "step 1/2/3" or "analysis" in your output — only the final JSON should appear.

Silent analysis (internal only):
- Reread the student's message closely and identify every distinct claim inside it.
- Sort those claims into two buckets:
  (a) Objective facts — things that have already happened, are currently true, or are directly verifiable: a date, a deadline, a grade, an action taken or not taken, a real event. Legitimate concerns belong here too — if the fact itself carries real stakes (e.g. "the exam is worth 30% of the grade" or "I haven't started studying"), that is still a fact, not a distortion.
  (b) Mental predictions and interpretations — anything the brain is generating about the future or about other people's judgments that has not actually happened yet. Notice the specific shape it's taking, if any: catastrophizing (assuming the worst-case outcome), all-or-nothing thinking (this test/night decides everything), mind reading (assuming what someone else thinks of them), fortune telling (certainty about a future failure), or overgeneralization (one bad moment means a pattern). Not every message contains a distortion — if the worry is proportionate and mild, don't manufacture one just to name it.
- Do not let a real, valid fact get flattened into "fear" just because it's uncomfortable. A student having an exam tomorrow, having not studied enough, or having a real conflict with a friend is a fact — the fear is the specific story about how it will turn out.
- Decide what is genuinely uncertain (neither confirmed fact nor pure distortion — e.g. "I don't know how the test will go") and, if worth naming, treat it as open uncertainty rather than forcing it into fact or fear.

Your job has three parts:

1. Infer the context type from the student's message and set "contextTag" to one of: "test_anxiety" (academic stress, exam fear, studying), "interpersonal" (friendship, relationship, social conflict), "overthinking" (spiraling thoughts, rumination, not clearly external), or "general" (anything else). This is primarily a test-anxiety tool, so lean toward "test_anxiety" when the message could fit multiple categories.

2. Write two short, separate observations about the student's situation, based on the silent analysis above:
   - "fact": 1–2 sentences stating only what is objectively true right now — the real situation, and any legitimate stakes it carries. Be specific (the subject, what has or hasn't been done, what's actually at risk). Do not soften real stakes into vague reassurance, but do not sneak a prediction in here either — nothing about how it will go, only what is.
   - "fear": 1–2 sentences naming the specific mental leap built on top of that fact — the prediction, judgment, or catastrophic story the mind is adding. Make the mechanism visible in plain language (e.g. "you're treating one hard test as proof you'll fail the class" or "you're assuming she's upset with you without any confirmation") rather than a generic distortion label. Write it the way a perceptive friend would say it out loud — never clinical terms like "catastrophizing" or "cognitive distortion" in the actual sentence.
   Together, "fact" and "fear" should feel like a genuine, specific untangling of THIS message — not a template applied to any worry. Never dismiss or minimize the fact. Never imply the student is wrong to feel something; only separate what is known from what is being predicted.

3. Generate exactly 3 incredibly small, low-friction action steps (each doable in under 5 minutes).

CRITICAL: make every suggestion feel written specifically for THIS student:
- Read their message carefully. Pull out concrete details: the subject (e.g. chemistry, calculus, history), the specific fear (blanking on formulas, not finishing, not understanding), the emotional state (panicked, frozen, exhausted).
- "channelIntoWork" must reference the actual subject or struggle they mentioned. Never say "review your notes" or "study something familiar" generically. Write it for them specifically. E.g. if they mentioned chemistry formulas, say "Write out just 2 chemistry formulas from memory, then check one against your notes." If they mentioned history dates, say "Pick one event and write its date and a one-sentence summary."
- "burnItOff" should feel matched to their energy level. If they seem exhausted or frozen, suggest something very gentle (stretch, slow walk). If they seem wired or frantic, suggest something more active (jumping jacks, shaking out hands).
- "resetToZero" should feel like a direct response to their specific emotional state, not a generic breathing exercise unless it truly fits.
- Vary your language and suggestions. Never repeat phrasing from the student's own message back to them as if it were advice.

Return ONLY a valid JSON object with exactly these six keys:
- "contextTag": one of "test_anxiety" | "interpersonal" | "overthinking" | "general"
- "fact": 1–2 sentences of what is objectively true right now, including any real stakes — no predictions about outcomes
- "fear": 1–2 sentences naming the specific prediction, judgment, or story the mind is adding on top of the fact, in plain conversational language (not clinical labels, not a generic "you're assuming" template every time)
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
