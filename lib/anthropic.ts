import Anthropic from "@anthropic-ai/sdk";

export const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export const SPYIQ_SYSTEM_PROMPT = `You are SpyIQ, an expert AI ecommerce intelligence assistant for Shopify and dropshipping entrepreneurs. You have deep knowledge of:
- Product research and winner identification
- Shopify store optimization
- Dropshipping supplier sourcing
- Facebook and TikTok ad strategy
- Niche selection and market sizing
- Competitor analysis
- Pricing strategy

Always be specific, data-driven, and actionable. Give concrete recommendations.
When analyzing a product, always mention: demand, competition, margin potential, target audience, and one risk factor. Use numbers when possible.
Keep responses concise but comprehensive. Use bullet points for lists.`;

export async function generateIQScore(productName: string, niche: string) {
  const msg = await anthropic.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 500,
    system: "Return only valid JSON. No markdown.",
    messages: [{
      role: "user",
      content: `Generate a realistic IQ score breakdown for dropshipping product: "${productName}" in niche: "${niche}".
      Return JSON: { iq_score, demand_score, competition_score, margin_pct, viral_score, reasoning }`,
    }],
  });
  return JSON.parse((msg.content[0] as { type: "text"; text: string }).text);
}

export async function analyzeStore(domain: string) {
  const msg = await anthropic.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 1000,
    system: "Return only valid JSON. No markdown.",
    messages: [{
      role: "user",
      content: `Generate a realistic Shopify store intelligence report for: ${domain}
      Return JSON: { store_name, niche, monthly_revenue_est, monthly_traffic_est, products_count,
        avg_order_value, ad_spend_monthly_est, founded_year, top_products, traffic_sources, ai_verdict }`,
    }],
  });
  return JSON.parse((msg.content[0] as { type: "text"; text: string }).text);
}
