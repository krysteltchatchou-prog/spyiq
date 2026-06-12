// Realistic mock data used until real Supabase tables are populated.
// All AI-generated content is seeded here so pages render instantly.

import type { Product } from "@/types/product";

// ─── Dashboard ────────────────────────────────────────────────────────────────

export const DASHBOARD_STATS = {
  products_tracked:  1_284,
  products_delta:    14,          // % vs last period
  winning_products:  47,
  winning_delta:     8,
  stores_analyzed:   312,
  stores_delta:      22,
  ai_credits_used:   38,
  ai_credits_limit:  50,
  ai_credits_delta:  -5,
};

// Use a fixed epoch (2026-05-13) so SSR and client produce identical output
const CHART_EPOCH = new Date("2026-05-13").getTime();

// Pre-seeded "random" deltas so values never change between renders
const PREV_OFFSETS = [
  1200,-400,800,1600,-200,400,2000,-800,600,1400,
  -600,1000,1800,-1000,200,800,1600,-400,1200,2000,
  -800,400,600,1400,-200,1000,1800,-600,800,1600,
];

export const REVENUE_CHART_DATA = Array.from({ length: 30 }, (_, i) => {
  const base = 18_000 + Math.sin(i / 4) * 4_000 + i * 120;
  return {
    date: new Date(CHART_EPOCH + i * 86_400_000).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    revenue:      Math.round(base),
    prev_revenue: Math.round(base * 0.82 + PREV_OFFSETS[i]),
    orders:       Math.round(base / 47),
    profit:       Math.round(base * 0.28),
  };
});

export const HOT_PRODUCTS = [
  { id: "1", emoji: "🧴", name: "Hydro-Boost Face Serum",    niche: "Beauty",      daily_sales: 312, iq_score: 94, margin_pct: 68, trending: true  },
  { id: "2", emoji: "🦮", name: "Auto Pet Feeder Pro",       niche: "Pets",        daily_sales: 287, iq_score: 91, margin_pct: 72, trending: true  },
  { id: "3", emoji: "💡", name: "LED Sunset Lamp",            niche: "Home",        daily_sales: 241, iq_score: 88, margin_pct: 61, trending: true  },
  { id: "4", emoji: "🏋️", name: "Resistance Band Set (11pc)", niche: "Fitness",     daily_sales: 198, iq_score: 86, margin_pct: 74, trending: false },
  { id: "5", emoji: "🎒", name: "Anti-Theft Slim Backpack",   niche: "Travel",      daily_sales: 176, iq_score: 83, margin_pct: 58, trending: false },
];

export const TRENDING_NICHES = [
  { id: "1", emoji: "🧴", name: "Skincare & Beauty",  products: 284, growth: 38, sparkline: [40,44,43,51,58,62,71] },
  { id: "2", emoji: "🏠", name: "Smart Home",          products: 197, growth: 29, sparkline: [30,32,34,33,39,44,47] },
  { id: "3", emoji: "🐕", name: "Pet Accessories",     products: 163, growth: 24, sparkline: [28,27,30,31,34,37,40] },
  { id: "4", emoji: "🏋️", name: "Home Fitness",        products: 142, growth: 19, sparkline: [22,24,23,26,27,29,31] },
  { id: "5", emoji: "🌿", name: "Eco & Sustainable",   products: 118, growth: 16, sparkline: [18,19,19,21,22,23,24] },
];

export const AI_INSIGHTS = [
  {
    id: "1", type: "Opportunity" as const, color: "#5eb89a",
    icon: "🚀",
    title: "Sunset Lamp demand up 340% this week",
    body:  "LED mood lighting is exploding on TikTok. Only 3 major dropshippers active. Window closes in ~10 days.",
  },
  {
    id: "2", type: "Warning" as const, color: "#d4b572",
    icon: "⚠️",
    title: "Posture corrector niche getting saturated",
    body:  "47 new stores entered this niche in the past 14 days. Margins compressing. Consider exiting or differentiating.",
  },
  {
    id: "3", type: "Insight" as const, color: "#a07840",
    icon: "💡",
    title: "Top pet stores all use Yotpo reviews",
    body:  "86% of 7-figure pet accessory stores rely on Yotpo for social proof. Strong signal for trust conversion.",
  },
  {
    id: "4", type: "Alert" as const, color: "#d4685f",
    icon: "🔔",
    title: "Your tracked store launched 12 new products",
    body:  "GreenLeaf Living added 12 eco products overnight. Possible new winning category test — worth spying.",
  },
];

