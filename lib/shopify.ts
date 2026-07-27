import crypto from "node:crypto";

// Shopify Admin API version we target (pin it so behaviour doesn't shift under us).
const API_VERSION = "2024-10";

// Permissions SpyIQ asks the merchant for. Keep this minimal — just what we need
// to create the generated store's product. Must match the app's configured scopes.
export const SHOPIFY_SCOPES = process.env.SHOPIFY_SCOPES || "read_products,write_products,read_themes,write_themes";

export function shopifyConfigured(): boolean {
  return !!(process.env.SHOPIFY_API_KEY && process.env.SHOPIFY_API_SECRET);
}

// Accepts "my-store", "my-store.myshopify.com", or a full URL and returns the
// canonical "my-store.myshopify.com", or null if it isn't a valid shop handle.
export function normalizeShopDomain(input: string): string | null {
  let s = (input || "").trim().toLowerCase();
  if (!s) return null;
  s = s.replace(/^https?:\/\//, "").replace(/\/.*$/, ""); // strip scheme + path
  if (!s.includes(".")) s = `${s}.myshopify.com`;          // bare handle → full domain
  return /^[a-z0-9][a-z0-9-]*\.myshopify\.com$/.test(s) ? s : null;
}

export function buildInstallUrl(shop: string, state: string): string {
  const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL}/api/shopify/callback`;
  const params = new URLSearchParams({
    client_id: process.env.SHOPIFY_API_KEY!,
    scope: SHOPIFY_SCOPES,
    redirect_uri: redirectUri,
    state,
  });
  return `https://${shop}/admin/oauth/authorize?${params.toString()}`;
}

// Verifies the HMAC signature Shopify attaches to OAuth/callback requests, so we
// know the request genuinely came from Shopify and wasn't tampered with.
export function verifyHmac(params: URLSearchParams): boolean {
  const secret = process.env.SHOPIFY_API_SECRET;
  if (!secret) return false;
  const hmac = params.get("hmac");
  if (!hmac) return false;

  const message = Array.from(params.entries())
    .filter(([k]) => k !== "hmac" && k !== "signature")
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([k, v]) => `${k}=${v}`)
    .join("&");

  const digest = crypto.createHmac("sha256", secret).update(message).digest("hex");
  const a = Buffer.from(digest, "utf8");
  const b = Buffer.from(hmac, "utf8");
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

// Swaps the short-lived `code` from the callback for a permanent access token.
export async function exchangeCodeForToken(
  shop: string,
  code: string
): Promise<{ access_token: string; scope: string }> {
  const res = await fetch(`https://${shop}/admin/oauth/access_token`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({
      client_id: process.env.SHOPIFY_API_KEY,
      client_secret: process.env.SHOPIFY_API_SECRET,
      code,
    }),
  });
  if (!res.ok) {
    throw new Error(`Token exchange failed (${res.status})`);
  }
  return res.json();
}

// Minimal shape of the generated store we read when building a Shopify product.
interface StoreForProduct {
  brand?: { store_name?: string; tagline?: string };
  product_page?: {
    seo_title?: string;
    headline?: string;
    description_p1?: string;
    description_p2?: string;
    description_p3?: string;
    bullets?: string[];
    faq?: { q: string; a: string }[];
    price?: string;
    compare_price?: string;
    images?: string[];
  };
}

