import { createClient } from "@/lib/supabase/server";
import { calculateViralScore } from "@/lib/viralScore";

export type ViralPlatform = "TikTok" | "Instagram" | "YouTube";

export interface ViralVideo {
  video_id: string;
  platform: ViralPlatform;
  creator_handle: string;
  creator_followers: number;
  product_name: string;
  product_url: string;
  views_total: number;
  views_24h: number;
  view_velocity: number;
  likes: number;
  comments: number;
  shares: number;
  saves: number;
  caption: string;
  hashtags: string[];
  audio_name: string;
  thumbnail_url: string | null;
  posted_at: string;
  niche: string;
  viral_score: number;
}

interface VSeed {
  video_id: string; platform: ViralPlatform; creator_handle: string; creator_followers: number;
  product_name: string; niche: string; caption: string; hashtags: string[]; audio_name: string;
  views_total: number; views_24h: number; likes: number; comments: number; shares: number; saves: number;
  daysAgo: number; emoji: string;
}

function build(s: VSeed): ViralVideo {
  return {
    video_id: s.video_id,
    platform: s.platform,
    creator_handle: s.creator_handle,
    creator_followers: s.creator_followers,
    product_name: s.product_name,
    product_url: `https://www.aliexpress.com/wholesale?SearchText=${encodeURIComponent(s.product_name)}`,
    views_total: s.views_total,
    views_24h: s.views_24h,
    view_velocity: Math.round(s.views_24h / 24),
    likes: s.likes, comments: s.comments, shares: s.shares, saves: s.saves,
    caption: s.caption,
    hashtags: s.hashtags,
    audio_name: s.audio_name,
    thumbnail_url: null,
    posted_at: new Date(new Date("2026-06-16").getTime() - s.daysAgo * 86_400_000).toISOString(),
    niche: s.niche,
    viral_score: calculateViralScore(s),
  };
}

