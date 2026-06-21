import { createClient } from "@/lib/supabase/server";
import { iqScoreFromProduct } from "@/lib/iqScore";

export interface Supplier {
  name: string;
  url: string;
  price: number;
}

export interface TopStore {
  name: string;
  domain: string;
}

export interface BoardProduct {
  product_id: string;
  name: string;
  emoji: string;
  niche: string;
  image_url: string | null;
  price_usd: number;
  cogs_est: number;
  margin_pct: number;
  stores_count: number;
  monthly_sales_est: number;
  monthly_revenue_est: number;
  search_volume: number;
  search_growth: number;
  ad_count: number;
  competition_level: "low" | "medium" | "high";
  iq_score: number;
  trend_direction: "up" | "down" | "flat";
  suppliers: Supplier[];
  top_stores: TopStore[];
  is_featured: boolean;
}

// ─── Seed data (used when the Supabase `products` table is empty/unconfigured) ──

type Seed = Omit<BoardProduct, "iq_score" | "monthly_revenue_est" | "margin_pct" | "cogs_est" | "suppliers" | "top_stores"> & {
  cogs_est: number;
};

function build(seed: Seed): BoardProduct {
  const margin_pct = Math.round(((seed.price_usd - seed.cogs_est) / seed.price_usd) * 100);
  const monthly_revenue_est = Math.round(seed.monthly_sales_est * seed.price_usd);
  const iq_score = iqScoreFromProduct({
    monthly_sales_est: seed.monthly_sales_est,
    margin_pct,
    search_growth: seed.search_growth,
    competition_level: seed.competition_level,
  });
  const slug = seed.product_id;
  return {
    ...seed,
    margin_pct,
    monthly_revenue_est,
    iq_score,
    suppliers: [
      { name: "AliExpress", url: `https://www.aliexpress.com/wholesale?SearchText=${encodeURIComponent(seed.name)}`, price: seed.cogs_est },
      { name: "CJ Dropshipping", url: `https://www.cjdropshipping.com/search?q=${encodeURIComponent(seed.name)}`, price: Math.round(seed.cogs_est * 1.08 * 100) / 100 },
    ],
    top_stores: [
      { name: `${seed.niche} Hub`, domain: `${slug}-hub.myshopify.com` },
      { name: `Shop ${seed.emoji}`, domain: `best-${slug}.com` },
      { name: "Trendly", domain: "trendly.store" },
    ],
  };
}