// Turns the builder's images into Shopify image payloads. Handles both
// uploaded data-URLs (sent as base64 via `attachment`) and ordinary image
// URLs (sent via `src` for Shopify to fetch). Anything else is skipped.
type ShopifyImage = { attachment: string } | { src: string };
function buildImages(store: StoreForProduct): ShopifyImage[] {
  return (store.product_page?.images ?? [])
    .map((src): ShopifyImage | null => {
      const m = /^data:image\/[^;]+;base64,(.+)$/.exec(src);
      if (m) return { attachment: m[1] };
      if (/^https?:\/\//i.test(src)) return { src };
      return null;
    })
    .filter((x): x is ShopifyImage => x !== null);
}

function escapeHtml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function buildBodyHtml(store: StoreForProduct): string {
  const pp = store.product_page ?? {};
  const parts: string[] = [];
  for (const p of [pp.description_p1, pp.description_p2, pp.description_p3]) {
    if (p) parts.push(`<p>${escapeHtml(p)}</p>`);
  }
  if (pp.bullets?.length) {
    parts.push(`<ul>${pp.bullets.map((b) => `<li>${escapeHtml(b)}</li>`).join("")}</ul>`);
  }
  if (pp.faq?.length) {
    parts.push("<h3>FAQ</h3>");
    for (const f of pp.faq) {
      parts.push(`<p><strong>${escapeHtml(f.q)}</strong><br>${escapeHtml(f.a)}</p>`);
    }
  }
  return parts.join("\n");
}

// Creates the generated store's product in the connected Shopify store. Created as
// a draft so the merchant reviews it before it goes live. Returns the new product id
// and a link to it in their Shopify admin.
export async function createProduct(
  shop: string,
  accessToken: string,
  store: StoreForProduct,
  opts: { status?: "draft" | "active" } = {}
): Promise<{ id: number; adminUrl: string }> {
  const title =
    store.product_page?.headline ||
    store.product_page?.seo_title ||
    store.brand?.store_name ||
    "New Product";

  const price = store.product_page?.price || "39.99";
  const comparePrice = store.product_page?.compare_price;
  const variant: { price: string; compare_at_price?: string } = { price };
  if (comparePrice && parseFloat(comparePrice) > parseFloat(price)) {
    variant.compare_at_price = comparePrice;
  }

  const images = buildImages(store);

  const payload = {
    product: {
      title,
      body_html: buildBodyHtml(store),
      vendor: store.brand?.store_name || "SpyIQ",
      status: opts.status ?? "draft",
      variants: [variant],
      ...(images.length > 0 ? { images } : {}),
    },
  };

  const res = await fetch(`https://${shop}/admin/api/${API_VERSION}/products.json`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Access-Token": accessToken,
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Shopify product create failed (${res.status}): ${text.slice(0, 200)}`);
  }

  const data = await res.json();
  const id = data.product?.id as number;
  // Use the modern admin URL (admin.shopify.com/store/<handle>/...) — the old
  // <shop>.myshopify.com/admin/... format now often opens a blank page.
  const handle = shop.replace(/\.myshopify\.com$/, "");
  return { id, adminUrl: `https://admin.shopify.com/store/${handle}/products/${id}` };
}

// ---------------------------------------------------------------------------
// Full-store publishing: write the generated homepage into the live theme.
// ---------------------------------------------------------------------------

// Loose shape of the generated store, just the bits we render on the homepage.
interface StoreForTheme {
  brand?: { store_name?: string; tagline?: string; color_palette?: string[]; font_display?: string; font_body?: string };
  home_page?: {
    hero_headline?: string; hero_sub?: string; cta_primary?: string; cta_secondary?: string;
    social_proof?: string; announcement?: string; rating?: string; review_count?: string;
    reviews?: { name: string; text: string }[]; steps?: { title: string; body: string }[];
    features?: { icon: string; title: string; body: string }[]; comparison?: string[];
    stats?: { value: string; label: string }[]; hero_image?: string;
  };
  product_page?: { faq?: { q: string; a: string }[] };
}

// Builds the homepage markup (inline-styled HTML) that mirrors the SpyIQ preview.
export function buildHomeHtml(store: StoreForTheme): string {
  const b = store.brand ?? {};
  const h = store.home_page ?? {};
  const e = escapeHtml;
  const accent = (b.color_palette && b.color_palette[0]) || "#a07840";
  const accent2 = (b.color_palette && b.color_palette[1]) || accent;
  const name = e(b.store_name || "Your Store");
  const displayFont = `${b.font_display || "Georgia"}, Georgia, serif`;
  const p: string[] = [];

  p.push(`<div style="font-family:${b.font_body || "system-ui"},sans-serif;color:#1a1a1a;">`);

  if (h.announcement) p.push(`<div style="background:${accent};color:#fff;text-align:center;padding:8px 16px;font-size:12px;">${e(h.announcement)}</div>`);

  p.push(`<section style="background:#faf9f7;padding:56px 24px;text-align:center;">
    <h1 style="font-family:${displayFont};font-size:36px;line-height:1.15;color:#161616;max-width:680px;margin:0 auto 12px;">${e(h.hero_headline || "")}</h1>
    <p style="font-size:17px;color:#555;max-width:540px;margin:0 auto 24px;">${e(h.hero_sub || "")}</p>
    <a href="/collections/all" style="display:inline-block;background:${accent};color:#fff;padding:14px 28px;border-radius:8px;font-weight:600;text-decoration:none;">${e(h.cta_primary || "Shop now")}</a>`);
  if (h.hero_image && h.hero_image.length < 700000) p.push(`<div style="margin-top:28px;"><img src="${h.hero_image}" alt="" style="max-width:560px;width:100%;border-radius:16px;"/></div>`);
  p.push(`</section>`);

  if (h.social_proof) p.push(`<div style="background:${accent2};color:#fff;text-align:center;padding:14px 24px;font-size:14px;">★★★★★ ${e(h.social_proof)}</div>`);

  if (h.reviews?.length) {
    p.push(`<section style="padding:48px 24px;max-width:900px;margin:0 auto;"><div style="text-align:center;margin-bottom:24px;color:#555;">★★★★★<br/>Rated ${e(h.rating || "4.8")} by ${e(h.review_count || "")} happy customers</div><div style="display:flex;gap:16px;flex-wrap:wrap;justify-content:center;">`);
    for (const r of h.reviews) p.push(`<div style="flex:1;min-width:220px;background:#faf9f7;border:1px solid #eee;border-radius:12px;padding:16px;"><div style="color:#f5a623;">★★★★★</div><p style="color:#444;margin:8px 0;">&ldquo;${e(r.text)}&rdquo;</p><p style="font-weight:600;font-size:13px;">— ${e(r.name)}</p></div>`);
    p.push(`</div></section>`);
  }

  if (h.steps?.length) {
    p.push(`<section style="padding:48px 24px;max-width:900px;margin:0 auto;text-align:center;border-top:1px solid #eee;"><h2 style="font-family:${displayFont};font-size:24px;margin-bottom:24px;color:#161616;">How it works</h2><div style="display:flex;gap:24px;flex-wrap:wrap;justify-content:center;">`);
    h.steps.forEach((s, i) => p.push(`<div style="flex:1;min-width:200px;"><div style="width:40px;height:40px;border-radius:50%;background:${accent};color:#fff;font-weight:700;display:flex;align-items:center;justify-content:center;margin:0 auto 12px;">${i + 1}</div><p style="font-weight:600;color:#161616;">${e(s.title)}</p><p style="color:#666;font-size:14px;">${e(s.body)}</p></div>`));
    p.push(`</div></section>`);
  }

  if (h.features?.length) {
    p.push(`<section style="padding:48px 24px;max-width:840px;margin:0 auto;display:flex;gap:24px;flex-wrap:wrap;text-align:center;">`);
    for (const f of h.features) p.push(`<div style="flex:1;min-width:200px;"><div style="font-size:30px;margin-bottom:8px;">${e(f.icon)}</div><p style="font-weight:600;color:#161616;">${e(f.title)}</p><p style="color:#666;font-size:14px;">${e(f.body)}</p></div>`);
    p.push(`</section>`);
  }

  if (h.comparison?.length) {
    p.push(`<section style="padding:48px 24px;max-width:680px;margin:0 auto;border-top:1px solid #eee;"><h2 style="font-family:${displayFont};font-size:24px;text-align:center;margin-bottom:24px;color:#161616;">Why choose ${name}</h2><div style="border:1px solid #eee;border-radius:12px;overflow:hidden;"><div style="display:grid;grid-template-columns:1fr 1fr 1fr;background:#faf9f7;font-weight:600;font-size:14px;"><div style="padding:12px 16px;">Feature</div><div style="padding:12px 16px;text-align:center;color:${accent};">${name}</div><div style="padding:12px 16px;text-align:center;color:#999;">Others</div></div>`);
    for (const c of h.comparison) p.push(`<div style="display:grid;grid-template-columns:1fr 1fr 1fr;border-top:1px solid #eee;font-size:14px;"><div style="padding:12px 16px;color:#444;">${e(c)}</div><div style="padding:12px 16px;text-align:center;color:#3a9d7a;font-weight:700;">✓</div><div style="padding:12px 16px;text-align:center;color:#d4685f;font-weight:700;">✕</div></div>`);
    p.push(`</div></section>`);
  }

  if (h.stats?.length) {
    p.push(`<section style="padding:48px 24px;background:#faf9f7;border-top:1px solid #eee;"><div style="display:flex;gap:16px;max-width:700px;margin:0 auto;text-align:center;flex-wrap:wrap;">`);
    for (const s of h.stats) p.push(`<div style="flex:1;min-width:150px;"><p style="font-size:26px;font-weight:700;color:${accent};">${e(s.value)}</p><p style="color:#666;font-size:13px;">${e(s.label)}</p></div>`);
    p.push(`</div></section>`);
  }

  if (store.product_page?.faq?.length) {
    p.push(`<section style="padding:48px 24px;max-width:680px;margin:0 auto;border-top:1px solid #eee;"><h2 style="font-family:${displayFont};font-size:24px;text-align:center;margin-bottom:20px;color:#161616;">Frequently asked questions</h2>`);
    for (const f of store.product_page.faq) p.push(`<div style="background:#faf9f7;border:1px solid #eee;border-radius:12px;padding:16px;margin-bottom:12px;"><p style="font-weight:600;font-size:14px;color:#161616;">${e(f.q)}</p><p style="color:#666;font-size:14px;">${e(f.a)}</p></div>`);
    p.push(`</section>`);
  }

  p.push(`<footer style="background:#161616;color:#cfcfcf;text-align:center;padding:32px 24px;"><p style="font-family:${displayFont};font-size:18px;color:#fff;font-weight:700;">${name}</p><p style="color:#9a9a9a;font-size:14px;">${e(b.tagline || "")}</p></footer>`);
  p.push(`</div>`);
  return p.join("\n");
}

// Finds the store's currently published ("main") theme.
async function getMainThemeId(shop: string, accessToken: string): Promise<number> {
  const res = await fetch(`https://${shop}/admin/api/${API_VERSION}/themes.json`, {
    headers: { "X-Shopify-Access-Token": accessToken },
  });
  if (!res.ok) throw new Error(`themes list failed (${res.status})`);
  const data = await res.json();
  const main = (data.themes ?? []).find((t: { role?: string }) => t.role === "main");
  if (!main) throw new Error("no main theme found");
  return main.id as number;
}

// Writes (creates or overwrites) a single theme file.
async function putThemeAsset(shop: string, accessToken: string, themeId: number, key: string, value: string): Promise<void> {
  const res = await fetch(`https://${shop}/admin/api/${API_VERSION}/themes/${themeId}/assets.json`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", "X-Shopify-Access-Token": accessToken },
    body: JSON.stringify({ asset: { key, value } }),
  });
  if (!res.ok) {
    const t = await res.text().catch(() => "");
    throw new Error(`asset ${key} failed (${res.status}): ${t.slice(0, 200)}`);
  }
}

// Publishes the generated homepage into the live theme: adds a custom section
// with our HTML and points the homepage template at it.
export async function publishStoreTheme(
  shop: string,
  accessToken: string,
  store: StoreForTheme
): Promise<{ themeId: number; storeUrl: string; editorUrl: string }> {
  const themeId = await getMainThemeId(shop, accessToken);

  // {% raw %} guards against any literal {{ }} in the user's copy breaking Liquid.
  const section = `{% raw %}\n${buildHomeHtml(store)}\n{% endraw %}\n{% schema %}\n{ "name": "SpyIQ Home", "settings": [] }\n{% endschema %}`;
  await putThemeAsset(shop, accessToken, themeId, "sections/spyiq-home.liquid", section);

  const indexJson = JSON.stringify(
    { sections: { spyiq_home: { type: "spyiq-home", settings: {} } }, order: ["spyiq_home"] },
    null,
    2
  );
  await putThemeAsset(shop, accessToken, themeId, "templates/index.json", indexJson);

  const handle = shop.replace(/\.myshopify\.com$/, "");
  return {
    themeId,
    storeUrl: `https://${shop}`,
    editorUrl: `https://admin.shopify.com/store/${handle}/themes/${themeId}/editor`,
  };
}