const VSEEDS: VSeed[] = [
  { video_id: "tt-serum-01", platform: "TikTok", creator_handle: "@glowwithtara", creator_followers: 480_000, product_name: "Hydro-Boost Face Serum", niche: "Beauty", caption: "14 days of this serum… my skin is GLASS now ✨ #skincare", hashtags: ["skincare", "glassskin", "tiktokmademebuyit"], audio_name: "original sound - glowwithtara", views_total: 8_400_000, views_24h: 1_900_000, likes: 1_120_000, comments: 24_000, shares: 410_000, saves: 690_000, daysAgo: 3, emoji: "🧴" },
  { video_id: "tt-feeder-01", platform: "TikTok", creator_handle: "@dogdadlife", creator_followers: 220_000, product_name: "Auto Pet Feeder Pro", niche: "Pets", caption: "Never rushing home for feeding time again 🐶", hashtags: ["dogsoftiktok", "pethacks"], audio_name: "Aesthetic - Tollan Kim", views_total: 5_100_000, views_24h: 820_000, likes: 690_000, comments: 12_000, shares: 180_000, saves: 240_000, daysAgo: 5, emoji: "🦮" },
  { video_id: "ig-lamp-01", platform: "Instagram", creator_handle: "@cozyhomeedit", creator_followers: 610_000, product_name: "LED Sunset Lamp", niche: "Home & Garden", caption: "$25 sunset in my room every night 🌅", hashtags: ["homedecor", "amazonfinds", "cozyvibes"], audio_name: "sunset lofi", views_total: 12_200_000, views_24h: 640_000, likes: 980_000, comments: 18_000, shares: 320_000, saves: 540_000, daysAgo: 8, emoji: "💡" },
  { video_id: "tt-lashes-01", platform: "TikTok", creator_handle: "@beautybyjules", creator_followers: 1_300_000, product_name: "Magnetic Eyelash Kit", niche: "Beauty", caption: "no glue, 10 seconds, flawless 👁️ run don't walk", hashtags: ["beautyhack", "lashes", "fyp"], audio_name: "original sound - beautybyjules", views_total: 6_700_000, views_24h: 1_400_000, likes: 890_000, comments: 21_000, shares: 260_000, saves: 380_000, daysAgo: 2, emoji: "👁️" },
  { video_id: "yt-blender-01", platform: "YouTube", creator_handle: "@gadgetgrove", creator_followers: 940_000, product_name: "Mini Portable Blender", niche: "Home & Garden", caption: "I tested the viral portable blender for 30 days", hashtags: ["shorts", "gadgets", "review"], audio_name: "—", views_total: 3_900_000, views_24h: 210_000, likes: 240_000, comments: 8_900, shares: 41_000, saves: 62_000, daysAgo: 12, emoji: "🥤" },
  { video_id: "tt-posture-01", platform: "TikTok", creator_handle: "@deskjobfix", creator_followers: 150_000, product_name: "Smart Posture Corrector", niche: "Health & Wellness", caption: "2 weeks and my back pain is GONE 🧍", hashtags: ["backpain", "posture", "tiktokmademebuyit"], audio_name: "Calm - Aylex", views_total: 4_300_000, views_24h: 980_000, likes: 520_000, comments: 16_000, shares: 210_000, saves: 330_000, daysAgo: 4, emoji: "🧍" },
  { video_id: "ig-mount-01", platform: "Instagram", creator_handle: "@carcaretips", creator_followers: 380_000, product_name: "Magnetic Car Phone Mount", niche: "Automotive", caption: "why did no one tell me about this car hack 🚗", hashtags: ["carhacks", "amazonfinds"], audio_name: "trending audio", views_total: 7_800_000, views_24h: 320_000, likes: 610_000, comments: 9_400, shares: 150_000, saves: 190_000, daysAgo: 9, emoji: "🚗" },
  { video_id: "tt-projector-01", platform: "TikTok", creator_handle: "@momhacksdaily", creator_followers: 720_000, product_name: "Kids Star Night Projector", niche: "Kids", caption: "bedtime is finally easy 🌟 #momhack", hashtags: ["momsoftiktok", "kids", "bedtime"], audio_name: "twinkle lofi", views_total: 5_600_000, views_24h: 1_100_000, likes: 740_000, comments: 14_000, shares: 230_000, saves: 410_000, daysAgo: 3, emoji: "🌟" },
  { video_id: "yt-massager-01", platform: "YouTube", creator_handle: "@wellnesswithsam", creator_followers: 510_000, product_name: "Cordless Neck Massager", niche: "Health & Wellness", caption: "10 min a day melted my tension away", hashtags: ["shorts", "wellness", "selfcare"], audio_name: "—", views_total: 2_800_000, views_24h: 160_000, likes: 170_000, comments: 5_200, shares: 28_000, saves: 44_000, daysAgo: 14, emoji: "💆" },
  { video_id: "tt-backpack-01", platform: "TikTok", creator_handle: "@travelwithmel", creator_followers: 290_000, product_name: "Anti-Theft Backpack", niche: "Fashion", caption: "6 countries, nothing stolen 🎒 best travel buy", hashtags: ["travelhacks", "tiktoktravel"], audio_name: "wanderlust - indie", views_total: 4_900_000, views_24h: 540_000, likes: 430_000, comments: 11_000, shares: 130_000, saves: 210_000, daysAgo: 6, emoji: "🎒" },
];

export const MOCK_VIRAL_VIDEOS: ViralVideo[] = VSEEDS.map(build).sort((a, b) => b.viral_score - a.viral_score);

function rowToVideo(r: Record<string, unknown>): ViralVideo {
  return {
    video_id: String(r.video_id ?? ""),
    platform: (r.platform as ViralPlatform) || "TikTok",
    creator_handle: String(r.creator_handle ?? ""),
    creator_followers: Number(r.creator_followers) || 0,
    product_name: String(r.product_name ?? ""),
    product_url: String(r.product_url ?? ""),
    views_total: Number(r.views_total) || 0,
    views_24h: Number(r.views_24h) || 0,
    view_velocity: Number(r.view_velocity) || 0,
    likes: Number(r.likes) || 0,
    comments: Number(r.comments) || 0,
    shares: Number(r.shares) || 0,
    saves: Number(r.saves) || 0,
    caption: String(r.caption ?? ""),
    hashtags: (r.hashtags as string[]) || [],
    audio_name: String(r.audio_name ?? ""),
    thumbnail_url: (r.thumbnail_url as string) ?? null,
    posted_at: String(r.posted_at ?? new Date().toISOString()),
    niche: String(r.niche ?? ""),
    viral_score: Number(r.viral_score) || 0,
  };
}

export async function getViralVideos(): Promise<ViralVideo[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("viral_videos")
      .select("*")
      .order("viral_score", { ascending: false })
      .limit(200);
    if (!error && data && data.length > 0) return data.map(rowToVideo);
  } catch {
    /* fall back to mock */
  }
  return MOCK_VIRAL_VIDEOS;
}
