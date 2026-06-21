"use client";
import { useState } from "react";
import Link from "next/link";
import { Trash2, ExternalLink, Edit2, ArrowRight } from "lucide-react";
import { IQScoreBadge } from "@/components/products/IQScoreBadge";

const TABS = ["Saved Products", "Saved Stores", "Saved Ads", "Saved Keywords"] as const;
type Tab = typeof TABS[number];

const SAVED_PRODUCTS = [
  { id:"p1", emoji:"🧴", name:"Hydro-Boost Face Serum",  niche:"Beauty",  iq_score:94, margin_pct:68, monthly_sales_est:9360, saved_at:"2 days ago",  notes:"" },
  { id:"p3", emoji:"💡", name:"LED Sunset Lamp",          niche:"Home",    iq_score:88, margin_pct:61, monthly_sales_est:7230, saved_at:"5 days ago",  notes:"Check TikTok ads" },
  { id:"p4", emoji:"🏋️", name:"Resistance Band Set",     niche:"Fitness", iq_score:86, margin_pct:74, monthly_sales_est:5940, saved_at:"1 week ago",  notes:"" },
];

const SAVED_STORES = [
  { domain:"gymshark.com",   emoji:"🏋️", name:"Gymshark",   niche:"Fitness",  revenue:"$12M/mo",  saved_at:"3 days ago" },
  { domain:"beardbrand.com", emoji:"🧔", name:"Beardbrand",  niche:"Grooming", revenue:"$890k/mo", saved_at:"1 week ago" },
];

const SAVED_ADS = [
  { id:"a1", emoji:"🧴", platform:"TikTok",   product:"Hydro-Boost Serum",   hook:"POV: You finally found the serum that actually works in 3 days...", engagement:8.4, days:12, saved_at:"1 day ago"  },
  { id:"a4", emoji:"🏋️", platform:"TikTok",   product:"Resistance Bands",    hook:"Gym canceled my membership so I built one for $27",                engagement:9.2, days:5,  saved_at:"4 days ago" },
];

const SAVED_KEYWORDS = [
  { keyword:"best face serum for dry skin", volume:"22.1k", competition:"low",    score:91, saved_at:"2 days ago" },
  { keyword:"resistance bands set",          volume:"33.1k", competition:"medium", score:74, saved_at:"6 days ago" },
  { keyword:"led mood light",               volume:"18.4k", competition:"low",    score:82, saved_at:"1 week ago" },
];

