"use client";
import { useState, useMemo } from "react";
import { Copy, Check, Search, Bookmark, ArrowRight, X } from "lucide-react";

const PLATFORMS = ["All", "Facebook", "TikTok", "Instagram", "YouTube", "Google"] as const;
type Platform = typeof PLATFORMS[number];

const NICHES = ["All", "Beauty", "Fitness", "Pets", "Home", "Fashion", "Electronics", "Kids"];

const MOCK_ADS = [
  { id:"a1",  platform:"TikTok",    emoji:"🧴", product:"Hydro-Boost Face Serum",     niche:"Beauty",  hook:"POV: You finally found the serum that actually works in 3 days...",            engagement:8.4, days:12, est_spend:4_200,  saved:false },
  { id:"a2",  platform:"Facebook",  emoji:"🦮", product:"Auto Pet Feeder Pro",         niche:"Pets",    hook:"I was SO worried about my dog while traveling. Then I found this...",          engagement:5.1, days:31, est_spend:18_700, saved:false },
  { id:"a3",  platform:"Instagram", emoji:"💡", product:"LED Sunset Lamp",              niche:"Home",   hook:"Transform your boring room into this in 30 seconds ✨",                        engagement:6.8, days:8,  est_spend:2_900,  saved:false },
  { id:"a4",  platform:"TikTok",    emoji:"🏋️", product:"Resistance Band Set",         niche:"Fitness", hook:"Gym canceled my membership so I built one for $27",                          engagement:9.2, days:5,  est_spend:1_400,  saved:false },
  { id:"a5",  platform:"Facebook",  emoji:"🧘", product:"Acupressure Mat & Pillow",    niche:"Fitness", hook:"Doctors won't tell you this but 10 minutes on this mat changed everything",    engagement:7.1, days:44, est_spend:31_200, saved:false },
  { id:"a6",  platform:"TikTok",    emoji:"🌿", product:"Bamboo Wireless Charger",     niche:"Electronics",hook:"Charging your phone should look this good 🌿",                            engagement:11.3,days:3,  est_spend:800,    saved:false },
  { id:"a7",  platform:"Instagram", emoji:"🐕", product:"Dog Car Seat Cover",          niche:"Pets",    hook:"Best investment I made for road trips with my golden 🐾",                      engagement:6.2, days:19, est_spend:9_800,  saved:false },
  { id:"a8",  platform:"YouTube",   emoji:"🎒", product:"Anti-Theft Backpack",         niche:"Fashion", hook:"I got pickpocketed 3 times before I found this bag. Never again.",            engagement:4.8, days:28, est_spend:14_500, saved:false },
  { id:"a9",  platform:"Facebook",  emoji:"🧴", product:"Vitamin C Brightening Serum", niche:"Beauty",  hook:"Spend $24 or spend $240. Your skin literally can not tell the difference.",   engagement:6.7, days:22, est_spend:22_100, saved:false },
  { id:"a10", platform:"TikTok",    emoji:"🎨", product:"Kids Art Smock Apron",        niche:"Kids",    hook:"The smock that made painting fun again (without ruining every shirt they own)", engagement:7.9, days:9,  est_spend:3_100,  saved:false },
  { id:"a11", platform:"Google",    emoji:"🔋", product:"Portable Car Jump Starter",   niche:"Electronics",hook:"Never get stranded again. Fits in your glove compartment.",              engagement:3.2, days:51, est_spend:28_400, saved:false },
  { id:"a12", platform:"Instagram", emoji:"🏡", product:"Portable Projector",          niche:"Home",    hook:"Turned my bedroom wall into a 120-inch movie theater for $89",               engagement:8.8, days:14, est_spend:6_700,  saved:false },
];

const PLATFORM_ICONS: Record<string, string> = {
  Facebook: "📘", TikTok: "🎵", Instagram: "📸", YouTube: "▶️", Google: "🔵",
};

function fmtSpend(n: number) {
  if (n >= 10_000) return `$${(n / 1_000).toFixed(0)}k`;
  return `$${n.toLocaleString()}`;
}

interface DrawerAd {
  id: string; platform: string; emoji: string; product: string; niche: string;
  hook: string; engagement: number; days: number; est_spend: number;
}

