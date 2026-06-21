import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { createProduct } from "@/lib/shopify";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Creates the generated store's product (as a draft) in the user's connected
// Shopify store. Body: { store: GeneratedStore }.
export async function POST(req: Request) {
  let body: { store?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
  if (!body.store || typeof body.store !== "object") {
    return NextResponse.json({ error: "Missing store data to push." }, { status: 400 });
  }

  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) return NextResponse.json({ error: "Please sign in." }, { status: 401 });

  // Read the connection (incl. token) via service role.
  const admin = createAdminClient();
  if (!admin) return NextResponse.json({ error: "Server not configured." }, { status: 503 });
  const { data: conn } = await admin
    .from("shopify_connections")
    .select("shop_domain, access_token")
    .eq("user_id", auth.user.id)
    .maybeSingle();

  if (!conn) {
    return NextResponse.json(
      { error: "No Shopify store connected. Connect one in Settings first.", needsConnection: true },
      { status: 409 }
    );
  }

  try {
    const result = await createProduct(conn.shop_domain, conn.access_token, body.store as object);
    return NextResponse.json({ ok: true, productUrl: result.adminUrl, shop: conn.shop_domain });
  } catch (e) {
    console.error("[shopify/push] failed:", e);
    return NextResponse.json(
      { error: "Could not push to Shopify. Your connection may have expired — try reconnecting in Settings." },
      { status: 502 }
    );
  }
}
