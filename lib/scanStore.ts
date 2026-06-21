import { detectApps, type DetectedApp } from "@/lib/detectApps";
import { NICHES } from "@/lib/constants";

export interface ScanProduct {
  title: string;
  price: number;
  image: string | null;
  handle: string;
}

export interface ScanResult {
  store_id: string;
  store_url: string;
  store_name: string;
  niche: string;
  country: string;
  product_count: number;
  avg_product_price: number;
  monthly_traffic_est: number;
  monthly_revenue_est: number;
  monthly_ad_spend_est: number;
  top_products: ScanProduct[];
  installed_apps: DetectedApp[];
  theme_name: string | null;
  social_links: Record<string, string>;
  store_age_days: number | null;
  scanned_at: string;
  is_shopify: boolean;
}

const CONVERSION_RATE = 0.02; // 2% — revenue = visits × CR × avg price

/** Normalize any user input into a clean https origin + a url-safe slug. */
export function normalizeStoreUrl(input: string): { origin: string; host: string; slug: string } {
  let raw = input.trim();
  if (!/^https?:\/\//i.test(raw)) raw = "https://" + raw;
  const u = new URL(raw);
  const host = u.hostname.replace(/^www\./, "");
  const slug = host.replace(/[^a-z0-9]+/gi, "-").toLowerCase();
  return { origin: `https://${host}`, host, slug };
}

function decodeEntities(s: string): string {
  const named: Record<string, string> = { "&amp;": "&", "&lt;": "<", "&gt;": ">", "&quot;": '"', "&#39;": "'", "&apos;": "'", "&nbsp;": " " };
  return s
    .replace(/&amp;|&lt;|&gt;|&quot;|&#39;|&apos;|&nbsp;/g, (m) => named[m])
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(+n));
}

function hashSeed(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); }
  return Math.abs(h);
}

/** Deterministic monthly-traffic estimate from store signals. */
function estimateTraffic(host: string, productCount: number, appCount: number): number {
  const seed = hashSeed(host);
  // Base scales with catalog size and martech stack depth (a proxy for maturity).
  const base = 8000 + productCount * 140 + appCount * 2600;
  const variance = (seed % 1000) / 1000;       // 0–1
  return Math.round(base * (0.7 + variance * 1.6));
}

function guessNiche(text: string): string {
  const t = text.toLowerCase();
  const map: Record<string, string> = {
    Beauty: "beauty|skincare|cosmetic|makeup|serum|lash|hair",
    Fashion: "apparel|clothing|fashion|wear|shirt|dress|jacket|shoes|jewelry|jewellery|watch",
    "Home & Garden": "home|decor|kitchen|garden|lamp|furniture|bedding|candle",
    Electronics: "electronic|gadget|charger|headphone|speaker|tech|cable|earbud",
    Sports: "fitness|gym|sport|workout|yoga|resistance|training",
    Pets: "pet|dog|cat|puppy|kitten|aquarium",
    Kids: "kids|baby|toddler|toy|child|nursery",
    "Health & Wellness": "health|wellness|massage|posture|supplement|vitamin|sleep",
    Automotive: "car|auto|vehicle|motorc|truck",
    "Food & Beverage": "coffee|tea|food|snack|drink|beverage|bottle|cup",
  };
  for (const niche of NICHES) {
    const re = map[niche];
    if (re && new RegExp(re).test(t)) return niche;
  }
  return "General";
}

function extractSocialLinks(html: string): Record<string, string> {
  const links: Record<string, string> = {};
  const patterns: Record<string, RegExp> = {
    instagram: /https?:\/\/(www\.)?instagram\.com\/[A-Za-z0-9_.]+/i,
    tiktok: /https?:\/\/(www\.)?tiktok\.com\/@[A-Za-z0-9_.]+/i,
    facebook: /https?:\/\/(www\.)?facebook\.com\/[A-Za-z0-9_.\-]+/i,
    youtube: /https?:\/\/(www\.)?youtube\.com\/[A-Za-z0-9_.@\-/]+/i,
    twitter: /https?:\/\/(www\.)?(twitter|x)\.com\/[A-Za-z0-9_]+/i,
  };
  for (const [k, re] of Object.entries(patterns)) {
    const m = html.match(re);
    if (m) links[k] = m[0];
  }
  return links;
}

