import { NextResponse } from "next/server";
import { anthropic } from "@/lib/anthropic";
import { createClient } from "@/lib/supabase/server";
import { cacheGet, cacheSet } from "@/lib/redis";
import { checkRateLimit } from "@/lib/rate-limit";

// Cache keyword research for 1 hour (CLAUDE.md: 1h TTL for product-level AI results)
const KW_CACHE_TTL = 60 * 60;

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Competition = "low" | "medium" | "high";
type Trend = "up" | "down" | "stable";

interface RelatedKeyword {
  keyword: string;
  volume: number;
  competition: Competition;
  trend: Trend;
  score: number;
  cpc: number;
  sparkline: number[];
}

interface KeywordResult {
  keyword: string;
  main: { volume: number; competition: Competition; trend: Trend; score: number };
  volumeTrend: number[];
  related: RelatedKeyword[];
  questions: string[];
  brief: { angle: string; audience: string; productTypes: string };
}

const COMPETITIONS: Competition[] = ["low", "medium", "high"];
const TRENDS: Trend[] = ["up", "down", "stable"];

function clampScore(n: unknown): number {
  const v = Math.round(Number(n));
  if (!Number.isFinite(v)) return 60;
  return Math.min(100, Math.max(0, v));
}

function asCompetition(v: unknown): Competition {
  return COMPETITIONS.includes(v as Competition) ? (v as Competition) : "medium";
}

function asTrend(v: unknown): Trend {
  return TRENDS.includes(v as Trend) ? (v as Trend) : "stable";
}

// Sparklines are normalized by the chart, so absolute scale doesn't matter —
// we just need 12 points that visibly slope per the trend if the model omits them.
function ensureSparkline(sp: unknown, volume: number, trend: Trend): number[] {
  if (Array.isArray(sp) && sp.length >= 6 && sp.every((n) => typeof n === "number" && Number.isFinite(n))) {
    return sp.slice(-12).map((n) => Math.max(0, Math.round(n as number)));
  }
  const base = Math.max(volume, 100);
  const slope = trend === "up" ? 0.5 : trend === "down" ? -0.35 : 0;
  return Array.from({ length: 12 }, (_, i) => {
    const t = i / 11;
    const wobble = 1 + (i % 2 === 0 ? 0.02 : -0.02);
    return Math.max(1, Math.round(base * (1 + slope * (t - 0.5)) * wobble));
  });
}

// Pull a JSON object out of the model's reply, tolerating ```json fences / preamble.
function parseModelJson(raw: string): unknown {
  let s = raw.trim();
  const fence = s.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (fence) s = fence[1].trim();
  const start = s.indexOf("{");
  const end = s.lastIndexOf("}");
  if (start !== -1 && end !== -1) s = s.slice(start, end + 1);
  return JSON.parse(s);
}

function normalize(keyword: string, parsed: unknown): KeywordResult {
  const p = (parsed ?? {}) as Record<string, unknown>;
  const mainRaw = (p.main ?? {}) as Record<string, unknown>;
  const main = {
    volume: Math.max(0, Math.round(Number(mainRaw.volume)) || 0),
    competition: asCompetition(mainRaw.competition),
    trend: asTrend(mainRaw.trend),
    score: clampScore(mainRaw.score),
  };

  const related: RelatedKeyword[] = (Array.isArray(p.related) ? p.related : [])
    .slice(0, 12)
    .map((r) => {
      const item = (r ?? {}) as Record<string, unknown>;
      const volume = Math.max(0, Math.round(Number(item.volume)) || 0);
      const trend = asTrend(item.trend);
      return {
        keyword: String(item.keyword ?? "").trim(),
        volume,
        competition: asCompetition(item.competition),
        trend,
        score: clampScore(item.score),
        cpc: Math.max(0, Math.round((Number(item.cpc) || 0) * 100) / 100),
        sparkline: ensureSparkline(item.sparkline, volume, trend),
      };
    })
    .filter((r) => r.keyword.length > 0);

  const volumeTrend =
    Array.isArray(p.volumeTrend) && p.volumeTrend.length >= 6
      ? (p.volumeTrend as unknown[]).slice(-12).map((n) => Math.max(0, Math.round(Number(n)) || 0))
      : ensureSparkline(undefined, main.volume, main.trend);

  const briefRaw = (p.brief ?? {}) as Record<string, unknown>;
  const brief = {
    angle: String(briefRaw.angle ?? "").trim(),
    audience: String(briefRaw.audience ?? "").trim(),
    productTypes: String(briefRaw.productTypes ?? "").trim(),
  };

  const questions = (Array.isArray(p.questions) ? p.questions : [])
    .map((q) => String(q ?? "").trim())
    .filter(Boolean)
    .slice(0, 6);

  return { keyword, main, volumeTrend, related, questions, brief };
}

