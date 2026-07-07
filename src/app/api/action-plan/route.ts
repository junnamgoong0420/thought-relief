import { createGateway, generateText, stepCountIs } from "ai";
import { env } from "~/env";

const gateway = createGateway({
  apiKey: env.AI_GATEWAY_API_KEY,
});

// The model is instructed to only echo a URL verbatim from the search
// results it was given, but never trust that blindly — re-validate before it
// reaches an href. Anything that isn't a well-formed http(s) URL is dropped.
function sanitizeResourceUrl(url: unknown): string | null {
  if (typeof url !== "string") return null;
  try {
    const parsed = new URL(url.trim());
    return parsed.protocol === "http:" || parsed.protocol === "https:"
      ? parsed.toString()
      : null;
  } catch {
    return null;
  }
}

// Total AI generation time for this endpoint (search + main call + link
// verification) must stay well under 1 minute so the app's quick flow
// doesn't stall. generateText retries failed calls by default (up to 3
// attempts), which multiplies an abortSignal timeout by up to 3x — maxRetries
// is set to 0 on every call below so the timeout is the actual ceiling.
const MAIN_GENERATION_TIMEOUT_MS = 35_000;
const LINK_VERIFY_TIMEOUT_MS = 6_000;

// Some URLs return HTTP 200 for anyone but don't actually deliver the
// promised content to a stranger — a personal Amazon Music "user-playlists"
// link, a private library page, someone's account page. Filter these out
// before they're ever offered to the model as a candidate.
const PRIVATE_URL_PATTERNS = [
  /user-playlists/i,
  /\/library\//i,
  /\/my-library/i,
  /\/account\//i,
  /\/my-account/i,
  /\/profile\//i,
  /\/u\/\d/i, // e.g. open.spotify.com/u/12345 style personal profile paths
];

function looksLikePrivateResource(url: string): boolean {
  return PRIVATE_URL_PATTERNS.some((p) => p.test(url));
}

// A resource is only worth showing if it's actually reachable right now —
// the model can pick a real, on-topic search result whose page has since
// been taken down, redirects to an error, or never loads. HEAD is tried
// first since it's cheap; some servers reject HEAD (405/403), so fall back
// to GET. A redirect that lands on a login/signin page means the content
// isn't actually viewable by an anonymous student, even though the request
// itself "succeeds" — treat that as dead too. Any network error, timeout,
// non-2xx/3xx status, or login-wall redirect is treated as dead — better to
// show no link than a broken or inaccessible one.
async function isUrlReachable(url: string): Promise<boolean> {
  for (const method of ["HEAD", "GET"] as const) {
    try {
      const res = await fetch(url, {
        method,
        redirect: "follow",
        signal: AbortSignal.timeout(LINK_VERIFY_TIMEOUT_MS),
      });
      if (res.ok) {
        return !/\b(signin|sign-in|login|log-in|authwall)\b/i.test(res.url);
      }
      if (res.status !== 405 && res.status !== 403) return false;
    } catch {
      return false;
    }
  }
  return false;
}

type SearchHit = { title: string; url: string; snippet: string };

// Runs the search as its own single-step call and returns the raw hits as
// plain data — the AI Gateway's provider-executed search tool doesn't
// reliably continue to a second, text-producing step within one
// generateText() call, so the "ask the model to write JSON" part happens in
// a separate, tool-free call instead (see main call below).
// This app is meant to be a quick flow — if a resource can't be found fast,
// move on without one rather than making the student wait. Capped well under
// the 1-minute total generation budget so the main call still has room.
const RESOURCE_SEARCH_TIMEOUT_MS = 10_000;

