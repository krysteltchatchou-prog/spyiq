import type { Metadata } from "next";
import PublicHeader from "@/components/layout/PublicHeader";
import ProductBoard from "@/components/board/ProductBoard";
import { getBoardProducts } from "@/lib/board-data";

export const metadata: Metadata = {
  title: "Top Products — SpyIQ",
  description: "Winning dropshipping products ranked by IQ Score — demand, margin, trend, and competition.",
};

export const dynamic = "force-dynamic";

export default async function TopProductsPage() {
  const products = await getBoardProducts();

  return (
    <div className="min-h-screen" style={{ background: "#f4f2ec", color: "#23221f" }}>
      <PublicHeader />
      <main className="px-6 py-10 max-w-[1200px] mx-auto">
        <div className="mb-8">
          <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: "#a07840" }}>Resources</p>
          <h1 className="font-bold mb-2" style={{ fontSize: "clamp(28px,4vw,40px)", letterSpacing: "-1px" }}>
            Winner Products Board 🏆
          </h1>
          <p className="text-base max-w-[640px]" style={{ color: "#4d4b44", lineHeight: 1.6 }}>
            Every product ranked by our IQ Score — a weighted blend of demand (35%), margin (25%),
            trend momentum (25%), and competition (15%). Filter to find your next winner.
          </p>
        </div>
        <ProductBoard products={products} />
      </main>
    </div>
  );
}
