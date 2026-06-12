"use client";
import { useState } from "react";
import { Search, Download, TrendingUp, TrendingDown, Minus, Plus } from "lucide-react";
import { SparklineChart } from "@/components/charts/SparklineChart";

type Competition = "low" | "medium" | "high";

interface KW {
  keyword: string;
  volume: number;
  competition: Competition;
  trend: "up" | "down" | "stable";
  score: number;
  sparkline: number[];
  cpc: number;
}

const MOCK_RESULTS: KW[] = [
  { keyword: "face serum hyaluronic acid",  volume: 49_500, competition: "medium", trend: "up",     score: 84, cpc: 1.42, sparkline:[30,33,36,38,41,44,46,48,51,54,52,58] },
  { keyword: "best face serum for dry skin", volume: 22_100, competition: "low",    trend: "up",     score: 91, cpc: 1.18, sparkline:[18,19,21,23,25,26,28,30,32,35,34,38] },
  { keyword: "vitamin c serum",              volume: 110_000,competition: "high",   trend: "stable", score: 62, cpc: 2.84, sparkline:[82,84,82,85,86,84,85,83,86,87,85,88] },
  { keyword: "hydrating serum",              volume: 33_100, competition: "medium", trend: "up",     score: 78, cpc: 1.62, sparkline:[22,24,23,27,29,31,34,33,37,40,38,43] },
  { keyword: "serum for acne prone skin",    volume: 14_800, competition: "low",    trend: "up",     score: 88, cpc: 0.94, sparkline:[10,11,12,13,14,14,15,16,17,19,18,21] },
  { keyword: "anti aging face serum",        volume: 27_100, competition: "medium", trend: "stable", score: 74, cpc: 1.91, sparkline:[24,24,25,24,26,25,27,26,28,27,28,29] },
  { keyword: "collagen serum",               volume: 18_100, competition: "medium", trend: "up",     score: 79, cpc: 1.55, sparkline:[14,15,14,16,17,18,19,18,21,22,21,24] },
  { keyword: "face serum under $30",         volume: 8_100,  competition: "low",    trend: "up",     score: 94, cpc: 0.72, sparkline:[4,5,5,6,6,7,7,8,9,9,10,11]           },
  { keyword: "brightening serum dropship",   volume: 3_600,  competition: "low",    trend: "up",     score: 96, cpc: 0.48, sparkline:[1,2,2,2,3,3,4,4,5,5,6,7]             },
  { keyword: "serum wholesale",              volume: 5_400,  competition: "low",    trend: "stable", score: 82, cpc: 0.61, sparkline:[4,4,4,5,5,5,5,5,5,6,5,6]             },
];

const QUESTIONS = [
  "What serum is best for sensitive skin?",
  "How to apply face serum correctly?",
  "Is face serum worth it for beginners?",
  "What's the difference between serum and moisturizer?",
  "Which face serum sells best on Shopify?",
];

const COMPETITION_STYLES: Record<Competition, { color: string; bg: string }> = {
  low:    { color: "#5eb89a", bg: "rgba(94,184,154,0.10)"  },
  medium: { color: "#d4b572", bg: "rgba(212,181,114,0.10)" },
  high:   { color: "#d4685f", bg: "rgba(212,104,95,0.10)"  },
};

function fmt(n: number) {
  if (n >= 1_000) return `${(n / 1_000).toFixed(n >= 10_000 ? 0 : 1)}k`;
  return String(n);
}

function TrendIcon({ trend }: { trend: "up" | "down" | "stable" }) {
  if (trend === "up")     return <TrendingUp size={13} color="#5eb89a" />;
  if (trend === "down")   return <TrendingDown size={13} color="#d4685f" />;
  return <Minus size={13} color="#8b8da0" />;
}

