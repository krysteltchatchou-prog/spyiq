import type { Metadata } from "next";
import PublicHeader from "@/components/layout/PublicHeader";
import StoreSpyClient from "@/components/store-spy/StoreSpyClient";

export const metadata: Metadata = {
  title: "Shop Analysis — SpyIQ",
  description: "Spy on any Shopify competitor. Get revenue estimates, top products, and installed apps in seconds.",
};

export default function ShopAnalysisPage() {
  return (
    <div className="min-h-screen" style={{ background: "#0c0c0e", color: "#f5f3ee" }}>
      <PublicHeader />
      <main className="px-6 py-10 max-w-[1000px] mx-auto">
        <div className="mb-8">
          <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: "#a07840" }}>Solutions</p>
          <h1 className="font-bold mb-2" style={{ fontSize: "clamp(28px,4vw,40px)", letterSpacing: "-1px" }}>
            Competitor Store Spy 🕵️
          </h1>
          <p className="text-base max-w-[640px]" style={{ color: "#8a8a94", lineHeight: 1.6 }}>
            Paste any Shopify store URL. SpyIQ reads its public product feed and homepage to estimate
            revenue, surface top products, and detect every installed app — all from public, legal data.
          </p>
        </div>
        <StoreSpyClient />
      </main>
    </div>
  );
}
