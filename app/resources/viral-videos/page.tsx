import type { Metadata } from "next";
import PublicHeader from "@/components/layout/PublicHeader";
import VideoBoard from "@/components/viral/VideoBoard";
import { getViralVideos } from "@/lib/viral-data";

export const metadata: Metadata = {
  title: "Viral Videos — SpyIQ",
  description: "Track product videos going viral right now, ranked by Viral Score across TikTok, Instagram and YouTube.",
};

export const dynamic = "force-dynamic";

export default async function ViralVideosPage() {
  const videos = await getViralVideos();

  return (
    <div className="min-h-screen" style={{ background: "#f4f2ec", color: "#23221f" }}>
      <PublicHeader />
      <main className="px-6 py-10 max-w-[1200px] mx-auto">
        <div className="mb-8">
          <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: "#a07840" }}>Resources</p>
          <h1 className="font-bold mb-2" style={{ fontSize: "clamp(28px,4vw,40px)", letterSpacing: "-1px" }}>
            Viral Video Tracker 🔥
          </h1>
          <p className="text-base max-w-[640px]" style={{ color: "#4d4b44", lineHeight: 1.6 }}>
            Product videos blowing up right now, ranked by our Viral Score — a weighted blend of view
            velocity (35%), share rate (30%), save rate (20%), and engagement (15%).
          </p>
        </div>
        <VideoBoard videos={videos} />
      </main>
    </div>
  );
}
