import { NextRequest, NextResponse } from "next/server";
import { MOCK_PRODUCTS } from "@/lib/mock-data";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const query   = searchParams.get("q")?.toLowerCase() ?? "";
  const niche   = searchParams.get("niche") ?? "";
  const minIQ   = Number(searchParams.get("minIQ") ?? 0);
  const trending= searchParams.get("trending") === "true";
  const platform= searchParams.get("platform") ?? "";
  const sortBy  = searchParams.get("sort") ?? "iq_score";

  let products = [...MOCK_PRODUCTS];

  if (query) {
    products = products.filter(
      (p) =>
        p.name.toLowerCase().includes(query) ||
        p.niche.toLowerCase().includes(query) ||
        p.keywords.some((k) => k.toLowerCase().includes(query))
    );
  }
  if (niche)     products = products.filter((p) => p.niche.toLowerCase() === niche.toLowerCase());
  if (minIQ > 0) products = products.filter((p) => p.iq_score >= minIQ);
  if (trending)  products = products.filter((p) => p.is_trending);
  if (platform)  products = products.filter((p) => p.platforms.some((pl) => pl.toLowerCase() === platform.toLowerCase()));

  products.sort((a, b) => {
    if (sortBy === "sales")   return b.monthly_sales_est - a.monthly_sales_est;
    if (sortBy === "margin")  return b.margin_pct - a.margin_pct;
    if (sortBy === "viral")   return b.viral_score - a.viral_score;
    return b.iq_score - a.iq_score;
  });

  return NextResponse.json({ products, total: products.length });
}