export default function SavedPage() {
  const [activeTab, setActiveTab] = useState<Tab>("Saved Products");
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [editingNote, setEditingNote] = useState<string | null>(null);

  return (
    <div className="max-w-[1000px]">
      <div className="mb-6">
        <h1 className="font-bold mb-1" style={{ fontSize: 24, color: "#f5f3ee", letterSpacing: "-0.4px" }}>Saved Items</h1>
        <p className="text-sm" style={{ color: "#8a8a94" }}>Your bookmarked products, stores, ads, and keywords.</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 p-1 rounded-xl flex-wrap"
        style={{ background: "#15151a", border: "1px solid #2a2a33", width: "fit-content" }}>
        {TABS.map((t) => (
          <button key={t}
            onClick={() => setActiveTab(t)}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
            style={{
              background: activeTab === t ? "#a07840" : "transparent",
              color:      activeTab === t ? "#f5f3ee" : "#8a8a94",
            }}>
            {t}
          </button>
        ))}
      </div>

      {activeTab === "Saved Products" && (
        SAVED_PRODUCTS.length === 0 ? (
          <div className="text-center py-20" style={{ color: "#5c5c64" }}>
            <p className="text-4xl mb-3">📌</p>
            <p className="font-semibold" style={{ color: "#8a8a94" }}>No saved products yet</p>
            <Link href="/products" className="inline-flex items-center gap-1 mt-3 text-sm font-semibold hover:text-[#c49a5a] transition-colors"
              style={{ color: "#a07840" }}>
              Search Products <ArrowRight size={13} />
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {SAVED_PRODUCTS.map((p) => (
              <div key={p.id} className="flex items-center gap-4 p-4 rounded-2xl"
                style={{ background: "#15151a", border: "1px solid #2a2a33" }}>
                <span className="text-3xl">{p.emoji}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <p className="text-sm font-semibold" style={{ color: "#f5f3ee" }}>{p.name}</p>
                    <span className="rounded-full px-2 py-0.5 text-[10px] font-medium"
                      style={{ background: "#1d1d24", border: "1px solid #2a2a33", color: "#8a8a94" }}>
                      {p.niche}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs" style={{ color: "#5eb89a" }}>{p.monthly_sales_est.toLocaleString()} sales/mo</span>
                    <span className="text-xs" style={{ color: "#a07840" }}>{p.margin_pct}% margin</span>
                    <span className="text-xs" style={{ color: "#5c5c64" }}>Saved {p.saved_at}</span>
                  </div>
                  {editingNote === p.id ? (
                    <input
                      type="text"
                      autoFocus
                      defaultValue={notes[p.id] ?? p.notes}
                      onBlur={(e) => { setNotes((prev) => ({ ...prev, [p.id]: e.target.value })); setEditingNote(null); }}
                      className="mt-1.5 w-full rounded-lg px-2 py-1 text-xs"
                      style={{ background: "#1d1d24", border: "1px solid #a07840", color: "#f5f3ee", outline: "none" }}
                    />
                  ) : (notes[p.id] ?? p.notes) ? (
                    <p className="text-xs mt-1 italic" style={{ color: "#8a8a94" }}>
                      📝 {notes[p.id] ?? p.notes}
                    </p>
                  ) : null}
                </div>
                <IQScoreBadge score={p.iq_score} size={44} strokeWidth={4} showLabel />
                <div className="flex items-center gap-1">
                  <button onClick={() => setEditingNote(p.id)} className="p-2 rounded-lg transition-all"
                    style={{ color: "#5c5c64" }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "#8a8a94")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "#5c5c64")}>
                    <Edit2 size={13} />
                  </button>
                  <Link href={`/products/${p.id}`} className="p-2 rounded-lg transition-all"
                    style={{ color: "#5c5c64" }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "#c49a5a")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "#5c5c64")}>
                    <ExternalLink size={13} />
                  </Link>
                  <button className="p-2 rounded-lg transition-all"
                    style={{ color: "#5c5c64" }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "#d4685f")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "#5c5c64")}>
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )
      )}

      {activeTab === "Saved Stores" && (
        <div className="space-y-3">
          {SAVED_STORES.map((s) => (
            <div key={s.domain} className="flex items-center gap-4 p-4 rounded-2xl"
              style={{ background: "#15151a", border: "1px solid #2a2a33" }}>
              <span className="text-3xl">{s.emoji}</span>
              <div className="flex-1">
                <p className="text-sm font-semibold" style={{ color: "#f5f3ee" }}>{s.name}</p>
                <div className="flex items-center gap-3">
                  <span className="text-xs" style={{ color: "#5c5c64" }}>{s.domain}</span>
                  <span className="text-xs font-bold" style={{ color: "#5eb89a" }}>{s.revenue}</span>
                  <span className="text-xs" style={{ color: "#5c5c64" }}>Saved {s.saved_at}</span>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Link href={`/store-spy/${s.domain}`}
                  className="p-2 rounded-lg transition-all" style={{ color: "#5c5c64" }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "#c49a5a")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "#5c5c64")}>
                  <ExternalLink size={13} />
                </Link>
                <button className="p-2 rounded-lg transition-all" style={{ color: "#5c5c64" }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "#d4685f")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "#5c5c64")}>
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === "Saved Ads" && (
        <div className="space-y-3">
          {SAVED_ADS.map((ad) => (
            <div key={ad.id} className="flex items-start gap-4 p-4 rounded-2xl"
              style={{ background: "#15151a", border: "1px solid #2a2a33" }}>
              <span className="text-3xl">{ad.emoji}</span>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-sm font-semibold" style={{ color: "#f5f3ee" }}>{ad.product}</p>
                  <span className="rounded-full px-2 py-0.5 text-[10px]"
                    style={{ background: "#1d1d24", border: "1px solid #2a2a33", color: "#8a8a94" }}>
                    {ad.platform}
                  </span>
                </div>
                <p className="text-xs italic" style={{ color: "#8a8a94" }}>&ldquo;{ad.hook}&rdquo;</p>
                <div className="flex items-center gap-3 mt-1.5">
                  <span className="text-xs" style={{ color: "#5eb89a" }}>{ad.engagement}% engagement</span>
                  <span className="text-xs" style={{ color: "#5c5c64" }}>{ad.days} days running</span>
                  <span className="text-xs" style={{ color: "#5c5c64" }}>Saved {ad.saved_at}</span>
                </div>
              </div>
              <button className="p-2 rounded-lg transition-all flex-shrink-0" style={{ color: "#5c5c64" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#d4685f")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#5c5c64")}>
                <Trash2 size={13} />
              </button>
            </div>
          ))}
        </div>
      )}

      {activeTab === "Saved Keywords" && (
        <div className="rounded-2xl overflow-hidden" style={{ background: "#15151a", border: "1px solid #2a2a33" }}>
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: "1px solid #2a2a33" }}>
                {["Keyword", "Volume/mo", "Competition", "Score", "Saved", ""].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider"
                    style={{ color: "#5c5c64" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {SAVED_KEYWORDS.map((kw, i) => (
                <tr key={kw.keyword}
                  style={{ borderBottom: i < SAVED_KEYWORDS.length - 1 ? "1px solid #1d1d24" : undefined }}>
                  <td className="px-4 py-3 text-sm font-medium" style={{ color: "#f5f3ee" }}>{kw.keyword}</td>
                  <td className="px-4 py-3 text-sm font-bold" style={{ color: "#f5f3ee" }}>{kw.volume}</td>
                  <td className="px-4 py-3">
                    <span className="rounded-full px-2 py-0.5 text-xs capitalize font-medium"
                      style={{
                        background: kw.competition === "low" ? "rgba(94,184,154,0.10)" : "rgba(212,181,114,0.10)",
                        color:      kw.competition === "low" ? "#5eb89a" : "#d4b572",
                      }}>
                      {kw.competition}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm font-bold" style={{ color: "#a07840" }}>{kw.score}</td>
                  <td className="px-4 py-3 text-xs" style={{ color: "#5c5c64" }}>{kw.saved_at}</td>
                  <td className="px-4 py-3">
                    <button className="p-1.5 rounded-lg transition-all" style={{ color: "#5c5c64" }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = "#d4685f")}
                      onMouseLeave={(e) => (e.currentTarget.style.color = "#5c5c64")}>
                      <Trash2 size={13} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