function extractTheme(html: string): string | null {
  const m = html.match(/Shopify\.theme\s*=\s*\{[^}]*"name":"([^"]+)"/i)
    || html.match(/"theme_name":"([^"]+)"/i);
  return m ? m[1] : null;
}

interface ShopifyProductJson {
  title: string;
  handle: string;
  published_at?: string;
  created_at?: string;
  images?: { src: string }[];
  variants?: { price: string }[];
}

/** Scan any Shopify store URL using only public endpoints. */
export async function scanStore(input: string): Promise<ScanResult> {
  const { origin, host, slug } = normalizeStoreUrl(input);

  // 1. Public products feed
  let products: ShopifyProductJson[] = [];
  let isShopify = false;
  try {
    const res = await fetch(`${origin}/products.json?limit=250`, {
      headers: { "User-Agent": "Mozilla/5.0 (compatible; SpyIQBot/1.0)" },
      cache: "no-store",
    });
    if (res.ok) {
      const json = await res.json();
      if (Array.isArray(json.products)) { products = json.products; isShopify = true; }
    }
  } catch { /* not reachable / not Shopify */ }

  // 2. Homepage HTML for app detection + metadata
  let html = "";
  try {
    const res = await fetch(origin, {
      headers: { "User-Agent": "Mozilla/5.0 (compatible; SpyIQBot/1.0)" },
      cache: "no-store",
    });
    if (res.ok) html = await res.text();
    if (/cdn\.shopify\.com|Shopify\.theme|shopify-section/i.test(html)) isShopify = true;
  } catch { /* ignore */ }

  const installed_apps = detectApps(html);

  const prices = products
    .map((p) => parseFloat(p.variants?.[0]?.price ?? "0"))
    .filter((n) => n > 0);
  const avg_product_price = prices.length
    ? Math.round((prices.reduce((a, b) => a + b, 0) / prices.length) * 100) / 100
    : 0;
  const product_count = products.length;

  const top_products: ScanProduct[] = products.slice(0, 6).map((p) => ({
    title: p.title,
    price: parseFloat(p.variants?.[0]?.price ?? "0") || 0,
    image: p.images?.[0]?.src ?? null,
    handle: p.handle,
  }));

  const monthly_traffic_est = estimateTraffic(host, product_count, installed_apps.length);
  const monthly_revenue_est = Math.round(monthly_traffic_est * CONVERSION_RATE * avg_product_price);
  // Ad spend ≈ 15–25% of revenue, deterministic per store
  const monthly_ad_spend_est = Math.round(monthly_revenue_est * (0.15 + (hashSeed(host) % 100) / 1000));

  // Store age from earliest product publish date, if available
  let store_age_days: number | null = null;
  const dates = products
    .map((p) => p.published_at || p.created_at)
    .filter(Boolean)
    .map((d) => new Date(d as string).getTime())
    .filter((t) => !isNaN(t));
  if (dates.length) {
    store_age_days = Math.round((Date.now() - Math.min(...dates)) / 86_400_000);
  }

  const nicheText = products.slice(0, 30).map((p) => p.title).join(" ") + " " + html.slice(0, 4000);
  const niche = guessNiche(nicheText);

  const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
  const store_name = titleMatch ? decodeEntities(titleMatch[1].split(/[|\-–—]/)[0].trim()) : host;

  return {
    store_id: slug,
    store_url: origin,
    store_name: store_name || host,
    niche,
    country: "Unknown",
    product_count,
    avg_product_price,
    monthly_traffic_est,
    monthly_revenue_est,
    monthly_ad_spend_est,
    top_products,
    installed_apps,
    theme_name: extractTheme(html),
    social_links: extractSocialLinks(html),
    store_age_days,
    scanned_at: new Date().toISOString(),
    is_shopify: isShopify,
  };
}