export default function AdSpyPage() {
  const [activePlatform, setActivePlatform] = useState<Platform>("All");
  const [activeNiche, setActiveNiche] = useState("All");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<"engagement" | "days" | "spend">("engagement");
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [drawer, setDrawer] = useState<DrawerAd | null>(null);

  function copyHook(id: string, hook: string) {
    navigator.clipboard.writeText(hook).catch(() => {});
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  }

  function toggleSave(id: string) {
    setSavedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) { next.delete(id); } else { next.add(id); }
      return next;
    });
  }

  const filtered = useMemo(() => {
    let ads = MOCK_ADS.filter((a) => {
      if (activePlatform !== "All" && a.platform !== activePlatform) return false;
      if (activeNiche !== "All" && a.niche !== activeNiche) return false;
      if (search && !a.product.toLowerCase().includes(search.toLowerCase()) &&
          !a.hook.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
    if (sortBy === "engagement") ads = [...ads].sort((a, b) => b.engagement - a.engagement);
    else if (sortBy === "days")  ads = [...ads].sort((a, b) => b.days - a.days);
    else                         ads = [...ads].sort((a, b) => b.est_spend - a.est_spend);
    return ads;
  }, [activePlatform, activeNiche, search, sortBy]);

  return (
    <div>
      {/* Page header */}
      <div className="mb-6">
        <h1 className="font-bold mb-1" style={{ fontSize: 24, color: "#23221f", letterSpacing: "-0.4px" }}>Ad Intelligence</h1>
        <p className="text-sm" style={{ color: "#4d4b44" }}>Spy on winning ads across Facebook, TikTok, Instagram, YouTube and Google.</p>
      </div>

      {/* Sticky filter bar */}
      <div className="sticky top-[58px] z-20 -mx-7 px-7 py-3 mb-6"
        style={{ background: "#f4f2ec", borderBottom: "1px solid #e4e1d8" }}>
        {/* Platform pills */}
        <div className="flex items-center gap-2 mb-3 flex-wrap">
          {PLATFORMS.map((p) => (
            <button key={p}
              onClick={() => setActivePlatform(p)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
              style={{
                background: activePlatform === p ? "#a07840" : "#ffffff",
                border:     `1px solid ${activePlatform === p ? "#a07840" : "#e4e1d8"}`,
                color:      activePlatform === p ? "#fdfbf6" : "#4d4b44",
              }}>
              {p !== "All" && PLATFORM_ICONS[p]} {p}
            </button>
          ))}
        </div>

        {/* Second row: search, niche, sort */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative">
            <Search size={13} color="#5d5b54" className="absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search ads…"
              className="rounded-lg pl-8 pr-3 py-2 text-xs transition-colors"
              style={{ background: "#ffffff", border: "1px solid #e4e1d8", color: "#23221f", outline: "none", width: 180 }}
              onFocus={(e) => (e.currentTarget.style.borderColor = "#a07840")}
              onBlur={(e)  => (e.currentTarget.style.borderColor = "#e4e1d8")}
            />
          </div>

          <div className="flex gap-1.5 flex-wrap">
            {NICHES.map((n) => (
              <button key={n}
                onClick={() => setActiveNiche(n)}
                className="px-2.5 py-1.5 rounded-lg text-xs transition-all"
                style={{
                  background: activeNiche === n ? "rgba(160,120,64,0.15)" : "transparent",
                  border:     `1px solid ${activeNiche === n ? "#a07840" : "#e4e1d8"}`,
                  color:      activeNiche === n ? "#8a6530" : "#4d4b44",
                }}>
                {n}
              </button>
            ))}
          </div>

          <div className="ml-auto flex items-center gap-2">
            <span className="text-xs" style={{ color: "#5d5b54" }}>Sort:</span>
            {(["engagement", "days", "spend"] as const).map((s) => (
              <button key={s}
                onClick={() => setSortBy(s)}
                className="px-2.5 py-1.5 rounded-lg text-xs capitalize transition-all"
                style={{
                  background: sortBy === s ? "rgba(160,120,64,0.15)" : "#ffffff",
                  border:     `1px solid ${sortBy === s ? "#a07840" : "#e4e1d8"}`,
                  color:      sortBy === s ? "#8a6530" : "#4d4b44",
                }}>
                {s === "spend" ? "Est. Spend" : s === "days" ? "Longest Running" : "Most Engaging"}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results count */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm" style={{ color: "#4d4b44" }}>
          <span style={{ color: "#23221f", fontWeight: 600 }}>{filtered.length}</span> ads
        </p>
      </div>

      {/* Ad grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-20" style={{ color: "#5d5b54" }}>
          <p className="text-4xl mb-3">📭</p>
          <p className="font-semibold" style={{ color: "#4d4b44" }}>No ads match your filters</p>
          <p className="text-sm mt-1">Try adjusting the platform or niche filter</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((ad) => (
            <div key={ad.id}
              className="rounded-2xl p-5 cursor-pointer sq-tile"
              onClick={() => setDrawer(ad)}>

              {/* Card header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{ad.emoji}</span>
                  <div>
                    <p className="text-sm font-semibold leading-tight" style={{ color: "#23221f" }}>{ad.product}</p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="text-[10px]">{PLATFORM_ICONS[ad.platform]}</span>
                      <span className="text-[10px]" style={{ color: "#5d5b54" }}>{ad.platform}</span>
                      <span style={{ color: "#d4cfc2" }}>·</span>
                      <span className="text-[10px] rounded-full px-1.5 py-0.5"
                        style={{ background: "#f3f1ea", color: "#4d4b44" }}>
                        {ad.niche}
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); toggleSave(ad.id); }}
                  className="p-1.5 rounded-lg transition-all"
                  style={{ color: savedIds.has(ad.id) ? "#a07840" : "#5d5b54" }}>
                  <Bookmark size={14} fill={savedIds.has(ad.id) ? "#a07840" : "none"} />
                </button>
              </div>

              {/* Hook preview */}
              <p className="text-xs italic leading-relaxed mb-4 line-clamp-3"
                style={{ color: "#4d4b44" }}>
                &ldquo;{ad.hook}&rdquo;
              </p>

              {/* Stats */}
              <div className="flex items-center gap-4 mb-4 pt-3" style={{ borderTop: "1px solid #f3f1ea" }}>
                <div>
                  <p className="text-[10px]" style={{ color: "#5d5b54" }}>Engagement</p>
                  <p className="text-sm font-bold" style={{ color: "#3e8f72" }}>{ad.engagement}%</p>
                </div>
                <div>
                  <p className="text-[10px]" style={{ color: "#5d5b54" }}>Days Running</p>
                  <p className="text-sm font-bold" style={{ color: "#23221f" }}>{ad.days}d</p>
                </div>
                <div>
                  <p className="text-[10px]" style={{ color: "#5d5b54" }}>Est. Spend</p>
                  <p className="text-sm font-bold" style={{ color: "#a07840" }}>{fmtSpend(ad.est_spend)}</p>
                </div>
              </div>

              {/* CTA row */}
              <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                <button
                  onClick={(e) => { e.stopPropagation(); copyHook(ad.id, ad.hook); }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold flex-1 justify-center transition-all"
                  style={{
                    background: copiedId === ad.id ? "rgba(94,184,154,0.12)" : "#f3f1ea",
                    border:     `1px solid ${copiedId === ad.id ? "rgba(94,184,154,0.3)" : "#e4e1d8"}`,
                    color:      copiedId === ad.id ? "#3e8f72" : "#4d4b44",
                  }}>
                  {copiedId === ad.id ? <Check size={11} /> : <Copy size={11} />}
                  {copiedId === ad.id ? "Copied!" : "Copy Hook"}
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); setDrawer(ad); }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
                  style={{ background: "#f3f1ea", border: "1px solid #e4e1d8", color: "#4d4b44" }}>
                  <ArrowRight size={11} /> Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Detail drawer */}
      {drawer && (
        <>
          <div className="fixed inset-0 z-40" style={{ background: "rgba(0,0,0,0.5)" }}
            onClick={() => setDrawer(null)} />
          <div className="fixed right-0 top-0 h-full w-full max-w-[440px] z-50 overflow-y-auto"
            style={{ background: "#ffffff", borderLeft: "1px solid #e4e1d8" }}>
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-bold" style={{ color: "#23221f", fontSize: 18 }}>Ad Details</h2>
                <button onClick={() => setDrawer(null)}
                  className="p-2 rounded-lg transition-all"
                  style={{ background: "#f3f1ea", color: "#4d4b44" }}>
                  <X size={16} />
                </button>
              </div>

              {/* Ad preview */}
              <div className="rounded-2xl p-5 mb-5" style={{ background: "#f3f1ea", border: "1px solid #e4e1d8" }}>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-2xl">{drawer.emoji}</span>
                  <div>
                    <p className="text-sm font-semibold" style={{ color: "#23221f" }}>{drawer.product}</p>
                    <p className="text-xs" style={{ color: "#5d5b54" }}>{drawer.platform} · {drawer.niche}</p>
                  </div>
                </div>
                <p className="text-sm italic leading-relaxed" style={{ color: "#4d4b44" }}>
                  &ldquo;{drawer.hook}&rdquo;
                </p>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-3 mb-5">
                {[
                  { label: "Engagement", value: `${drawer.engagement}%`, color: "#3e8f72" },
                  { label: "Days Running", value: `${drawer.days}d`, color: "#23221f" },
                  { label: "Est. Spend", value: fmtSpend(drawer.est_spend), color: "#a07840" },
                ].map((s) => (
                  <div key={s.label} className="rounded-xl p-3 text-center"
                    style={{ background: "#f3f1ea", border: "1px solid #e4e1d8" }}>
                    <p className="text-xs mb-1" style={{ color: "#5d5b54" }}>{s.label}</p>
                    <p className="text-sm font-bold" style={{ color: s.color }}>{s.value}</p>
                  </div>
                ))}
              </div>

              {/* AI analysis */}
              <div className="rounded-2xl p-4 mb-5" style={{ background: "#f3f1ea", border: "1px solid #e4e1d8", borderLeft: "2px solid #a07840" }}>
                <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "#a07840" }}>
                  🤖 Why This Ad Works
                </p>
                <p className="text-xs leading-relaxed" style={{ color: "#4d4b44" }}>
                  This ad leverages a <strong style={{ color: "#23221f" }}>POV/relatable hook</strong> — one of the highest-performing TikTok formats.
                  It immediately addresses a pain point (&ldquo;that actually works&rdquo;) and creates curiosity.
                  The <strong style={{ color: "#23221f" }}>{drawer.days}-day run</strong> with {drawer.engagement}% engagement confirms it&apos;s a proven winner.
                  Estimated {fmtSpend(drawer.est_spend)} spent means this is scaling profitably.
                </p>
              </div>

              {/* Similar hooks */}
              <div className="mb-5">
                <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: "#5d5b54" }}>
                  Generate Similar Hooks
                </p>
                <div className="space-y-2">
                  {[
                    `POV: You just discovered the secret ${drawer.niche.toLowerCase()} product that sold out 3 times...`,
                    `I tested 12 ${drawer.niche.toLowerCase()} products so you don&apos;t have to. This one won.`,
                    `The ${drawer.product} hack nobody is talking about (but should be)`,
                  ].map((h, i) => (
                    <div key={i} className="flex items-start gap-2 p-3 rounded-xl"
                      style={{ background: "#f3f1ea", border: "1px solid #e4e1d8" }}>
                      <p className="text-xs flex-1 italic leading-relaxed" style={{ color: "#4d4b44" }}>&ldquo;{h}&rdquo;</p>
                      <button onClick={() => copyHook(`drawer-${i}`, h)}
                        className="flex-shrink-0 p-1 rounded"
                        style={{ color: copiedId === `drawer-${i}` ? "#3e8f72" : "#5d5b54" }}>
                        {copiedId === `drawer-${i}` ? <Check size={12} /> : <Copy size={12} />}
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <button
                  onClick={() => copyHook(drawer.id, drawer.hook)}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold"
                  style={{ background: "#a07840", color: "#fdfbf6" }}>
                  <Copy size={13} /> Copy Hook
                </button>
                <button
                  onClick={() => toggleSave(drawer.id)}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold"
                  style={{
                    background: savedIds.has(drawer.id) ? "rgba(160,120,64,0.15)" : "#f3f1ea",
                    border: `1px solid ${savedIds.has(drawer.id) ? "#a07840" : "#e4e1d8"}`,
                    color: savedIds.has(drawer.id) ? "#8a6530" : "#4d4b44",
                  }}>
                  <Bookmark size={13} fill={savedIds.has(drawer.id) ? "#a07840" : "none"} />
                  {savedIds.has(drawer.id) ? "Saved" : "Save"}
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
