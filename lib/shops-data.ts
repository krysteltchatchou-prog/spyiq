import { createClient } from "@/lib/supabase/server";
import type { DetectedApp } from "@/lib/detectApps";

export interface ShopProduct { title: string; price: number; image?: string | null; handle?: string }

export interface Shop {
  store_id: string;
  store_url: string;
  store_name: string;
  niche: string;
  country: string;
  monthly_revenue_est: number;
  monthly_traffic_est: number;
  monthly_ad_spend_est: number;
  top_products: ShopProduct[];
  installed_apps: DetectedApp[];
  theme_name: string | null;
  social_links: Record<string, string>;
  avg_product_price: number;
  product_count: number;
  store_age_days: number | null;
  revenue_growth: number;
  spyiq_rank: number;
  last_scanned: string;
}

type ShopSeed = Omit<Shop, "spyiq_rank" | "monthly_ad_spend_est" | "monthly_traffic_est" | "last_scanned"> & {
  monthly_traffic_est: number;
};

function app(name: string, category: DetectedApp["category"], emoji: string): DetectedApp {
  return { name, category, emoji };
}

const SHOP_SEEDS: ShopSeed[] = [
  { store_id: "auralis-co", store_url: "https://auralis.co", store_name: "Auralis", niche: "Beauty", country: "US", monthly_revenue_est: 1_240_000, monthly_traffic_est: 980_000, top_products: [{ title: "Hydro-Boost Serum", price: 34.99 }, { title: "Vitamin C Glow Oil", price: 29.99 }], installed_apps: [app("Klaviyo", "Email", "✉️"), app("Loox", "Reviews", "📸"), app("Recharge", "Subscriptions", "🔄"), app("Gorgias", "Support", "💬")], theme_name: "Impulse", social_links: { instagram: "https://instagram.com/auralis" }, avg_product_price: 32, product_count: 84, store_age_days: 720, revenue_growth: 34 },
  { store_id: "pawpal-store", store_url: "https://pawpal.store", store_name: "PawPal", niche: "Pets", country: "US", monthly_revenue_est: 870_000, monthly_traffic_est: 720_000, top_products: [{ title: "Auto Pet Feeder Pro", price: 49.99 }, { title: "Smart Dog Collar", price: 39.99 }], installed_apps: [app("Klaviyo", "Email", "✉️"), app("Judge.me", "Reviews", "⭐"), app("ReConvert", "Upsell", "🔁")], theme_name: "Dawn", social_links: { tiktok: "https://tiktok.com/@pawpal" }, avg_product_price: 44, product_count: 56, store_age_days: 540, revenue_growth: 51 },
  { store_id: "ambientglow-com", store_url: "https://ambientglow.com", store_name: "AmbientGlow", niche: "Home & Garden", country: "UK", monthly_revenue_est: 1_510_000, monthly_traffic_est: 1_350_000, top_products: [{ title: "LED Sunset Lamp", price: 24.99 }, { title: "Galaxy Projector", price: 44.99 }], installed_apps: [app("Yotpo", "Reviews", "⭐"), app("Omnisend", "Email", "✉️"), app("Vitals", "Trust", "🔔"), app("PageFly", "Page Builder", "🧱")], theme_name: "Prestige", social_links: { instagram: "https://instagram.com/ambientglow" }, avg_product_price: 28, product_count: 142, store_age_days: 910, revenue_growth: 18 },
  { store_id: "fitkit-co", store_url: "https://fitkit.co", store_name: "FitKit", niche: "Sports", country: "AU", monthly_revenue_est: 640_000, monthly_traffic_est: 580_000, top_products: [{ title: "Resistance Band Set", price: 29.99 }, { title: "Adjustable Dumbbell", price: 89.99 }], installed_apps: [app("Klaviyo", "Email", "✉️"), app("Stamped.io", "Reviews", "⭐"), app("Smile.io", "Loyalty", "😊")], theme_name: "Streamline", social_links: { youtube: "https://youtube.com/@fitkit" }, avg_product_price: 47, product_count: 73, store_age_days: 430, revenue_growth: 42 },
  { store_id: "uprightco-com", store_url: "https://uprightco.com", store_name: "Upright Co", niche: "Health & Wellness", country: "US", monthly_revenue_est: 920_000, monthly_traffic_est: 810_000, top_products: [{ title: "Smart Posture Corrector", price: 27.99 }, { title: "Neck Massager", price: 54.99 }], installed_apps: [app("Postscript", "Email", "💬"), app("Okendo", "Reviews", "⭐"), app("Rebuy", "Upsell", "🔁"), app("Triple Whale", "Analytics", "🐳")], theme_name: "Warehouse", social_links: { instagram: "https://instagram.com/uprightco" }, avg_product_price: 38, product_count: 49, store_age_days: 610, revenue_growth: 29 },
  { store_id: "lashsnap-co", store_url: "https://lashsnap.co", store_name: "LashSnap", niche: "Beauty", country: "CA", monthly_revenue_est: 540_000, monthly_traffic_est: 490_000, top_products: [{ title: "Magnetic Eyelash Kit", price: 22.99 }, { title: "Lash Serum", price: 34.99 }], installed_apps: [app("Klaviyo", "Email", "✉️"), app("Loox", "Reviews", "📸"), app("Wheelio", "Conversion", "🎡")], theme_name: "Symmetry", social_links: { tiktok: "https://tiktok.com/@lashsnap" }, avg_product_price: 26, product_count: 38, store_age_days: 320, revenue_growth: 67 },
  { store_id: "drivegear-store", store_url: "https://drivegear.store", store_name: "DriveGear", niche: "Automotive", country: "DE", monthly_revenue_est: 410_000, monthly_traffic_est: 460_000, top_products: [{ title: "Magnetic Car Phone Mount", price: 19.99 }, { title: "Car Vacuum", price: 39.99 }], installed_apps: [app("Omnisend", "Email", "✉️"), app("Judge.me", "Reviews", "⭐"), app("AfterShip", "Fulfilment", "🚚")], theme_name: "Debut", social_links: {}, avg_product_price: 24, product_count: 91, store_age_days: 380, revenue_growth: 22 },
  { store_id: "littledreamers-co", store_url: "https://littledreamers.co", store_name: "Little Dreamers", niche: "Kids", country: "US", monthly_revenue_est: 730_000, monthly_traffic_est: 690_000, top_products: [{ title: "Star Night Projector", price: 36.99 }, { title: "Plush Sleep Buddy", price: 24.99 }], installed_apps: [app("Klaviyo", "Email", "✉️"), app("Stamped.io", "Reviews", "⭐"), app("Smile.io", "Loyalty", "😊"), app("Gorgias", "Support", "💬")], theme_name: "Craft", social_links: { instagram: "https://instagram.com/littledreamers" }, avg_product_price: 31, product_count: 64, store_age_days: 500, revenue_growth: 38 },
  { store_id: "sipfold-com", store_url: "https://sipfold.com", store_name: "SipFold", niche: "Food & Beverage", country: "UK", monthly_revenue_est: 280_000, monthly_traffic_est: 340_000, top_products: [{ title: "Collapsible Coffee Cup", price: 18.99 }, { title: "Insulated Bottle", price: 28.99 }], installed_apps: [app("Mailchimp", "Email", "✉️"), app("Judge.me", "Reviews", "⭐")], theme_name: "Sense", social_links: {}, avg_product_price: 22, product_count: 41, store_age_days: 260, revenue_growth: 49 },
  { store_id: "nomadgear-co", store_url: "https://nomadgear.co", store_name: "NomadGear", niche: "Fashion", country: "AU", monthly_revenue_est: 460_000, monthly_traffic_est: 420_000, top_products: [{ title: "Anti-Theft Backpack", price: 44.99 }, { title: "Packing Cubes Set", price: 24.99 }], installed_apps: [app("Klaviyo", "Email", "✉️"), app("Loox", "Reviews", "📸"), app("ReConvert", "Upsell", "🔁")], theme_name: "Boundless", social_links: { instagram: "https://instagram.com/nomadgear" }, avg_product_price: 36, product_count: 58, store_age_days: 470, revenue_growth: 31 },
];