async function searchForResource(query: string): Promise<SearchHit[]> {
  try {
    const result = await generateText({
      model: gateway("google/gemini-2.5-flash-lite"),
      tools: {
        web_search: gateway.tools.perplexitySearch({ maxResults: 3 }),
      },
      toolChoice: "required",
      stopWhen: stepCountIs(1),
      maxRetries: 0,
      abortSignal: AbortSignal.timeout(RESOURCE_SEARCH_TIMEOUT_MS),
      prompt: `Find a specific, real, freely accessible resource that would help someone actually do this: ${query}. Favor well-known, concrete, directly linkable resources over vague ones — e.g. a specific Quizlet study set or flashcard deck, a named Spotify/YouTube song or playlist, a specific workout or stretching video, a Khan Academy lesson, a Purdue OWL guide, an app. It must be a single, real, publicly accessible page — not a homepage, a search-results page, or a personal/private page (no user profiles, personal libraries, or account pages).`,
    });
    const hits: SearchHit[] = [];
    for (const step of result.steps ?? []) {
      for (const part of step.content ?? []) {
        if (part.type !== "tool-result") continue;
        const output = part.output as { results?: unknown } | undefined;
        const results = Array.isArray(output?.results) ? output.results : [];
        for (const r of results) {
          if (
            r &&
            typeof r === "object" &&
            typeof (r as { url?: unknown }).url === "string" &&
            typeof (r as { title?: unknown }).title === "string"
          ) {
            const { title, url, snippet } = r as {
              title: string;
              url: string;
              snippet?: string;
            };
            if (looksLikePrivateResource(url)) continue;
            hits.push({
              title,
              url,
              snippet: typeof snippet === "string" ? snippet.slice(0, 220) : "",
            });
          }
        }
      }
    }
    return hits.slice(0, 3);
  } catch (err) {
    console.error("Resource search call failed:", err);
    return [];
  }
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

  const searchHits = await searchForResource(`${choiceLabel}: ${microstep}`);
  const resourceBlock =
    searchHits.length > 0
      ? `\n\nSEARCH RESULTS (real, verified — pick the single best match for "resourceUrl", or null if none genuinely fit):\n${searchHits
          .map((h, i) => `${i + 1}. "${h.title}" — ${h.url}\n   ${h.snippet}`)
          .join("\n")}`
      : "";

  let raw: string;
  try {
    const result = await generateText({
      model: gateway("google/gemini-2.5-flash-lite"),
      temperature: 1.0,
      maxRetries: 0,
      abortSignal: AbortSignal.timeout(MAIN_GENERATION_TIMEOUT_MS),
      system: `You are a calm companion helping a high school student act on their chosen coping strategy: "${choiceLabel}".

Three-part job:
1. Break that action into 4–5 small, sequential, immediately doable steps: one sentence each, second-person, action-first (start with a verb), under 20 words, all steps together under 10 minutes, each leading naturally to the next. Reference the student's specific subject/struggle/emotional state from their message where it fits. Fail condition: a step that would read identically for any student doing any activity (e.g. "close your eyes and breathe," "take a break") — every step must tie to specifics from what the student wrote or from the search results below. If you pick a "resourceUrl" (see below), one of the steps must explicitly tell the student to use it (e.g. "Play the track linked below and focus on the rhythm" or "Open the guide linked below and read the first section").
2. Write a "title" for saving this plan: format "[Subject] → [Specific action]" (e.g. "Calc exam → 5-min sprint"). Under 20 characters total (strict), no quotes/trailing punctuation/filler — a plain, ordinary-looking title.
3. Pick "resourceUrl" from the search results below, if any were provided — the one that most helps the student actually carry out the overall action ("${choiceLabel}": "${microstep}"). Any resource type counts: a specific Quizlet set, a named song or playlist, a workout/stretching video, an article, guide, app, tool, whatever fits — be generous, not strict, about what "helps" means, as long as it's a specific, real, directly linkable page. Copy the URL exactly as given. Never invent, guess, or modify a URL. Only set it to null if no search results were provided, or every single one is clearly unrelated or broken.

No markdown, no bullet symbols, no em dashes (—), no extra commentary.
Return ONLY a valid JSON object with exactly three keys:
- "steps": an array of 4–5 strings
- "title": the save-title string
- "resourceUrl": a URL string copied from the search results, or null${personalizationBlock}${contextBlock}${resourceBlock}`,
      prompt: `The student wrote: "${originalText}"\n\nChosen action: "${microstep}"`,
    });
    raw = result.text;
  } catch (err) {
    // Any AI-provider failure degrades to the standard fallback steps on the
    // client rather than a dead-end error screen — see fetchActionPlan.
    console.error("Action plan generation call failed:", err);
    return Response.json({ error: "busy" }, { status: 429 });
  }

  let parsed: { steps: string[]; title?: string; resourceUrl?: string | null };
  try {
    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    parsed = JSON.parse(jsonMatch ? jsonMatch[0] : raw);
  } catch {
    return Response.json({ error: "parse_error" }, { status: 500 });
  }

  // Accept 3–6 steps to tolerate minor model variance; trim to max 5
  let validSteps = Array.isArray(parsed.steps)
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

  let resourceUrl = sanitizeResourceUrl(parsed.resourceUrl);

  // Guard against hallucination: only accept a URL that exactly matches one
  // we actually retrieved from search — never one the model reconstructed
  // or modified from memory.
  if (resourceUrl) {
    const retrievedUrls = new Set(
      searchHits.map((h) => sanitizeResourceUrl(h.url)).filter(Boolean),
    );
    if (!retrievedUrls.has(resourceUrl)) {
      resourceUrl = null;
    }
  }

  // Guard against dead links: verify it actually loads before ever showing
  // it to the student.
  if (resourceUrl) {
    const reachable = await isUrlReachable(resourceUrl);
    if (!reachable) resourceUrl = null;
  }

  // If the resource got rejected by a guard above, the model may still have
  // written a step assuming it would exist (e.g. "...linked below"). Strip
  // that dangling reference rather than leave a broken pointer in the UI.
  if (!resourceUrl) {
    validSteps = validSteps.map((s) =>
      s
        .replace(/\s*\blinked below\b\.?/gi, "")
        .replace(/\s{2,}/g, " ")
        .trim(),
    );
  }

  return Response.json({ steps: validSteps, title, resourceUrl });
}