const SEEDS: Seed[] = [
  { product_id: "hydro-boost-serum", name: "Hydro-Boost Face Serum", emoji: "🧴", niche: "Beauty", image_url: null, price_usd: 34.99, cogs_est: 6.2, stores_count: 184, monthly_sales_est: 9300, search_volume: 74000, search_growth: 62, ad_count: 412, competition_level: "medium", trend_direction: "up", is_featured: true },
  { product_id: "auto-pet-feeder", name: "Auto Pet Feeder Pro", emoji: "🦮", niche: "Pets", image_url: null, price_usd: 49.99, cogs_est: 14.5, stores_count: 96, monthly_sales_est: 7100, search_volume: 51000, search_growth: 44, ad_count: 233, competition_level: "low", trend_direction: "up", is_featured: true },
  { product_id: "led-sunset-lamp", name: "LED Sunset Projection Lamp", emoji: "💡", niche: "Home & Garden", image_url: null, price_usd: 24.99, cogs_est: 5.1, stores_count: 312, monthly_sales_est: 12400, search_volume: 98000, search_growth: 18, ad_count: 688, competition_level: "high", trend_direction: "flat", is_featured: true },
  { product_id: "resistance-band-set", name: "Resistance Band Set (11pc)", emoji: "🏋️", niche: "Sports", image_url: null, price_usd: 29.99, cogs_est: 5.8, stores_count: 142, monthly_sales_est: 5400, search_volume: 60000, search_growth: 26, ad_count: 198, competition_level: "medium", trend_direction: "up", is_featured: false },
  { product_id: "anti-theft-backpack", name: "Anti-Theft Slim Backpack", emoji: "🎒", niche: "Fashion", image_url: null, price_usd: 44.99, cogs_est: 11.2, stores_count: 88, monthly_sales_est: 4200, search_volume: 39000, search_growth: 12, ad_count: 121, competition_level: "medium", trend_direction: "flat", is_featured: false },
  { product_id: "posture-corrector", name: "Smart Posture Corrector", emoji: "🧍", niche: "Health & Wellness", image_url: null, price_usd: 27.99, cogs_est: 4.4, stores_count: 167, monthly_sales_est: 6800, search_volume: 55000, search_growth: 33, ad_count: 274, competition_level: "medium", trend_direction: "up", is_featured: false },
  { product_id: "mini-portable-blender", name: "Mini Portable Blender", emoji: "🥤", niche: "Home & Garden", image_url: null, price_usd: 32.99, cogs_est: 8.9, stores_count: 209, monthly_sales_est: 8800, search_volume: 81000, search_growth: 9, ad_count: 503, competition_level: "high", trend_direction: "down", is_featured: false },
  { product_id: "magnetic-eyelashes", name: "Magnetic Eyelash Kit", emoji: "👁️", niche: "Beauty", image_url: null, price_usd: 22.99, cogs_est: 3.6, stores_count: 134, monthly_sales_est: 5900, search_volume: 47000, search_growth: 21, ad_count: 188, competition_level: "medium", trend_direction: "up", is_featured: false },
  { product_id: "car-phone-mount", name: "Magnetic Car Phone Mount", emoji: "🚗", niche: "Automotive", image_url: null, price_usd: 19.99, cogs_est: 3.2, stores_count: 256, monthly_sales_est: 10200, search_volume: 89000, search_growth: 5, ad_count: 421, competition_level: "high", trend_direction: "flat", is_featured: false },
  { product_id: "kids-night-projector", name: "Kids Star Night Projector", emoji: "🌟", niche: "Kids", image_url: null, price_usd: 36.99, cogs_est: 7.8, stores_count: 73, monthly_sales_est: 4600, search_volume: 42000, search_growth: 48, ad_count: 156, competition_level: "low", trend_direction: "up", is_featured: false },
  { product_id: "neck-massager", name: "Cordless Neck Massager", emoji: "💆", niche: "Health & Wellness", image_url: null, price_usd: 54.99, cogs_est: 13.9, stores_count: 119, monthly_sales_est: 5100, search_volume: 58000, search_growth: 29, ad_count: 211, competition_level: "medium", trend_direction: "up", is_featured: false },
  { product_id: "reusable-coffee-cup", name: "Collapsible Reusable Coffee Cup", emoji: "☕", niche: "Food & Beverage", image_url: null, price_usd: 18.99, cogs_est: 3.9, stores_count: 64, monthly_sales_est: 3300, search_volume: 31000, search_growth: 15, ad_count: 78, competition_level: "low", trend_direction: "up", is_featured: false },
];

export const MOCK_BOARD_PRODUCTS: BoardProduct[] = SEEDS.map(build);

// ─── Data access (Supabase → mock fallback) ────────────────────────────────

function rowToProduct(r: Record<string, unknown>): BoardProduct {
  const price = Number(r.price_usd) || 0;
  const cogs = Number(r.cogs_est) || 0;
  return {
    product_id: String(r.product_id ?? r.id ?? ""),
    name: String(r.name ?? ""),
    emoji: String(r.emoji ?? "📦"),
    niche: String(r.niche ?? ""),
    image_url: (r.image_url as string) ?? null,
    price_usd: price,
    cogs_est: cogs,
    margin_pct: Number(r.margin_pct) || (price ? Math.round(((price - cogs) / price) * 100) : 0),
    stores_count: Number(r.stores_count) || 0,
    monthly_sales_est: Number(r.monthly_sales_est) || 0,
    monthly_revenue_est: Number(r.monthly_revenue_est) || 0,
    search_volume: Number(r.search_volume) || 0,
    search_growth: Number(r.search_growth) || 0,
    ad_count: Number(r.ad_count) || 0,
    competition_level: (r.competition_level as BoardProduct["competition_level"]) || "medium",
    iq_score: Number(r.iq_score) || 0,
    trend_direction: (r.trend_direction as BoardProduct["trend_direction"]) || "flat",
    suppliers: (r.suppliers as Supplier[]) || [],
    top_stores: (r.top_stores as TopStore[]) || [],
    is_featured: Boolean(r.is_featured),
  };
}

export async function getBoardProducts(): Promise<BoardProduct[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .not("price_usd", "is", null)
      .order("iq_score", { ascending: false })
      .limit(200);
    if (error || !data || data.length === 0) return MOCK_BOARD_PRODUCTS;
    return data.map(rowToProduct);
  } catch {
    return MOCK_BOARD_PRODUCTS;
  }
}

export async function getBoardProduct(productId: string): Promise<BoardProduct | null> {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("products")
      .select("*")
      .eq("product_id", productId)
      .maybeSingle();
    if (data) return rowToProduct(data);
  } catch {
    /* fall through to mock */
  }
  return MOCK_BOARD_PRODUCTS.find((p) => p.product_id === productId) ?? null;
}
