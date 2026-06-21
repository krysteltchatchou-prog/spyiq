import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { MOCK_ADS, type Ad } from "@/lib/ads-data";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const platform = searchParams.get("platform"); // e.g. "TikTok" or "All"
  const keyword = (searchParams.get("keyword") || "").trim().toLowerCase();

  let ads: Ad[] | null = null;

  // Try Supabase first
  try {
    const supabase = await createClient();
    let query = supabase.from("ads").select("*").order("engagement_rate", { ascending: false }).limit(200);
    if (platform && platform !== "All") query = query.eq("platform", platform);
    if (keyword) query = query.or(`product_name.ilike.%${keyword}%,hook_text.ilike.%${keyword}%,niche.ilike.%${keyword}%`);
    const { data, error } = await query;
    if (!error && data && data.length > 0) ads = data as Ad[];
  } catch {
    /* fall back to mock */
  }

  // Mock fallback (filtered in-memory)
  if (!ads) {
    ads = [...MOCK_ADS];
    if (platform && platform !== "All") ads = ads.filter((a) => a.platform === platform);
    if (keyword) {
      ads = ads.filter(
        (a) =>
          a.product_name.toLowerCase().includes(keyword) ||
          a.hook_text.toLowerCase().includes(keyword) ||
          a.niche.toLowerCase().includes(keyword)
      );
    }
    ads.sort((a, b) => b.engagement_rate - a.engagement_rate);
  }

  return NextResponse.json({ ads, count: ads.length });
}
