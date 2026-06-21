import { NextRequest, NextResponse } from "next/server";
import crypto from "node:crypto";
import { createClient } from "@/lib/supabase/server";
import { normalizeShopDomain, buildInstallUrl, shopifyConfigured } from "@/lib/shopify";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  if (!shopifyConfigured()) {
    return NextResponse.json(
      { error: "Shopify integration is not configured yet (missing API credentials)." },
      { status: 503 }
    );
  }

  // Must be a signed-in SpyIQ user — we link the connection to their account.
  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) {
    return NextResponse.redirect(new URL("/login?next=/settings", req.url));
  }

  const shop = normalizeShopDomain(req.nextUrl.searchParams.get("shop") || "");
  if (!shop) {
    return NextResponse.json(
      { error: "Enter a valid Shopify store address, e.g. my-store.myshopify.com" },
      { status: 400 }
    );
  }

  // CSRF protection: random state echoed back by Shopify and checked in the callback.
  const state = crypto.randomBytes(16).toString("hex");
  const res = NextResponse.redirect(buildInstallUrl(shop, state));
  res.cookies.set("shopify_oauth_state", state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 600,
    path: "/",
  });
  return res;
}
