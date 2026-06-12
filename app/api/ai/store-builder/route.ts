import { NextRequest } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

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

  const readable = new ReadableStream({
    async start(controller) {
      try {
        const stream = await anthropic.messages.create({
          model: "claude-sonnet-4-6",
          max_tokens: 2048,
          system: "Return ONLY valid JSON. No markdown code fences, no explanation, just the JSON object.",
          messages: [{ role: "user", content: prompt }],
          stream: true,
        });

        // Stream progress events first, then accumulate the actual content
        const steps = [
          "Fetching product data",
          "Generating brand identity",
          "Writing product copy",
          "Building home page",
          "Creating ad hooks",
          "Packaging for Shopify",
        ];

        for (const step of steps) {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: "step", step })}\n\n`));
          await new Promise((r) => setTimeout(r, 300));
        }

        for await (const event of stream) {
          if (event.type === "content_block_delta" && event.delta.type === "text_delta") {
            buffer += event.delta.text;
          }
        }

        // Parse and send the result
        const jsonText = buffer.replace(/^```json\s*/i, "").replace(/```\s*$/i, "").trim();
        const parsed = JSON.parse(jsonText);
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: "result", data: parsed })}\n\n`));
        controller.enqueue(encoder.encode("data: [DONE]\n\n"));
        controller.close();
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