export default function KeywordResearchPage() {
  const [inputValue, setInputValue] = useState("");
  const [searched, setSearched] = useState(false);
  const [savedKws, setSavedKws] = useState<Set<string>>(new Set());

  function handleSearch() {
    if (!inputValue.trim()) return;
    setSearched(true);
  }

  function toggleSave(kw: string) {
    setSavedKws((prev) => {
      const next = new Set(prev);
      next.has(kw) ? next.delete(kw) : next.add(kw);
      return next;
    });
  }

  function exportCSV() {
    const rows = [["Keyword","Volume","Competition","Trend","Score","CPC"],
      ...MOCK_RESULTS.map((k) => [k.keyword, k.volume, k.competition, k.trend, k.score, k.cpc])];
    const csv = rows.map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "keywords.csv"; a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="max-w-[1100px]">
      {/* Header */}
      <div className="mb-6">
        <h1 className="font-bold mb-1" style={{ fontSize: 24, color: "#f5f3ee", letterSpacing: "-0.4px" }}>Keyword Research</h1>
        <p className="text-sm" style={{ color: "#8a8a94" }}>Find high-volume, low-competition keywords for your Shopify store and ads.</p>
      </div>

      {/* Search */}
      <div className="rounded-2xl p-6 mb-8" style={{ background: "#15151a", border: "1px solid #2a2a33" }}>
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <Search size={16} color="#5c5c64" className="absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              placeholder="face serum, resistance bands, pet feeder…"
              className="w-full rounded-xl pl-10 pr-4 py-3 text-sm"
              style={{ background: "#1d1d24", border: "1px solid #2a2a33", color: "#f5f3ee", outline: "none" }}
              onFocus={(e) => (e.currentTarget.style.borderColor = "#a07840")}
              onBlur={(e)  => (e.currentTarget.style.borderColor = "#2a2a33")}
            />
          </div>
          <button
            onClick={handleSearch}
            disabled={!inputValue.trim()}
            className="flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold transition-all"
            style={{
              background: inputValue.trim() ? "#a07840" : "#2a2a33",
              color:      inputValue.trim() ? "#f5f3ee" : "#5c5c64",
              cursor:     inputValue.trim() ? "pointer" : "not-allowed",
            }}>
            <Search size={15} /> Research
          </button>
        </div>

        {/* Example queries */}
        <div className="flex items-center gap-2 mt-3 flex-wrap">
          <span className="text-xs" style={{ color: "#5c5c64" }}>Try:</span>
          {["face serum", "resistance bands", "pet feeder", "led lamp", "posture corrector"].map((s) => (
            <button key={s}
              onClick={() => { setInputValue(s); setSearched(true); }}
              className="px-2.5 py-1 rounded-lg text-xs transition-all"
              style={{ background: "#1d1d24", border: "1px solid #2a2a33", color: "#8a8a94" }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#a07840"; e.currentTarget.style.color = "#c49a5a"; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#2a2a33"; e.currentTarget.style.color = "#8a8a94"; }}>
              {s}
            </button>
          ))}
        </div>
      </div>

      {!searched ? (
        <div className="text-center py-20" style={{ color: "#5c5c64" }}>
          <p className="text-5xl mb-4">🔍</p>
          <p className="font-semibold text-lg" style={{ color: "#8a8a94" }}>Enter a keyword to start researching</p>
          <p className="text-sm mt-1">Find search volume, competition, trends and more for any product niche.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Main keyword stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: "Search Volume",   value: fmt(110_000) + "/mo", color: "#f5f3ee" },
              { label: "Competition",     value: "High",               color: "#d4685f" },
              { label: "Trend",           value: "↑ Stable",           color: "#d4b572" },
              { label: "Keyword IQ",      value: "62/100",             color: "#a07840" },
            ].map((s) => (
              <div key={s.label} className="rounded-2xl p-4" style={{ background: "#15151a", border: "1px solid #2a2a33" }}>
                <p className="text-xs mb-1" style={{ color: "#8a8a94" }}>{s.label}</p>
                <p className="font-bold text-xl" style={{ color: s.color, letterSpacing: "-0.5px" }}>{s.value}</p>
              </div>
            ))}
          </div>

          {/* Volume trend */}
          <div className="rounded-2xl p-6" style={{ background: "#15151a", border: "1px solid #2a2a33" }}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold" style={{ color: "#f5f3ee" }}>Search Volume Trend (12 months)</h2>
              <button onClick={exportCSV}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
                style={{ background: "#1d1d24", border: "1px solid #2a2a33", color: "#8a8a94" }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#a07840"; e.currentTarget.style.color = "#c49a5a"; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#2a2a33"; e.currentTarget.style.color = "#8a8a94"; }}>
                <Download size={12} /> Export CSV
              </button>
            </div>
            <SparklineChart data={[82,84,82,85,86,84,85,83,86,87,85,88]} color="#a07840" height={120} />
          </div>

          {/* Related keywords table */}
          <div className="rounded-2xl overflow-hidden" style={{ background: "#15151a", border: "1px solid #2a2a33" }}>
            <div className="px-5 py-4 flex items-center justify-between" style={{ borderBottom: "1px solid #2a2a33" }}>
              <h2 className="font-semibold" style={{ color: "#f5f3ee" }}>Related Keywords</h2>
              <span className="text-xs" style={{ color: "#5c5c64" }}>{MOCK_RESULTS.length} keywords</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr style={{ borderBottom: "1px solid #1d1d24" }}>
                    {["Keyword", "Volume/mo", "Competition", "Trend", "Score", "CPC", ""].map((h) => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider"
                        style={{ color: "#5c5c64" }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {MOCK_RESULTS.map((kw, i) => {
                    const cs = COMPETITION_STYLES[kw.competition];
                    return (
                      <tr key={kw.keyword}
                        style={{ borderBottom: i < MOCK_RESULTS.length - 1 ? "1px solid #1d1d24" : undefined }}>
                        <td className="px-4 py-3">
                          <span className="text-sm font-medium" style={{ color: "#f5f3ee" }}>{kw.keyword}</span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <div style={{ width: 52, height: 28 }}>
                              <SparklineChart data={kw.sparkline} color="#a07840" height={28} />
                            </div>
                            <span className="text-sm font-bold" style={{ color: "#f5f3ee" }}>{fmt(kw.volume)}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className="rounded-full px-2 py-0.5 text-xs capitalize font-medium"
                            style={{ background: cs.bg, color: cs.color }}>
                            {kw.competition}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <TrendIcon trend={kw.trend} />
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-sm font-bold" style={{
                            color: kw.score >= 85 ? "#5eb89a" : kw.score >= 70 ? "#a07840" : kw.score >= 55 ? "#d4b572" : "#d4685f"
                          }}>
                            {kw.score}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm" style={{ color: "#8a8a94" }}>${kw.cpc}</td>
                        <td className="px-4 py-3">
                          <button
                            onClick={() => toggleSave(kw.keyword)}
                            className="p-1.5 rounded-lg transition-all"
                            style={{ color: savedKws.has(kw.keyword) ? "#a07840" : "#5c5c64" }}>
                            {savedKws.has(kw.keyword)
                              ? <Minus size={13} color="#a07840" />
                              : <Plus size={13} />}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Questions */}
          <div className="rounded-2xl p-6" style={{ background: "#15151a", border: "1px solid #2a2a33" }}>
            <h2 className="font-semibold mb-4" style={{ color: "#f5f3ee" }}>Common Questions</h2>
            <div className="space-y-2">
              {QUESTIONS.map((q) => (
                <div key={q} className="flex items-center gap-2 p-3 rounded-xl cursor-pointer transition-all"
                  style={{ background: "#1d1d24", border: "1px solid #2a2a33" }}
                  onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#3a3a42")}
                  onMouseLeave={(e) => (e.currentTarget.style.borderColor = "#2a2a33")}>
                  <span style={{ color: "#a07840" }}>Q</span>
                  <span className="text-sm" style={{ color: "#f5f3ee" }}>{q}</span>
                </div>
              ))}
            </div>
          </div>

          {/* AI Keyword Brief */}
          <div className="rounded-2xl p-6" style={{ background: "#15151a", border: "1px solid #2a2a33", borderLeft: "2px solid #a07840" }}>
            <div className="flex items-center gap-2 mb-3">
              <span>🤖</span>
              <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: "#a07840" }}>AI Keyword Brief</span>
            </div>
            <div className="text-sm leading-relaxed space-y-2" style={{ color: "#8a8a94" }}>
              <p>
                <strong style={{ color: "#f5f3ee" }}>Best angle:</strong> Target long-tail variations like &ldquo;face serum under $30&rdquo; and &ldquo;best face serum for dry skin&rdquo; — these have 91–94 IQ scores with low competition despite strong intent.
              </p>
              <p>
                <strong style={{ color: "#f5f3ee" }}>Target audience:</strong> Women 22–38, primarily on TikTok and Instagram. Price-conscious buyers who research before purchasing. &ldquo;Does it actually work?&rdquo; is the #1 objection.
              </p>
              <p>
                <strong style={{ color: "#f5f3ee" }}>Product types:</strong> Hyaluronic acid, vitamin C, and peptide serums sell best. Avoid broad &ldquo;anti-aging&rdquo; positioning — too saturated. Lead with specific results (&ldquo;3-day visible difference&rdquo;).
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