export const TRENDING_ADS = [
  { id:"1", platform:"TikTok",   emoji:"🧴", product:"Hydro-Boost Serum",    hook:"POV: You finally found the serum that actually works in 3 days...", engagement: 8.4, days: 12, est_spend: 4_200  },
  { id:"2", platform:"Facebook", emoji:"🦮", product:"Auto Pet Feeder",       hook:"I was SO worried about my dog while traveling. Then I found this...", engagement: 5.1, days: 31, est_spend: 18_700 },
  { id:"3", platform:"Instagram",emoji:"💡", product:"LED Sunset Lamp",        hook:"Transform your boring room into this in 30 seconds ✨",              engagement: 6.8, days: 8,  est_spend: 2_900  },
  { id:"4", platform:"TikTok",   emoji:"🏋️", product:"Resistance Bands 11pc", hook:"Gym canceled my membership so I built one for $27",                  engagement: 9.2, days: 5,  est_spend: 1_400  },
];

export const TOP_STORE_APPS = [
  { emoji:"⭐", name:"Yotpo Reviews",   category:"Reviews",    desc:"Photo & video reviews with loyalty",       pct: 82 },
  { emoji:"📧", name:"Klaviyo",         category:"Email",      desc:"Email + SMS marketing automation",          pct: 78 },
  { emoji:"🔄", name:"ReConvert",       category:"Upsell",     desc:"Post-purchase upsell & thank you pages",    pct: 71 },
  { emoji:"📊", name:"Triple Whale",    category:"Analytics",  desc:"Unified ecommerce analytics & attribution", pct: 64 },
  { emoji:"📦", name:"DSers",           category:"Fulfilment", desc:"AliExpress dropshipping order management",  pct: 61 },
  { emoji:"🎁", name:"Smile.io",        category:"Loyalty",    desc:"Points & referral rewards program",         pct: 54 },
  { emoji:"🛡️", name:"Trustpilot",      category:"Trust",      desc:"Verified customer review widgets",          pct: 48 },
  { emoji:"🚀", name:"PageFly",         category:"Conversion", desc:"Drag-and-drop landing page builder",        pct: 43 },
];

// ─── Products ─────────────────────────────────────────────────────────────────

