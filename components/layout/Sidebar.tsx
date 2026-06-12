"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useProfile } from "@/hooks/useProfile";
import { createClient } from "@/lib/supabase/client";
import {
  LayoutDashboard, Package, TrendingUp, Search,
  Store, Megaphone, Bot, Wand2, Bookmark, Bell,
  Settings, LogOut,
} from "lucide-react";

// ─── Nav definition ────────────────────────────────────────────────────────

type NavItem = {
  label: string;
  href: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  icon: React.ComponentType<any>;
  badge?: string;
  alertCount?: number;
};

type NavSection = {
  section: string;
  items: NavItem[];
};

const NAV: NavSection[] = [
  {
    section: "Overview",
    items: [
      { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    ],
  },
  {
    section: "Research",
    items: [
      { label: "Product Database", href: "/products",          icon: Package },
      { label: "Trend Radar",      href: "/trends",            icon: TrendingUp, badge: "Live" },
      { label: "Keywords",         href: "/keyword-research",  icon: Search },
    ],
  },
  {
    section: "Spy Tools",
    items: [
      { label: "Store Spy",       href: "/store-spy", icon: Store    },
      { label: "Ad Intelligence", href: "/ad-spy",    icon: Megaphone },
    ],
  },
  {
    section: "AI",
    items: [
      { label: "AI Analyzer",     href: "/ai-analyzer",  icon: Bot   },
      { label: "AI Store Builder",href: "/store-builder", icon: Wand2 },
    ],
  },
  {
    section: "My SpyIQ",
    items: [
      { label: "Saved Items", href: "/saved",    icon: Bookmark                 },
      { label: "Alerts",      href: "/alerts",   icon: Bell, alertCount: 3      },
      { label: "Settings",    href: "/settings", icon: Settings                 },
    ],
  },
];

// Plan display config
const PLAN_LABELS: Record<string, { label: string; color: string }> = {
  free:    { label: "Free Plan",    color: "#8a8a94" },
  starter: { label: "Starter",      color: "#c49a5a" },
  pro:     { label: "Pro",          color: "#a07840" },
  agency:  { label: "Agency",       color: "#5eb89a" },
};

// ─── Component ─────────────────────────────────────────────────────────────

export function Sidebar() {
  const pathname  = usePathname();
  const router    = useRouter();
  const { profile } = useProfile();

  const planKey   = profile?.plan ?? "free";
  const planInfo  = PLAN_LABELS[planKey];
  const usedPct   = profile
    ? Math.min(100, Math.round((profile.ai_credits_used / profile.ai_credits_limit) * 100))
    : 0;

  function isActive(href: string) {
    if (href === "/dashboard") return pathname === "/dashboard";
    // match exact or any child path
    return pathname === href || pathname.startsWith(href + "/");
  }

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
  }

  return (
    <aside
      className="fixed left-0 top-0 bottom-0 z-40 flex flex-col select-none"
      style={{ width: 210, background: "#0c0c0e", borderRight: "1px solid #2a2a33" }}
    >
      {/* ── Logo ──────────────────────────────────────────────────────────── */}
      <div
        className="flex items-center px-4 shrink-0"
        style={{ height: 58, background: "#0c0c0e", borderBottom: "1px solid #2a2a33" }}
      >
        <Link href="/dashboard">
          <Image
            src="/SpyIQ_Logo.png"
            alt="SpyIQ"
            width={135}
            height={40}
            style={{ width: 135, height: "auto", objectFit: "contain", display: "block" }}
            priority
          />
        </Link>
      </div>

      {/* ── Navigation ────────────────────────────────────────────────────── */}
      <nav className="flex-1 overflow-y-auto py-3 px-3 space-y-4">
        {NAV.map((group) => (
          <div key={group.section}>
            {/* Section label */}
            <p
              className="px-2 mb-1"
              style={{
                fontSize: 10,
                fontWeight: 600,
                color: "#3a3a42",
                textTransform: "uppercase",
                letterSpacing: "0.8px",
              }}
            >
              {group.section}
            </p>

            {/* Items */}
            <ul className="space-y-0.5">
              {group.items.map((item) => {
                const active = isActive(item.href);
                const Icon   = item.icon;

                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={cn(
                        "flex items-center gap-2.5 rounded-lg transition-all duration-150",
                        "text-[13px] font-medium",
                        active
                          ? "text-[#f5f3ee]"
                          : "text-[#8a8a94] hover:text-[#d4cfc7] hover:bg-[#15151a]"
                      )}
                      style={
                        active
                          ? {
                              background: "rgba(160,120,64,0.10)",
                              borderLeft: "2px solid #a07840",
                              paddingTop: 6,
                              paddingBottom: 6,
                              paddingLeft: 6,   // 8px - 2px border
                              paddingRight: 8,
                            }
                          : { padding: "6px 8px" }
                      }
                    >
                      {/* Icon */}
                      <Icon
                        size={14}
                        className={active ? "text-[#c49a5a]" : ""}
                      />

                      {/* Label */}
                      <span className="flex-1 truncate">{item.label}</span>

                      {/* "Live" badge */}
                      {item.badge && (
                        <span
                          className="shrink-0 rounded-full font-semibold"
                          style={{
                            fontSize: 9,
                            padding: "2px 5px",
                            background: "rgba(94,184,154,0.15)",
                            color: "#5eb89a",
                            border: "1px solid rgba(94,184,154,0.3)",
                            letterSpacing: "0.3px",
                          }}
                        >
                          {item.badge}
                        </span>
                      )}

                      {/* Alert count badge */}
                      {item.alertCount ? (
                        <span
                          className="shrink-0 rounded-full font-bold text-center"
                          style={{
                            fontSize: 9,
                            minWidth: 16,
                            height: 16,
                            lineHeight: "16px",
                            padding: "0 4px",
                            background: "#d4685f",
                            color: "#fff",
                          }}
                        >
                          {item.alertCount}
                        </span>
                      ) : null}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* ── Plan widget ───────────────────────────────────────────────────── */}
      <div className="px-3 pb-3 shrink-0 space-y-2" style={{ borderTop: "1px solid #2a2a33", paddingTop: 12 }}>
        {/* Plan card */}
        <div
          className="rounded-lg px-3 py-2.5"
          style={{
            background: "rgba(160,120,64,0.07)",
            border: "1px solid rgba(160,120,64,0.18)",
          }}
        >
          <div className="flex items-center justify-between mb-1.5">
            <span style={{ color: planInfo.color, fontSize: 11, fontWeight: 700 }}>
              {planInfo.label}
            </span>
            {planKey !== "agency" && (
              <Link
                href="/settings#billing"
                className="transition-colors hover:text-[#c49a5a]"
                style={{ color: "#a07840", fontSize: 10, fontWeight: 600 }}
              >
                Upgrade →
              </Link>
            )}
          </div>

          {/* AI credits bar (shown when limit > 0) */}
          {profile && profile.ai_credits_limit > 0 && (
            <>
              <p style={{ color: "#8a8a94", fontSize: 10 }}>
                {profile.ai_credits_used.toLocaleString()} /{" "}
                {profile.ai_credits_limit.toLocaleString()} AI credits
              </p>
              <div
                className="mt-1.5 rounded-full overflow-hidden"
                style={{ height: 3, background: "#2a2a33" }}
              >
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${usedPct}%`,
                    background: usedPct > 85 ? "#d4685f" : "#a07840",
                  }}
                />
              </div>
            </>
          )}

          {/* Free plan — searches remaining */}
          {planKey === "free" && !profile && (
            <p style={{ color: "#8a8a94", fontSize: 10 }}>5 searches / day</p>
          )}
        </div>

        {/* Sign out */}
        <button
          onClick={handleSignOut}
          className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg transition-colors text-[12px] font-medium"
          style={{ color: "#5c5c64" }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = "#d4685f";
            e.currentTarget.style.background = "rgba(212,104,95,0.07)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = "#5c5c64";
            e.currentTarget.style.background = "transparent";
          }}
        >
          <LogOut size={13} />
          <span>Sign out</span>
        </button>
      </div>
    </aside>
  );
}