export async function POST(req: Request) {
  let body: { keyword?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const keyword = (body.keyword ?? "").trim();
  if (!keyword) {
    return NextResponse.json({ error: "Please enter a keyword to research." }, { status: 400 });
  }
  if (keyword.length > 80) {
    return NextResponse.json({ error: "That keyword is too long — try something shorter." }, { status: 400 });
  }

  // ── Rate limit (counts against the plan's daily "searches" budget) ──
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "anon";
  const rl = await checkRateLimit("searches", ip);
  if (!rl.success) {
    return NextResponse.json(
      {
        error:
          rl.plan === "free"
            ? "Daily search limit reached. Upgrade to Pro for unlimited keyword research."
            : "Daily search limit reached. It resets in 24 hours.",
      },
      { status: 429 }
    );
  }

  // ── Cache check ── identical keywords reuse a recent result (no credit charged) ──
  const cacheKey = `keywords:${keyword.toLowerCase()}`;
  const cached = await cacheGet<KeywordResult>(cacheKey);
  if (cached) {
    return NextResponse.json({ ...cached, credits: null, cached: true });
  }

  // ── Credit tracking (mirrors app/api/ai/generate) ──
  let credits: { used: number; limit: number } | null = null;
  let userId: string | null = null;
  try {
    const supabase = await createClient();
    const { data: auth } = await supabase.auth.getUser();
    userId = auth.user?.id ?? null;
    if (userId) {
      const { data: profile } = await supabase
        .from("profiles").select("ai_credits_used, ai_credits_limit").eq("id", userId).maybeSingle();
      if (profile) {
        const used = Number(profile.ai_credits_used) || 0;
        const limit = Number(profile.ai_credits_limit) || 0;
        if (limit > 0 && used >= limit) {
          return NextResponse.json(
            { error: "You're out of AI credits. Upgrade your plan for more.", credits: { used, limit } },
            { status: 402 }
          );
        }
        credits = { used, limit };
      }
    }
  } catch {
    /* auth/profile not available — proceed without tracking */
  }

  // ── Generate ──
  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json({ error: "AI is not configured. Add ANTHROPIC_API_KEY to enable research." }, { status: 503 });
  }

  let result: KeywordResult;
  try {
    const msg = await anthropic.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 2000,
      system:
        "You are SpyIQ's keyword intelligence engine for Shopify dropshippers (Google + social search, US market). Return realistic estimates. Output ONLY valid JSON — no markdown, no preamble.",
      messages: [
        {
          role: "user",
          content: `Research the seed keyword/niche "${keyword}" and return ONLY this JSON shape:
{
  "main": { "volume": <int monthly searches>, "competition": "low"|"medium"|"high", "trend": "up"|"down"|"stable", "score": <0-100 keyword IQ: higher = better dropshipping opportunity> },
  "volumeTrend": [<12 integers, oldest to newest monthly search volume>],
  "related": [ { "keyword": <string>, "volume": <int>, "competition": "low"|"medium"|"high", "trend": "up"|"down"|"stable", "score": <0-100>, "cpc": <USD number> } ],
  "questions": [<5 real buyer questions people search around this keyword>],
  "brief": { "angle": <2-3 sentences: best keyword angle to target and why>, "audience": <2-3 sentences: who the buyer is, where they hang out, top objection>, "productTypes": <2-3 sentences: which product variations sell and positioning to avoid> }
}
Rules: include 10 related keywords mixing head terms and long-tail, with some dropship/wholesale/under-$X modifiers. Favor low-competition high-intent long-tail with higher scores. Keep all numbers realistic for the US market. Do not include sparkline arrays.`,
        },
      ],
    });

    const text = msg.content.map((c) => (c.type === "text" ? c.text : "")).join("");
    result = normalize(keyword, parseModelJson(text));

    if (result.related.length === 0) {
      // Model returned JSON but no usable keywords — treat as a soft failure.
      return NextResponse.json({ error: "Could not research that keyword — please try a different term." }, { status: 502 });
    }

    await cacheSet(cacheKey, result, KW_CACHE_TTL);
  } catch (e) {
    console.error("[api/keywords] research error:", e);
    const message = e instanceof Error ? e.message : "";
    if (/credit balance is too low/i.test(message)) {
      return NextResponse.json(
        { error: "AI is temporarily unavailable (the SpyIQ Anthropic account is out of API credits)." },
        { status: 503 }
      );
    }
    if (/rate limit/i.test(message)) {
      return NextResponse.json({ error: "Too many requests right now — please try again in a moment." }, { status: 429 });
    }
    return NextResponse.json({ error: "Keyword research failed. Please try again." }, { status: 502 });
  }

  // Increment credit usage (best-effort)
  if (userId && credits) {
    try {
      const supabase = await createClient();
      await supabase.from("profiles").update({ ai_credits_used: credits.used + 1 }).eq("id", userId);
      credits = { ...credits, used: credits.used + 1 };
    } catch {
      /* ignore */
    }
  }

  return NextResponse.json({ ...result, credits });
}
