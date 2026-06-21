import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { normalizeShopDomain, verifyHmac, exchangeCodeForToken } from "@/lib/shopify";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function fail(req: NextRequest, reason: string) {
  return NextResponse.redirect(new URL(`/settings?shopify=error&reason=${reason}`, req.url));
}

export async function GET(req: NextRequest) {
  const params = req.nextUrl.searchParams;

  // 1) Authenticity: signature + state cookie must check out.
  if (!verifyHmac(params)) return fail(req, "bad_signature");

  const state = params.get("state");
  const cookieState = req.cookies.get("shopify_oauth_state")?.value;
  if (!state || !cookieState || state !== cookieState) return fail(req, "bad_state");

  const shop = normalizeShopDomain(params.get("shop") || "");
  const code = params.get("code");
  if (!shop || !code) return fail(req, "bad_request");

  // 2) Must still be the signed-in user who started the flow.
  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) return NextResponse.redirect(new URL("/login?next=/settings", req.url));

  // 3) Exchange code → permanent access token.
  let token: { access_token: string; scope: string };
  try {
    token = await exchangeCodeForToken(shop, code);
  } catch {
    return fail(req, "token_exchange");
  }

  // 4) Persist (service role — bypasses RLS). Upsert so reconnecting just updates.
  const admin = createAdminClient();
  if (!admin) return fail(req, "server_config");
  const { error } = await admin.from("shopify_connections").upsert(
    {
      user_id: auth.user.id,
      shop_domain: shop,
      access_token: token.access_token,
      scope: token.scope,
      installed_at: new Date().toISOString(),
    },
    { onConflict: "user_id,shop_domain" }
  );
  if (error) return fail(req, "save_failed");

  const res = NextResponse.redirect(new URL("/settings?shopify=connected", req.url));
  res.cookies.delete("shopify_oauth_state");
  return res;
}
