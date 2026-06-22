import Link from "next/link";
import Image from "next/image";

export default function PublicHeader() {
  return (
    <header className="sticky top-0 z-50 flex items-center justify-between px-6 py-4 max-w-[1200px] mx-auto"
      style={{ background: "rgba(231,226,215,0.88)", backdropFilter: "blur(10px)" }}>
      <Link href="/" aria-label="SpyIQ home">
        <Image src="/SpyIQ_Logo.png" alt="SpyIQ" width={100} height={34} style={{ height: "auto" }} />
      </Link>
      <div className="flex items-center gap-3">
        <Link href="/login" className="text-sm font-medium transition-colors hover:text-[#8a6530]"
          style={{ color: "#4d4b44" }}>Sign in</Link>
        <Link href="/signup"
          className="px-4 py-2 rounded-xl text-sm font-semibold transition-all"
          style={{ background: "#a07840", color: "#fdfbf6" }}>
          Start Free Trial
        </Link>
      </div>
    </header>
  );
}
