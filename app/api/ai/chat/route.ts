import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { createClient } from "@/lib/supabase/server";
import { aiRatelimit } from "@/lib/redis";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const SYSTEM_PROMPT = `You are SpyIQ, a senior ecommerce intelligence analyst for Shopify and dropshipping entrepreneurs. You think like an operator who has launched and scaled real stores.

Your expertise: product research and winner identification, Shopify store optimization, dropshipping supplier sourcing, Facebook and TikTok ad strategy, niche selection and market sizing, competitor analysis, and pricing.

## How to answer (substance)
- Open with a one-line direct answer or verdict, then back it up.
- Be specific and quantitative. Give realistic numbers and ranges: price points, profit margin %, monthly sales estimates, ad budgets, CPMs/CPAs, break-even ROAS. Never settle for vague advice like "do good marketing."
- When you analyze a product, niche, store, or ad, always cover these five — each with a concrete number or detail: Demand, Competition, Margin potential, Target audience, and one real Risk.
- Give tactics by name (e.g. specific ad angles, bundle/upsell ideas, supplier strategies), not generic platitudes.
- Close with a short "Next steps" list of 2–4 concrete actions the user can take today.
- These figures are informed estimates, not live data. State that briefly when it matters; never present an estimate as a verified exact stat.

## How to format (must be easy to scan)
- Use "## Heading" lines to separate the distinct parts of your answer. If the user asked several questions, give each its own "## " heading so answers don't blur together.
- Use "- " bullets for lists; keep each bullet to a single line.
- Bold is for KEY TERMS, METRICS, and LABELS only (e.g. "**Margin:** 65%"). Never bold whole sentences or paragraphs — over-bolding makes answers harder to read.
- Keep paragraphs to 1–3 sentences and leave a blank line between sections. No filler, no repetition.`;

export async function POST(req: NextRequest) {
  // ── 1. Auth: AI Analyzer requires a signed-in user ──
  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getUser();
  const userId = auth.user?.id ?? null;
  if (!userId) {
    return NextResponse.json({ error: "Please sign in to use the AI Analyzer." }, { status: 401 });
  }

  // ── 2. Plan + credit gate ──
  // Free plan has no AI chat (per pricing). Paid plans spend monthly AI credits.
  let plan = "free";
  let used = 0;
  let limit = 0;
  try {
    const { data: profile } = await supabase
      .from("profiles")
      .select("plan, ai_credits_used, ai_credits_limit")
      .eq("id", userId)
      .maybeSingle();
    if (profile) {
      plan = (profile.plan as string) || "free";
      used = Number(profile.ai_credits_used) || 0;
      limit = Number(profile.ai_credits_limit) || 0;
    }
  } catch {
    /* profile unreadable — treat as free (fail closed on the access gate) */
  }

  if (plan === "free") {
    return NextResponse.json(
      { error: "The AI Analyzer is available on paid plans. Upgrade to Starter or higher to chat with SpyIQ AI." },
      { status: 403 }
    );
  }

  if (limit > 0 && used >= limit) {
    return NextResponse.json(
      { error: "You're out of AI credits for this billing period. Upgrade your plan for more.", credits: { used, limit } },
      { status: 402 }
    );
  }

  // ── 3. Abuse guard (per-IP burst limit) ──
  const ip = req.headers.get("x-forwarded-for") ?? "anonymous";
  const { success } = await aiRatelimit.limit(ip);
  if (!success) {
    return NextResponse.json({ error: "You're sending messages too fast — please wait a moment and try again." }, { status: 429 });
  }

  // ── 4. Config + payload ──
  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json({ error: "AI is not configured. Add ANTHROPIC_API_KEY to enable the analyzer." }, { status: 503 });
  }

  let messages: unknown;
  try {
    ({ messages } = await req.json());
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }
  if (!Array.isArray(messages) || messages.length === 0) {
    return NextResponse.json({ error: "No messages provided." }, { status: 400 });
  }

  // ── 5. Stream the response; charge one credit only after a successful stream ──
  let stream;
  try {
    stream = await anthropic.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 1500,
      system: SYSTEM_PROMPT,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      messages: messages as any,
      stream: true,
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : "";
    if (/credit balance is too low/i.test(message)) {
      return NextResponse.json({ error: "AI is temporarily unavailable (the SpyIQ account is out of API credits)." }, { status: 503 });
    }
    if (/rate limit/i.test(message)) {
      return NextResponse.json({ error: "Too many requests right now — please try again in a moment." }, { status: 429 });
    }
    return NextResponse.json({ error: "The AI request failed. Please try again." }, { status: 502 });
  }

  const encoder = new TextEncoder();
  const readable = new ReadableStream({
    async start(controller) {
      let completed = false;
      try {
        for await (const event of stream) {
          if (event.type === "content_block_delta" && event.delta.type === "text_delta") {
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text: event.delta.text })}\n\n`));
          }
          if (event.type === "message_stop") {
            completed = true;
          }
        }
      } catch {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text: "\n\n_(The response was interrupted. Please try again.)_" })}\n\n`));
      }

      // Charge one AI credit for a successful response (best-effort; never blocks the stream).
      if (completed) {
        try {
          await supabase.from("profiles").update({ ai_credits_used: used + 1 }).eq("id", userId);
        } catch {
          /* ignore credit-write failures */
        }
      }

      controller.enqueue(encoder.encode("data: [DONE]\n\n"));
      controller.close();
    },
  });

  return new Response(readable, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
