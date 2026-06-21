// Ad Intelligence — shared types + a deterministic generator that stands in for
// an external "ads API" until a real provider is connected. lib/syncAds upserts
// these into Supabase; the GET endpoint falls back to them when the DB is empty.

export type AdPlatform = "TikTok" | "Facebook" | "Instagram" | "YouTube" | "Google";

export interface Ad {
  ad_id: string;
  platform: AdPlatform;
  product_name: string;
  niche: string;
  hook_text: string;
  video_url: string | null;
  likes: number;
  comments: number;
  shares: number;
  views: number;
  engagement_rate: number;
  ad_spend_est: number;
  is_active: boolean;
  country: string;
  shop_url: string;
  cta_text: string;
  first_seen: string;
  last_seen: string;
}

const PLATFORMS: AdPlatform[] = ["TikTok", "Facebook", "Instagram", "YouTube", "Google"];
const COUNTRIES = ["US", "UK", "CA", "AU", "DE"];
const CTAS = ["Shop Now", "Learn More", "Get Yours", "Buy Now", "Order Today"];

const SEED_ADS: { product: string; niche: string; hook: string; shop: string }[] = [
  { product: "Hydro-Boost Face Serum", niche: "Beauty", hook: "I tried this serum for 14 days and my skin has never looked smoother…", shop: "glowlab.co" },
  { product: "Auto Pet Feeder Pro", niche: "Pets", hook: "POV: you never have to rush home to feed your dog again 🐶", shop: "pawpal.store" },
  { product: "LED Sunset Lamp", niche: "Home & Garden", hook: "This $25 lamp turned my bedroom into a sunset every night 🌅", shop: "ambientglow.com" },
  { product: "Resistance Band Set", niche: "Sports", hook: "The only home gym you'll ever need — and it fits in a drawer.", shop: "fitkit.co" },
  { product: "Smart Posture Corrector", niche: "Health & Wellness", hook: "My back pain disappeared in 2 weeks. Here's what changed…", shop: "uprightco.com" },
  { product: "Mini Portable Blender", niche: "Home & Garden", hook: "Fresh smoothies anywhere — this blender goes everywhere I do 🥤", shop: "blendgo.store" },
  { product: "Magnetic Eyelash Kit", niche: "Beauty", hook: "No glue, no mess — lashes in 10 seconds. I'm obsessed 👁️", shop: "lashsnap.co" },
  { product: "Magnetic Car Phone Mount", niche: "Automotive", hook: "Why did nobody tell me about this car hack sooner?!", shop: "drivegear.store" },
  { product: "Kids Star Night Projector", niche: "Kids", hook: "Bedtime went from a battle to a breeze with this 🌟", shop: "littledreamers.co" },
  { product: "Cordless Neck Massager", niche: "Health & Wellness", hook: "10 minutes a day melted away my desk-job tension 💆", shop: "relaxpro.store" },
  { product: "Collapsible Coffee Cup", niche: "Food & Beverage", hook: "The reusable cup that actually fits in my pocket ☕", shop: "sipfold.com" },
  { product: "Anti-Theft Backpack", niche: "Fashion", hook: "Traveled 6 countries with this bag — nothing got stolen.", shop: "nomadgear.co" },
];

function seededRand(seed: number) {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return () => (s = (s * 16807) % 2147483647) / 2147483647;
}

/** Generate a deterministic batch of ads (stands in for an external ads API). */
export function generateAds(epoch = "2026-06-16"): Ad[] {
  const baseTime = new Date(epoch).getTime();
  const ads: Ad[] = [];
  let i = 0;
  for (const seed of SEED_ADS) {
    for (const platform of PLATFORMS) {
      const rnd = seededRand((i + 1) * 7919 + platform.length * 31);
      const views = Math.round(50_000 + rnd() * 4_000_000);
      const likes = Math.round(views * (0.02 + rnd() * 0.08));
      const comments = Math.round(likes * (0.02 + rnd() * 0.05));
      const shares = Math.round(likes * (0.05 + rnd() * 0.15));
      const engagement_rate = Math.round(((likes + comments + shares) / views) * 1000) / 10;
      const ad_spend_est = Math.round(2_000 + rnd() * 38_000);
      const daysRunning = Math.round(3 + rnd() * 120);
      ads.push({
        ad_id: `${seed.shop.split(".")[0]}-${platform.toLowerCase()}-${i}`,
        platform,
        product_name: seed.product,
        niche: seed.niche,
        hook_text: seed.hook,
        video_url: null,
        likes, comments, shares, views,
        engagement_rate,
        ad_spend_est,
        is_active: rnd() > 0.2,
        country: COUNTRIES[Math.floor(rnd() * COUNTRIES.length)],
        shop_url: seed.shop,
        cta_text: CTAS[Math.floor(rnd() * CTAS.length)],
        first_seen: new Date(baseTime - daysRunning * 86_400_000).toISOString(),
        last_seen: new Date(baseTime).toISOString(),
      });
      i++;
    }
  }
  return ads;
}

export const MOCK_ADS: Ad[] = generateAds();