function rank(seeds: ShopSeed[]): Shop[] {
  return [...seeds]
    .sort((a, b) => b.monthly_revenue_est - a.monthly_revenue_est)
    .map((s, i) => ({
      ...s,
      monthly_ad_spend_est: Math.round(s.monthly_revenue_est * 0.18),
      spyiq_rank: i + 1,
      last_scanned: new Date("2026-06-16").toISOString(),
    }));
}

export const MOCK_SHOPS: Shop[] = rank(SHOP_SEEDS);

function rowToShop(r: Record<string, unknown>, idx: number): Shop {
  return {
    store_id: String(r.store_id ?? ""),
    store_url: String(r.store_url ?? ""),
    store_name: String(r.store_name ?? ""),
    niche: String(r.niche ?? ""),
    country: String(r.country ?? "Unknown"),
    monthly_revenue_est: Number(r.monthly_revenue_est) || 0,
    monthly_traffic_est: Number(r.monthly_traffic_est) || 0,
    monthly_ad_spend_est: Number(r.monthly_ad_spend_est) || 0,
    top_products: (r.top_products as ShopProduct[]) || [],
    installed_apps: (r.installed_apps as DetectedApp[]) || [],
    theme_name: (r.theme_name as string) ?? null,
    social_links: (r.social_links as Record<string, string>) || {},
    avg_product_price: Number(r.avg_product_price) || 0,
    product_count: Number(r.product_count) || 0,
    store_age_days: r.store_age_days != null ? Number(r.store_age_days) : null,
    revenue_growth: Number(r.revenue_growth) || 0,
    spyiq_rank: Number(r.spyiq_rank) || idx + 1,
    last_scanned: String(r.last_scanned ?? new Date().toISOString()),
  };
}

export async function getTopShops(): Promise<Shop[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("shops")
      .select("*")
      .order("monthly_revenue_est", { ascending: false })
      .limit(200);
    if (!error && data && data.length > 0) {
      return data.map((r, i) => ({ ...rowToShop(r, i), spyiq_rank: i + 1 }));
    }
  } catch {
    /* fall back to mock */
  }
  return MOCK_SHOPS;
}

export async function getShop(storeId: string): Promise<Shop | null> {
  try {
    const supabase = await createClient();
    const { data } = await supabase.from("shops").select("*").eq("store_id", storeId).maybeSingle();
    if (data) return rowToShop(data, 0);
  } catch {
    /* fall back to mock */
  }
  return MOCK_SHOPS.find((s) => s.store_id === storeId) ?? null;
}
