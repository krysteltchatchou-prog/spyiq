import Link from "next/link";
import PublicHeader from "@/components/layout/PublicHeader";

export default function NotFound() {
  return (
    <div className="min-h-screen" style={{ background: "#0c0c0e", color: "#f5f3ee" }}>
      <PublicHeader />
      <main className="flex flex-col items-center justify-center text-center px-6 py-32 max-w-[600px] mx-auto">
        <div className="font-bold mb-2" style={{ fontSize: "clamp(56px,12vw,96px)", letterSpacing: "-3px", color: "#a07840" }}>
          404
        </div>
        <h1 className="font-bold mb-4" style={{ fontSize: "clamp(24px,5vw,36px)", letterSpacing: "-1px" }}>
          This page took the day off
        </h1>
        <p className="text-base mb-8" style={{ color: "#8a8a94", lineHeight: 1.7 }}>
          The link may be broken, or the page may have moved. Let&apos;s get you back to finding winning products.
        </p>
        <div className="flex items-center gap-3 flex-wrap justify-center">
          <Link href="/dashboard"
            className="px-6 py-3 rounded-xl text-sm font-bold transition-all"
            style={{ background: "#a07840", color: "#f5f3ee" }}>
            Go to dashboard
          </Link>
          <Link href="/"
            className="px-6 py-3 rounded-xl text-sm font-semibold transition-all"
            style={{ background: "#15151a", border: "1px solid #2a2a33", color: "#f5f3ee" }}>
            ← Back home
          </Link>
        </div>
      </main>
    </div>
  );
}
