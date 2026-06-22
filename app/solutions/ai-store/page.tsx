import type { Metadata } from "next";
import PublicHeader from "@/components/layout/PublicHeader";
import AiStudio from "@/components/ai/AiStudio";

export const metadata: Metadata = {
  title: "AI Creative Studio — SpyIQ",
  description: "Generate TikTok hooks, ad copy, product descriptions and more — informed by the top hooks and viral captions in your niche.",
};

export default function AiStorePage() {
  return (
    <div className="min-h-screen" style={{ background: "#f4f2ec", color: "#23221f" }}>
      <PublicHeader />
      <main className="px-6 py-10 max-w-[1100px] mx-auto">
        <div className="mb-8">
          <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: "#a07840" }}>Solutions</p>
          <h1 className="font-bold mb-2" style={{ fontSize: "clamp(28px,4vw,40px)", letterSpacing: "-1px" }}>
            AI Creative Studio 🤖
          </h1>
          <p className="text-base max-w-[680px]" style={{ color: "#4d4b44", lineHeight: 1.6 }}>
            Six AI copywriters in one. SpyIQ first pulls the top-performing ad hooks and viral captions
            in your niche, then writes copy tuned to your chosen tone — powered by Claude Sonnet 4.6.
          </p>
        </div>
        <AiStudio />
      </main>
    </div>
  );
}
