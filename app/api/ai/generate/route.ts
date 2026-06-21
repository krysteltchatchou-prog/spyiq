import { NextResponse } from "next/server";
import { anthropic } from "@/lib/anthropic";
import { createClient } from "@/lib/supabase/server";
import { cacheGet, cacheSet } from "@/lib/redis";
import { MOCK_ADS } from "@/lib/ads-data";
import { MOCK_VIRAL_VIDEOS } from "@/lib/viral-data";

// Cache generated copy for 1 hour (CLAUDE.md: 1h TTL for product-level AI results)
const GEN_CACHE_TTL = 60 * 60;

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const GENERATORS: Record<string, { label: string; instruction: string }> = {
  tiktok_hook: { label: "TikTok Hook", instruction: "Write 3 scroll-stopping TikTok video hooks (first 3 seconds of a UGC ad). Each on its own line, max 12 words, no hashtags." },
  facebook_ad: { label: "Facebook Ad Copy", instruction: "Write one Facebook ad: a 1-line hook, a 2-3 sentence body that builds desire and handles one objection, and a CTA line." },
  product_description: { label: "Product Description", instruction: "Write a conversion-optimized product description: a benefit-led opening paragraph, then 5 bullet points of benefits, then a short closing line." },
  store_headline: { label: "Store Headline", instruction: "Write 5 homepage hero headline options. Each on its own line, under 10 words, benefit-driven." },
  email_subjects: { label: "Email Subject Lines", instruction: "Write 7 email subject lines optimized for open rate. Each on its own line, under 9 words. Mix curiosity, urgency and benefit." },
  landing_hero: { label: "Landing Page Hero", instruction: "Write a landing page hero section: a headline (under 10 words), a 1-sentence subheadline, and a CTA button label." },
};

const TONES = ["Urgent", "Friendly", "Premium", "Funny", "Bold"];

async function marketContext(niche: string): Promise<string> {
  let hooks: string[] = [];
  let caption = "";

  try {
    const supabase = await createClient();
    const { data: ads } = await supabase
      .from("ads").select("hook_text").eq("niche", niche)
      .order("engagement_rate", { ascending: false }).limit(3);
    if (ads?.length) hooks = ads.map((a) => a.hook_text as string);

    const { data: vids } = await supabase
      .from("viral_videos").select("caption").eq("niche", niche)
      .order("viral_score", { ascending: false }).limit(1);
    if (vids?.length) caption = vids[0].caption as string;
  } catch {
    /* fall through to mock */
  }

  if (hooks.length === 0) {
    hooks = MOCK_ADS.filter((a) => a.niche === niche).slice(0, 3).map((a) => a.hook_text);
  }
  if (!caption) {
    caption = MOCK_VIRAL_VIDEOS.find((v) => v.niche === niche)?.caption ?? "";
  }

  const parts: string[] = [];
  if (hooks.length) parts.push(`Top-performing ad hooks in the ${niche} niche right now:\n- ${hooks.join("\n- ")}`);
  if (caption) parts.push(`A caption from a video going viral in this niche: "${caption}"`);
  return parts.length
    ? `\n\nMARKET CONTEXT (use as inspiration for angle and voice, do not copy verbatim):\n${parts.join("\n\n")}`
    : "";
}

export async function POST(req: Request) {
  let body: { type?: string; productName?: string; niche?: string; tone?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const gen = GENERATORS[body.type ?? ""];
  if (!gen) return NextResponse.json({ error: "Unknown generator type." }, { status: 400 });

  const productName = (body.productName ?? "").trim();
  if (!productName) return NextResponse.json({ error: "Please enter a product or store name." }, { status: 400 });

  const niche = (body.niche ?? "General").trim();
  const tone = TONES.includes(body.tone ?? "") ? body.tone! : "Bold";

  // ── Cache check ── identical requests reuse a recent result (no credit charged)
  const cacheKey = `gen:${body.type}:${niche.toLowerCase()}:${tone.toLowerCase()}:${productName.toLowerCase()}`;
  const cachedOutput = await cacheGet<string>(cacheKey);
  if (cachedOutput) {
    return NextResponse.json({ output: cachedOutput, type: gen.label, tone, credits: null, cached: true });
  }

  // ── Credit tracking ──
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
    return NextResponse.json({ error: "AI is not configured. Add ANTHROPIC_API_KEY to enable generation." }, { status: 503 });
  }

  let output = "";
  try {
    const context = await marketContext(niche);
    const msg = await anthropic.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 700,
      system: `You are SpyIQ's AI Creative Studio — an expert ecommerce copywriter for Shopify dropshippers. Write in a ${tone.toLowerCase()} tone. Output only the copy requested, no preamble, no explanations.`,
      messages: [{
        role: "user",
        content: `Product/store: "${productName}" (niche: ${niche}).\n\nTask: ${gen.instruction}${context}`,
      }],
    });
    output = msg.content.map((c) => (c.type === "text" ? c.text : "")).join("").trim();
    if (output) await cacheSet(cacheKey, output, GEN_CACHE_TTL);
  } catch (e) {
    console.error("[ai/generate] generation error:", e);
    const message = e instanceof Error ? e.message : "";
    if (/credit balance is too low/i.test(message)) {
      return NextResponse.json(
        { error: "AI is temporarily unavailable (the SpyIQ Anthropic account is out of API credits). Add credits in the Anthropic console to enable generation." },
        { status: 503 }
      );
    }
    if (/rate limit/i.test(message)) {
      return NextResponse.json({ error: "Too many requests right now — please try again in a moment." }, { status: 429 });
    }
    return NextResponse.json({ error: "Generation failed. Please try again." }, { status: 502 });
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

  return NextResponse.json({ output, type: gen.label, tone, credits });
}
