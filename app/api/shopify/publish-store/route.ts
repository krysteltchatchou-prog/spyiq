import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { createProduct, publishStoreTheme } from "@/lib/shopify";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Publishes the whole generated store: creates the product AND writes the
// generated homepage into the connected store's live theme. Body: { store }.
export async function POST(req: Request) {
  let body: { store?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
  if (!body.store || typeof body.store !== "object") {
    return NextResponse.json({ error: "Missing store data to publish." }, { status: 400 });
  }

  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) return NextResponse.json({ error: "Please sign in." }, { status: 401 });

  const admin = createAdminClient();
  if (!admin) return NextResponse.json({ error: "Server not configured." }, { status: 503 });
  const { data: conn } = await admin
    .from("shopify_connections")
    .select("shop_domain, access_token, scope")
    .eq("user_id", auth.user.id)
    .maybeSingle();

  if (!conn) {
    return NextResponse.json(
      { error: "No Shopify store connected. Connect one in Settings first.", needsConnection: true },
      { status: 409 }
    );
  }

  // Theme publishing needs the write_themes permission. If the connection was
  // made before we asked for it, tell the user to reconnect.
  if (!conn.scope || !conn.scope.includes("write_themes")) {
    return NextResponse.json(
      {
        error: "Reconnect your Shopify store to grant theme access (Settings → Integrations → Connect again).",
        needsReconnect: true,
      },
      { status: 403 }
    );
  }

  const store = body.store as object;
  try {
    // 1) Create the product so the store has something to sell.
    let productUrl: string | null = null;
    try {
      // Full-store publish goes live, so the product should be active (visible)
      // — unlike the standalone "push product" path, which stays a draft.
      const product = await createProduct(conn.shop_domain, conn.access_token, store, { status: "active" });
      productUrl = product.adminUrl;
    } catch (e) {
      console.error("[publish-store] product create failed:", e);
      // Non-fatal: continue to publish the homepage even if the product fails.
    }

    // 2) Write the generated homepage into the live theme.
    const theme = await publishStoreTheme(conn.shop_domain, conn.access_token, store);

    return NextResponse.json({
      ok: true,
      storeUrl: theme.storeUrl,
      editorUrl: theme.editorUrl,
      productUrl,
      shop: conn.shop_domain,
    });
  } catch (e) {
    console.error("[publish-store] failed:", e);
    return NextResponse.json(
      { error: "Could not publish the store. Your theme may be incompatible, or the connection expired — try reconnecting in Settings." },
      { status: 502 }
    );
  }
}
