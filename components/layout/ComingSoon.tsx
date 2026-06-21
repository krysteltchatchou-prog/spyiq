import Link from "next/link";
import PublicHeader from "./PublicHeader";

export default function ComingSoon({
  emoji,
  title,
  subtitle,
}: {
  emoji: string;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="min-h-screen" style={{ background: "#0c0c0e", color: "#f5f3ee" }}>
      <PublicHeader />
      <main className="flex flex-col items-center justify-center text-center px-6 py-32 max-w-[600px] mx-auto">
        <div className="text-5xl mb-6">{emoji}</div>
        <span className="inline-block rounded-full px-3 py-1 text-xs font-semibold mb-5"
          style={{ background: "rgba(160,120,64,0.12)", border: "1px solid rgba(160,120,64,0.25)", color: "#c49a5a" }}>
          Coming soon
        </span>
        <h1 className="font-bold mb-4" style={{ fontSize: "clamp(28px,5vw,42px)", letterSpacing: "-1px" }}>{title}</h1>
        <p className="text-base mb-8" style={{ color: "#8a8a94", lineHeight: 1.7 }}>{subtitle}</p>
        <div className="flex items-center gap-3 flex-wrap justify-center">
          <Link href="/signup"
            className="px-6 py-3 rounded-xl text-sm font-bold transition-all"
            style={{ background: "#a07840", color: "#f5f3ee" }}>
            ⚡ Start for Free
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
