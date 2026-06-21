import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { normalizeShopDomain } from "@/lib/shopify";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Connects a Shopify store using an Admin API access token from a custom app
// created in the store admin (Settings → Apps → Develop apps). Simpler than
// OAuth for a single store, and lets the user pick the exact scopes themselves.
export async function POST(req: Request) {
  let body: { shop?: string; token?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const shop = normalizeShopDomain(body.shop || "");
  const token = (body.token || "").trim();
  if (!shop) return NextResponse.json({ error: "Enter a valid store address (your-store.myshopify.com)." }, { status: 400 });
  if (!token) return NextResponse.json({ error: "Paste your Admin API access token." }, { status: 400 });

  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) return NextResponse.json({ error: "Please sign in." }, { status: 401 });

  // Validate the token and read its real granted scopes in one call.
  let scopes = "";
  try {
    const res = await fetch(`https://${shop}/admin/oauth/access_scopes.json`, {
      headers: { "X-Shopify-Access-Token": token },
    });
    if (res.status === 401 || res.status === 403) {
      return NextResponse.json({ error: "That token was rejected by Shopify. Double-check you copied the Admin API access token for this exact store." }, { status: 400 });
    }
    if (!res.ok) {
      return NextResponse.json({ error: `Could not verify the token (Shopify returned ${res.status}).` }, { status: 400 });
    }
    const data = await res.json();
    scopes = (data.access_scopes ?? []).map((s: { handle: string }) => s.handle).join(",");
  } catch {
    return NextResponse.json({ error: "Could not reach that store. Check the store address." }, { status: 400 });
  }

  if (!scopes.includes("write_themes")) {
    return NextResponse.json(
      { error: "This token is missing the 'write_themes' permission. Edit your custom app's Admin API scopes to include read_themes and write_themes, then create a new token." },
      { status: 400 }
    );
  }

  const admin = createAdminClient();
  if (!admin) return NextResponse.json({ error: "Server not configured." }, { status: 503 });
  const { error } = await admin.from("shopify_connections").upsert(
    {
      user_id: auth.user.id,
      shop_domain: shop,
      access_token: token,
      scope: scopes,
      installed_at: new Date().toISOString(),
    },
    { onConflict: "user_id,shop_domain" }
  );
  if (error) return NextResponse.json({ error: "Could not save the connection." }, { status: 500 });

  return NextResponse.json({ ok: true, shop, scopes });
}
