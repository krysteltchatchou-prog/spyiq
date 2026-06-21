import { NextResponse } from "next/server";
import { scanStore } from "@/lib/scanStore";
import { createAdminClient } from "@/lib/supabase/admin";
import { checkRateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const fallbackId = req.headers.get("x-forwarded-for") ?? "anonymous";
  const { success, plan, limit } = await checkRateLimit("stores", fallbackId);
  if (!success) {
    return NextResponse.json(
      { error: `You've hit your daily store-analysis limit (${limit}/day on the ${plan} plan). Upgrade to analyze more stores.` },
      { status: 429 }
    );
  }

  let url = "";
  try {
    const body = await req.json();
    url = (body?.url ?? "").toString();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  if (!url.trim()) {
    return NextResponse.json({ error: "Please provide a store URL." }, { status: 400 });
  }

  let result;
  try {
    result = await scanStore(url);
  } catch {
    return NextResponse.json(
      { error: "Could not reach that store. Check the URL and try again." },
      { status: 502 }
    );
  }

  if (!result.is_shopify && result.product_count === 0) {
    return NextResponse.json(
      { error: "This doesn't look like a public Shopify store, or it blocks scanning." },
      { status: 422 }
    );
  }

  // Persist the scan to the shared `shops` table (best-effort; never blocks the response).
  try {
    const admin = createAdminClient();
    if (admin) {
      await admin.from("shops").upsert(
        {
          store_id: result.store_id,
          store_url: result.store_url,
          store_name: result.store_name,
          niche: result.niche,
          country: result.country,
          monthly_revenue_est: result.monthly_revenue_est,
          monthly_traffic_est: result.monthly_traffic_est,
          monthly_ad_spend_est: result.monthly_ad_spend_est,
          top_products: result.top_products,
          installed_apps: result.installed_apps,
          theme_name: result.theme_name,
          social_links: result.social_links,
          avg_product_price: result.avg_product_price,
          product_count: result.product_count,
          store_age_days: result.store_age_days,
          last_scanned: result.scanned_at,
        },
        { onConflict: "store_id" }
      );
    }
  } catch {
    /* DB not configured — return the scan anyway */
  }

  return NextResponse.json({ result });
}
