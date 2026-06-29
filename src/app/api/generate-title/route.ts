import { createOpenAI } from "@ai-sdk/openai";
import { generateText } from "ai";
import { env } from "~/env";

const gateway = createOpenAI({
  baseURL: "https://ai-gateway.vercel.sh/v1",
  apiKey: env.AI_GATEWAY_API_KEY,
});

const CHOICE_LABELS: Record<string, string> = {
  channelIntoWork: "Channel Into Work",
  burnItOff: "Burn It Off",
  resetToZero: "Reset to Zero",
};

export async function POST(req: Request) {
  const body = await req.json();
  const originalText: string =
    typeof body?.originalText === "string" ? body.originalText.trim() : "";
  const chosenStep: string =
    typeof body?.chosenStep === "string" ? body.chosenStep.trim() : "";
  const chosenKey: string =
    typeof body?.chosenKey === "string" ? body.chosenKey : "";

  if (!originalText || !chosenStep || !chosenKey) {
    return Response.json({ error: "Missing required fields" }, { status: 400 });
  }

  const choiceLabel = CHOICE_LABELS[chosenKey] ?? chosenKey;

  let title: string;
  try {
    const result = await generateText({
      model: gateway("openai/gpt-4.1-nano"),
      temperature: 0.7,
      system: `You generate short, specific titles for saved anxiety-relief action plans.

Format: "[Subject] → [Specific action]"
Rules:
- Under 50 characters total (strict)
- Subject: the specific thing causing stress (e.g. "Calc exam", "Bio essay", "Group project")
- Action: the concrete coping move in 2–4 words (e.g. "5-min sprint", "walk it off", "box breathing")
- No filler words, no quotes, no punctuation at the end
- Return ONLY the title string, nothing else`,
      prompt: `Student wrote: "${originalText.slice(0, 300)}"\nChosen path: ${choiceLabel}\nChosen action: "${chosenStep}"`,
    });
    title = result.text.trim().replace(/^["']|["']$/g, "");
  } catch {
    // Fall back to truncated chosenStep
    const first = chosenStep.split(/[.!?]/)[0].trim();
    title = first.length > 47 ? `${first.slice(0, 44)}...` : first;
  }

  // Enforce 50-char hard cap as a safety net
  if (title.length > 50) {
    title = `${title.slice(0, 47)}...`;
  }

  return Response.json({ title });
}