export const MOCK_PRODUCTS: Product[] = [
  { id:"p1",  name:"Hydro-Boost Face Serum",     emoji:"🧴", niche:"Beauty",     iq_score:94, demand_score:96, competition_score:32, margin_pct:68, viral_score:91, monthly_sales_est:9_360, price_range_low:24.99, price_range_high:39.99, supplier_available:true,  is_trending:true,  keywords:["face serum","hyaluronic acid","skincare"], target_audiences:["Women 18-35","Beauty enthusiasts"], platforms:["TikTok","Instagram"], last_updated: new Date().toISOString(), created_at: new Date().toISOString() },
  { id:"p2",  name:"Auto Pet Feeder Pro",          emoji:"🦮", niche:"Pets",       iq_score:91, demand_score:88, competition_score:41, margin_pct:72, viral_score:84, monthly_sales_est:8_610, price_range_low:34.99, price_range_high:54.99, supplier_available:true,  is_trending:true,  keywords:["pet feeder","automatic cat feeder","dog feeder"], target_audiences:["Pet owners","Dog owners"], platforms:["Facebook","TikTok"], last_updated: new Date().toISOString(), created_at: new Date().toISOString() },
  { id:"p3",  name:"LED Sunset Lamp",              emoji:"💡", niche:"Home",       iq_score:88, demand_score:91, competition_score:38, margin_pct:61, viral_score:95, monthly_sales_est:7_230, price_range_low:19.99, price_range_high:34.99, supplier_available:true,  is_trending:true,  keywords:["sunset lamp","led mood light","room aesthetic"], target_audiences:["Gen Z","Home decor fans"], platforms:["TikTok","Instagram"], last_updated: new Date().toISOString(), created_at: new Date().toISOString() },
  { id:"p4",  name:"Resistance Band Set (11pc)",   emoji:"🏋️", niche:"Fitness",    iq_score:86, demand_score:84, competition_score:55, margin_pct:74, viral_score:79, monthly_sales_est:5_940, price_range_low:14.99, price_range_high:27.99, supplier_available:true,  is_trending:false, keywords:["resistance bands","home workout","fitness bands"], target_audiences:["Fitness enthusiasts","Home gym"], platforms:["Facebook","Instagram"], last_updated: new Date().toISOString(), created_at: new Date().toISOString() },
  { id:"p5",  name:"Anti-Theft Slim Backpack",     emoji:"🎒", niche:"Travel",     iq_score:83, demand_score:79, competition_score:62, margin_pct:58, viral_score:72, monthly_sales_est:5_280, price_range_low:29.99, price_range_high:49.99, supplier_available:true,  is_trending:false, keywords:["anti theft backpack","travel bag","slim backpack"], target_audiences:["Travelers","Students"], platforms:["Facebook","Google"], last_updated: new Date().toISOString(), created_at: new Date().toISOString() },
  { id:"p6",  name:"Posture Corrector Pro",        emoji:"🦴", niche:"Health",     iq_score:81, demand_score:82, competition_score:71, margin_pct:69, viral_score:76, monthly_sales_est:4_920, price_range_low:19.99, price_range_high:32.99, supplier_available:true,  is_trending:false, keywords:["posture corrector","back brace","posture support"], target_audiences:["Office workers","Adults 30-55"], platforms:["Facebook","Instagram"], last_updated: new Date().toISOString(), created_at: new Date().toISOString() },
  { id:"p7",  name:"Bamboo Phone Stand Dock",      emoji:"🌿", niche:"Electronics",iq_score:79, demand_score:76, competition_score:44, margin_pct:77, viral_score:68, monthly_sales_est:4_140, price_range_low:12.99, price_range_high:24.99, supplier_available:true,  is_trending:false, keywords:["phone stand","bamboo desk","phone dock"], target_audiences:["Eco-conscious","Remote workers"], platforms:["Instagram","Google"], last_updated: new Date().toISOString(), created_at: new Date().toISOString() },
  { id:"p8",  name:"Kids Art Smock Apron",         emoji:"🎨", niche:"Kids",       iq_score:77, demand_score:74, competition_score:36, margin_pct:71, viral_score:81, monthly_sales_est:3_870, price_range_low:9.99,  price_range_high:17.99, supplier_available:true,  is_trending:false, keywords:["kids apron","art smock","waterproof apron"], target_audiences:["Parents","Teachers"], platforms:["Facebook","Pinterest"], last_updated: new Date().toISOString(), created_at: new Date().toISOString() },
  { id:"p9",  name:"Stainless Meal Prep Containers",emoji:"🥗", niche:"Kitchen",   iq_score:75, demand_score:71, competition_score:68, margin_pct:54, viral_score:64, monthly_sales_est:3_420, price_range_low:22.99, price_range_high:39.99, supplier_available:true,  is_trending:false, keywords:["meal prep containers","lunch box","steel containers"], target_audiences:["Health-conscious","Meal preppers"], platforms:["Facebook","Instagram"], last_updated: new Date().toISOString(), created_at: new Date().toISOString() },
  { id:"p10", name:"Portable Car Jump Starter",    emoji:"🔋", niche:"Automotive", iq_score:73, demand_score:78, competition_score:59, margin_pct:62, viral_score:71, monthly_sales_est:3_180, price_range_low:44.99, price_range_high:79.99, supplier_available:false, is_trending:false, keywords:["jump starter","car battery","portable charger"], target_audiences:["Car owners","Men 30-55"], platforms:["Facebook","YouTube"], last_updated: new Date().toISOString(), created_at: new Date().toISOString() },
  { id:"p11", name:"Acupressure Mat & Pillow Set", emoji:"🧘", niche:"Wellness",   iq_score:72, demand_score:69, competition_score:48, margin_pct:73, viral_score:77, monthly_sales_est:2_940, price_range_low:27.99, price_range_high:44.99, supplier_available:true,  is_trending:false, keywords:["acupressure mat","spike mat","relaxation"], target_audiences:["Wellness seekers","Women 25-45"], platforms:["Instagram","Pinterest"], last_updated: new Date().toISOString(), created_at: new Date().toISOString() },
  { id:"p12", name:"Dog Car Seat Cover",           emoji:"🐕", niche:"Pets",       iq_score:70, demand_score:73, competition_score:66, margin_pct:65, viral_score:62, monthly_sales_est:2_700, price_range_low:24.99, price_range_high:44.99, supplier_available:true,  is_trending:false, keywords:["dog car seat","pet car cover","waterproof car seat"], target_audiences:["Dog owners","Car owners"], platforms:["Facebook","Google"], last_updated: new Date().toISOString(), created_at: new Date().toISOString() },
];
