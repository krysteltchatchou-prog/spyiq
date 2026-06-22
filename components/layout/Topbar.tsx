"use client";
import { usePathname, useRouter } from "next/navigation";
import { useRef, useState, useEffect } from "react";
import { Bell, Search, ChevronDown, Settings, CreditCard, User, LogOut } from "lucide-react";
import Link from "next/link";
import { useDateRange, type DateRange } from "@/hooks/useDateRange";
import { useProfile } from "@/hooks/useProfile";
import { createClient } from "@/lib/supabase/client";

// Pages that show the date range filter
const DATE_FILTER_PAGES = new Set(["/dashboard", "/products", "/trends"]);

const PAGE_TITLES: Record<string, string> = {
  "/dashboard":        "Dashboard",
  "/products":         "Product Database",
  "/trends":           "Trend Radar",
  "/store-spy":        "Store Spy",
  "/ad-spy":           "Ad Intelligence",
  "/keyword-research": "Keyword Research",
  "/ai-analyzer":      "AI Analyzer",
  "/store-builder":    "AI Store Builder",
  "/saved":            "Saved Items",
  "/alerts":           "Alerts",
  "/settings":         "Settings",
};

const DATE_OPTIONS: DateRange[] = ["7D", "30D", "90D", "1Y"];

export function Topbar() {
  const pathname              = usePathname();
  const router                = useRouter();
  const { range, setRange }   = useDateRange();
  const { profile }           = useProfile();
  const [userOpen, setUserOpen] = useState(false);
  const dropdownRef           = useRef<HTMLDivElement>(null);

  const base          = "/" + pathname.split("/")[1];
  const title         = PAGE_TITLES[base] ?? "SpyIQ";
  const showDateFilter = DATE_FILTER_PAGES.has(base);

  // Close dropdown on outside click
  useEffect(() => {
    function handle(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setUserOpen(false);
      }
    }
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, []);

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
  }

  const initials = profile?.full_name
    ? profile.full_name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
    : profile?.email?.[0]?.toUpperCase() ?? "U";

  return (
    <header
      className="fixed top-0 right-0 z-30 flex items-center justify-between"
      style={{
        left: 240,
        height: 58,
        padding: "0 28px",
        background: "#e7e2d7",
        borderBottom: "1px solid #ddd8cc",
      }}
    >
      {/* ── Page title ───────────────────────────────────────────────────── */}
      <h1
        style={{
          color: "#23221f",
          fontWeight: 700,
          fontSize: 15,
          letterSpacing: "-0.3px",
          lineHeight: 1,
        }}
      >
        {title}
      </h1>

      {/* ── Right controls ───────────────────────────────────────────────── */}
      <div className="flex items-center gap-2.5">

        {/* Date range filter — only on data pages */}
        {showDateFilter && (
          <div
            className="flex items-center rounded-lg overflow-hidden"
            style={{ border: "1px solid #e4e1d8", background: "#ffffff" }}
          >
            {DATE_OPTIONS.map((period) => (
              <button
                key={period}
                onClick={() => setRange(period)}
                className="transition-colors text-xs font-medium"
                style={{
                  padding: "5px 12px",
                  background: range === period ? "#a07840" : "transparent",
                  color:      range === period ? "#fdfbf6"  : "#4d4b44",
                }}
              >
                {period}
              </button>
            ))}
          </div>
        )}

        {/* Global search trigger */}
        <button
          className="flex items-center gap-1.5 rounded-lg text-xs font-medium transition-colors"
          style={{
            padding: "5px 11px",
            background: "#ffffff",
            border: "1px solid #e4e1d8",
            color: "#4d4b44",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#d4cfc2")}
          onMouseLeave={(e) => (e.currentTarget.style.borderColor = "#e4e1d8")}
        >
          <Search size={12} />
          <span>Search</span>
          <kbd
            className="rounded"
            style={{
              marginLeft: 4,
              padding: "1px 4px",
              background: "#e4e1d8",
              color: "#5d5b54",
              fontSize: 9,
              fontFamily: "inherit",
              border: "1px solid #d4cfc2",
            }}
          >
            ⌘K
          </kbd>
        </button>

        {/* Notifications bell */}
        <Link
          href="/alerts"
          className="relative flex items-center justify-center rounded-lg transition-colors"
          style={{ width: 34, height: 34, background: "#ffffff", border: "1px solid #e4e1d8" }}
        >
          <Bell size={14} color="#4d4b44" />
          {/* Unread dot */}
          <span
            className="absolute rounded-full"
            style={{
              width: 7,
              height: 7,
              top: 7,
              right: 7,
              background: "#d4685f",
              border: "1.5px solid #f4f2ec",
            }}
          />
        </Link>

        {/* User menu ─────────────────────────────────────────────────────── */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setUserOpen((o) => !o)}
            className="flex items-center gap-2 rounded-lg transition-colors"
            style={{
              padding: "4px 8px",
              background: userOpen ? "#ffffff" : "#efece4",
              border: "1px solid #e4e1d8",
            }}
          >
            {/* Avatar */}
            <div
              className="rounded-full flex items-center justify-center font-bold shrink-0"
              style={{ width: 26, height: 26, background: "#a07840", color: "#fdfbf6", fontSize: 11 }}
            >
              {initials}
            </div>
            {/* Name + plan (hidden on narrow screens) */}
            <div className="hidden sm:block text-left">
              <p style={{ color: "#23221f", fontSize: 12, fontWeight: 600, lineHeight: 1.2 }}>
                {profile?.full_name?.split(" ")[0] ?? "Account"}
              </p>
              <p style={{ color: "#4d4b44", fontSize: 10, lineHeight: 1.2 }}>
                {profile?.plan ?? "free"} plan
              </p>
            </div>
            <ChevronDown
              size={12}
              color="#4d4b44"
              className="transition-transform"
              style={{ transform: userOpen ? "rotate(180deg)" : "rotate(0deg)" }}
            />
          </button>

          {/* Dropdown */}
          {userOpen && (
            <div
              className="absolute right-0 mt-1.5 rounded-xl overflow-hidden"
              style={{
                width: 220,
                background: "#ffffff",
                border: "1px solid #e4e1d8",
                boxShadow: "0 16px 40px -16px rgba(60,50,30,0.3)",
                zIndex: 50,
              }}
            >
              {/* Profile header */}
              <div className="px-4 py-3" style={{ borderBottom: "1px solid #e4e1d8" }}>
                <p style={{ color: "#23221f", fontSize: 13, fontWeight: 600 }}>
                  {profile?.full_name ?? "User"}
                </p>
                <p style={{ color: "#4d4b44", fontSize: 11 }}>{profile?.email ?? ""}</p>
              </div>

              {/* Menu items */}
              <div className="py-1">
                {[
                  { icon: User,       label: "Profile",         href: "/settings#profile"  },
                  { icon: CreditCard, label: "Billing & Plan",  href: "/settings#billing"  },
                  { icon: Settings,   label: "Settings",        href: "/settings"          },
                ].map(({ icon: Icon, label, href }) => (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => setUserOpen(false)}
                    className="flex items-center gap-3 px-4 py-2 transition-colors text-[13px]"
                    style={{ color: "#23221f" }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "#f3f1ea")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                  >
                    <Icon size={14} color="#4d4b44" />
                    {label}
                  </Link>
                ))}
              </div>

              {/* Sign out */}
              <div style={{ borderTop: "1px solid #e4e1d8" }} className="py-1">
                <button
                  onClick={handleSignOut}
                  className="w-full flex items-center gap-3 px-4 py-2 transition-colors text-[13px]"
                  style={{ color: "#d4685f" }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(212,104,95,0.07)")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                >
                  <LogOut size={14} />
                  Sign out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
