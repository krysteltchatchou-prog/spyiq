"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Package, Store, Megaphone, Bot } from "lucide-react";

const TABS = [
  { label: "Home",     href: "/dashboard",   icon: LayoutDashboard },
  { label: "Products", href: "/products",    icon: Package },
  { label: "Store Spy",href: "/store-spy",   icon: Store },
  { label: "Ads",      href: "/ad-spy",      icon: Megaphone },
  { label: "AI",       href: "/ai-analyzer", icon: Bot },
];

export function MobileNav() {
  const pathname = usePathname();

  function isActive(href: string) {
    if (href === "/dashboard") return pathname === "/dashboard";
    return pathname === href || pathname.startsWith(href + "/");
  }

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 flex md:hidden"
      style={{
        background: "#0c0c0e",
        borderTop: "1px solid #2a2a33",
        height: 60,
        paddingBottom: "env(safe-area-inset-bottom)",
      }}
    >
      {TABS.map(({ label, href, icon: Icon }) => {
        const active = isActive(href);
        return (
          <Link
            key={href}
            href={href}
            className="flex flex-1 flex-col items-center justify-center gap-1 transition-colors"
            style={{ color: active ? "#a07840" : "#5c5c64" }}
          >
            <Icon size={20} />
            <span style={{ fontSize: 10, fontWeight: active ? 600 : 400 }}>{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
