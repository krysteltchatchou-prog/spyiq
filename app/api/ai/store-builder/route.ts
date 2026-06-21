import { NextRequest } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { cacheGet, cacheSet } from "@/lib/redis";

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// Generated stores are deterministic enough to reuse for an hour
const STORE_CACHE_TTL = 60 * 60;

const PROGRESS_STEPS = [
  "Fetching product data",
  "Generating brand identity",
  "Writing product copy",
  "Building home page",
  "Creating ad hooks",
  "Packaging for Shopify",
];

export async function POST(req: NextRequest) {
  const { product, style, storeName, language } = await req.json();

  const prompt = `You are an expert ecommerce copywriter and brand strategist.
Generate a complete, conversion-optimized Shopify store for a dropshipper.

Product: ${product}
Store style: ${style}
Store name hint: ${storeName || "generate a great name"}
Language: ${language || "English"}

Return ONLY valid JSON (no markdown, no code fences):
{
  "brand": {
    "store_name": "string",
    "tagline": "string",
    "color_palette": ["#hex1","#hex2","#hex3","#hex4","#hex5"],
    "font_display": "string",
    "font_body": "string",
    "brand_voice": "string"
  },
  "product_page": {
    "seo_title": "string",
    "meta_description": "string",
    "headline": "string",
    "description_p1": "string",
    "description_p2": "string",
    "description_p3": "string",
    "bullets": ["string","string","string","string","string"],
    "faq": [
      {"q":"string","a":"string"},
      {"q":"string","a":"string"},
      {"q":"string","a":"string"},
      {"q":"string","a":"string"},
      {"q":"string","a":"string"}
    ]
  },
  "home_page": {
    "hero_headline": "string",
    "hero_sub": "string",
    "features": [
      {"icon":"emoji","title":"string","body":"string"},
      {"icon":"emoji","title":"string","body":"string"},
      {"icon":"emoji","title":"string","body":"string"}
    ],
    "social_proof": "string",
    "cta_primary": "string",
    "cta_secondary": "string"
  },
  "ads": {
    "facebook": ["string","string","string"],
    "tiktok": ["string","string","string"],
    "email_subjects": ["string","string"]
  },
  "policies": {
    "shipping_blurb": "string",
    "returns_blurb": "string",
    "trust_badges": ["string","string","string","string"]
  }
}`;

  const encoder = new TextEncoder();
  let buffer = "";

  const cacheKey = `storebuild:${String(product ?? "").toLowerCase()}:${String(style ?? "").toLowerCase()}:${String(storeName ?? "").toLowerCase()}:${String(language ?? "").toLowerCase()}`;

  const readable = new ReadableStream({
    async start(controller) {
      const sendStep = (step: string) =>
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: "step", step })}\n\n`));
      const sendResult = (data: unknown) => {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: "result", data })}\n\n`));
        controller.enqueue(encoder.encode("data: [DONE]\n\n"));
        controller.close();
      };

      try {
        // Cache hit — replay the progress steps quickly, then return the stored store
        const cached = await cacheGet<unknown>(cacheKey);
        if (cached) {
          for (const step of PROGRESS_STEPS) {
            sendStep(step);
            await new Promise((r) => setTimeout(r, 120));
          }
          sendResult(cached);
          return;
        }

        const stream = await anthropic.messages.create({
          model: "claude-sonnet-4-6",
          max_tokens: 4096,
          system: "Return ONLY valid JSON. No markdown code fences, no explanation, just the JSON object.",
          messages: [{ role: "user", content: prompt }],
          stream: true,
        });

        // Stream progress events first, then accumulate the actual content
        for (const step of PROGRESS_STEPS) {
          sendStep(step);
          await new Promise((r) => setTimeout(r, 300));
        }

        for await (const event of stream) {
          if (event.type === "content_block_delta" && event.delta.type === "text_delta") {
            buffer += event.delta.text;
          }
        }

        // Parse, cache, and send the result. Strip any code fences, then slice
        // to the outer braces so stray prose before/after the JSON can't break it.
        let jsonText = buffer.replace(/^```json\s*/i, "").replace(/```\s*$/i, "").trim();
        const firstBrace = jsonText.indexOf("{");
        const lastBrace = jsonText.lastIndexOf("}");
        if (firstBrace !== -1 && lastBrace !== -1) jsonText = jsonText.slice(firstBrace, lastBrace + 1);
        const parsed = JSON.parse(jsonText);
        await cacheSet(cacheKey, parsed, STORE_CACHE_TTL);
        sendResult(parsed);
      } catch (err) {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: "error", message: String(err) })}\n\n`));
        controller.close();
      }
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
