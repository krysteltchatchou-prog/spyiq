import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { aiRatelimit } from "@/lib/redis";

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const SYSTEM_PROMPT = `You are SpyIQ, an expert AI ecommerce intelligence assistant for Shopify and dropshipping entrepreneurs. You have deep knowledge of:
- Product research and winner identification
- Shopify store optimization
- Dropshipping supplier sourcing
- Facebook and TikTok ad strategy
- Niche selection and market sizing
- Competitor analysis
- Pricing strategy

Always be specific, data-driven, and actionable. Give concrete recommendations.
When analyzing a product, always mention: demand, competition, margin potential, target audience, and one risk factor. Use numbers when possible.
Keep responses concise but comprehensive. Use bullet points for lists. Use markdown formatting.`;

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") ?? "anonymous";
  const { success } = await aiRatelimit.limit(ip);
  if (!success) {
    return NextResponse.json({ error: "Rate limit reached. Upgrade your plan for more AI credits." }, { status: 429 });
  }

  const { messages } = await req.json();

  const stream = await anthropic.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 1024,
    system: SYSTEM_PROMPT,
    messages,
    stream: true,
  });

  const encoder = new TextEncoder();
  const readable = new ReadableStream({
    async start(controller) {
      for await (const event of stream) {
        if (event.type === "content_block_delta" && event.delta.type === "text_delta") {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text: event.delta.text })}\n\n`));
        }
        if (event.type === "message_stop") {
          controller.enqueue(encoder.encode("data: [DONE]\n\n"));
          controller.close();
        }
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
