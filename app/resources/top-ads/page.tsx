import type { Metadata } from "next";
import PublicHeader from "@/components/layout/PublicHeader";
import AdBoard from "@/components/ads/AdBoard";

export const metadata: Metadata = {
  title: "Top Ads — SpyIQ",
  description: "Best-performing ads across TikTok, Facebook, Instagram, YouTube and Google. Copy hooks in one click.",
};

export default function TopAdsPage() {
  return (
    <div className="min-h-screen" style={{ background: "#0c0c0e", color: "#f5f3ee" }}>
      <PublicHeader />
      <main className="px-6 py-10 max-w-[1200px] mx-auto">
        <div className="mb-8">
          <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: "#a07840" }}>Resources</p>
          <h1 className="font-bold mb-2" style={{ fontSize: "clamp(28px,4vw,40px)", letterSpacing: "-1px" }}>
            Ad Intelligence 📣
          </h1>
          <p className="text-base max-w-[640px]" style={{ color: "#8a8a94", lineHeight: 1.6 }}>
            The highest-performing ads across every major platform. Filter by platform, search by product
            or niche, and copy any winning hook with one click.
          </p>
        </div>
        <AdBoard />
      </main>
    </div>
  );
}
