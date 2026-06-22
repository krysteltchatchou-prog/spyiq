import type { Metadata } from "next";
import PublicHeader from "@/components/layout/PublicHeader";
import ShopsBoard from "@/components/shops/ShopsBoard";
import { getTopShops } from "@/lib/shops-data";

export const metadata: Metadata = {
  title: "Top Shops — SpyIQ",
  description: "A ranked leaderboard of the highest-earning Shopify stores by niche and country.",
};

export const dynamic = "force-dynamic";

export default async function TopShopsPage() {
  const shops = await getTopShops();

  return (
    <div className="min-h-screen" style={{ background: "#f4f2ec", color: "#23221f" }}>
      <PublicHeader />
      <main className="px-6 py-10 max-w-[1100px] mx-auto">
        <div className="mb-8">
          <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: "#a07840" }}>Resources</p>
          <h1 className="font-bold mb-2" style={{ fontSize: "clamp(28px,4vw,40px)", letterSpacing: "-1px" }}>
            Top Shops Directory 🏬
          </h1>
          <p className="text-base max-w-[640px]" style={{ color: "#4d4b44", lineHeight: 1.6 }}>
            The highest-earning Shopify stores, ranked by estimated monthly revenue. Filter by niche and
            country, then dive into any store&apos;s full profile.
          </p>
        </div>
        <ShopsBoard shops={shops} />
      </main>
    </div>
  );
}
