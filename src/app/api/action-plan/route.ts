import { createOpenAI } from "@ai-sdk/openai";
import { generateText } from "ai";
import { env } from "~/env";

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

const CHOICE_LABELS: Record<string, string> = {
  channelIntoWork: "Channel Into Work",
  burnItOff: "Burn It Off",
  resetToZero: "Reset to Zero",
};

export async function POST(req: Request) {
  const body = await req.json();
  const chosenKey: string =
    typeof body?.chosenKey === "string" ? body.chosenKey : "";
  const microstep: string =
    typeof body?.microstep === "string" ? body.microstep.trim() : "";
  const originalText: string =
    typeof body?.originalText === "string" ? body.originalText.trim() : "";
  const contextTag: string | undefined =
    typeof body?.contextTag === "string" ? body.contextTag : undefined;
  const supportStyle: string | undefined =
    typeof body?.supportStyle === "string" ? body.supportStyle : undefined;
  const responseTone: string | undefined =
    typeof body?.responseTone === "string" ? body.responseTone : undefined;

  if (!microstep || !originalText || !chosenKey) {
    return Response.json({ error: "Missing required fields" }, { status: 400 });
  }

  const choiceLabel = CHOICE_LABELS[chosenKey] ?? chosenKey;

  const personalizationLines = [
    supportStyle ? SUPPORT_STYLE_HINTS[supportStyle] : null,
    responseTone ? TONE_HINTS[responseTone] : null,
  ]
    .filter(Boolean)
    .join("\n");

  const personalizationBlock = personalizationLines
    ? `\n\nPersonalization for this student:\n${personalizationLines}`
    : "";

  const contextBlock =
    contextTag && contextTag !== "general"
      ? `\n\nContext: The student's situation has been tagged as "${contextTag}". Tailor the steps to fit this context specifically.`
      : "";

  let raw: string;
  try {
    const result = await generateText({
      model: gateway("google/gemini-2.5-flash-lite"),
      temperature: 1.0,
      system: `You are a calm companion helping a high school student act on their chosen coping strategy: "${choiceLabel}".

Two-part job:
1. Break that action into 4–5 small, sequential, immediately doable steps: one sentence each, second-person, action-first (start with a verb), under 20 words, all steps together under 10 minutes, each leading naturally to the next. Reference the student's specific subject/struggle/emotional state from their message where it fits.
2. Write a "title" for saving this plan: format "[Subject] → [Specific action]" (e.g. "Calc exam → 5-min sprint"). Under 20 characters total (strict), no quotes/trailing punctuation/filler — a plain, ordinary-looking title.

No markdown, no bullet symbols, no em dashes (—), no extra commentary.
Return ONLY a valid JSON object with exactly two keys:
- "steps": an array of 4–5 strings
- "title": the save-title string${personalizationBlock}${contextBlock}`,
      prompt: `The student wrote: "${originalText}"\n\nChosen action: "${microstep}"`,
    });
    raw = result.text;
  } catch (err) {
    // Any AI-provider failure degrades to the standard fallback steps on the
    // client rather than a dead-end error screen — see fetchActionPlan.
    console.error("Action plan generation call failed:", err);
    return Response.json({ error: "busy" }, { status: 429 });
  }

  let parsed: { steps: string[]; title?: string };
  try {
    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    parsed = JSON.parse(jsonMatch ? jsonMatch[0] : raw);
  } catch {
    return Response.json({ error: "parse_error" }, { status: 500 });
  }

  // Accept 3–6 steps to tolerate minor model variance; trim to max 5
  const validSteps = Array.isArray(parsed.steps)
    ? parsed.steps
        .filter((s) => typeof s === "string" && s.trim().length > 3)
        .slice(0, 5)
    : [];

  if (validSteps.length < 3) {
    return Response.json({ error: "invalid_response" }, { status: 500 });
  }

  // Sanitize the save title generated in the same call. Fall back to a
  // truncated first sentence of the chosen action if the model omitted it.
  let title = typeof parsed.title === "string" ? parsed.title.trim() : "";
  title = title.replace(/^["']|["']$/g, "");
  if (!title) {
    const first = microstep.split(/[.!?]/)[0].trim();
    title = first;
  }
  if (title.length > 20) {
    title = `${title.slice(0, 17)}...`;
  }

  return Response.json({ steps: validSteps, title });
}
