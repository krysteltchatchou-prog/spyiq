import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { shopifyConfigured } from "@/lib/shopify";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Tells the UI whether the current user has a connected Shopify store. Never
// returns the access token — just the shop domain + connected flag.
export async function GET() {
  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) return NextResponse.json({ connected: false, configured: shopifyConfigured() });

  const { data } = await supabase
    .from("shopify_connections")
    .select("shop_domain, installed_at")
    .eq("user_id", auth.user.id)
    .maybeSingle();

  return NextResponse.json({
    connected: !!data,
    shop: data?.shop_domain ?? null,
    configured: shopifyConfigured(),
  });
}
