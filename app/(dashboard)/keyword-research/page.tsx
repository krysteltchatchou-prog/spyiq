"use client";
import { useState } from "react";
import { Search, Download, TrendingUp, TrendingDown, Minus, Plus, Loader2 } from "lucide-react";
import { SparklineChart } from "@/components/charts/SparklineChart";

type Competition = "low" | "medium" | "high";
type Trend = "up" | "down" | "stable";

interface KW {
  keyword: string;
  volume: number;
  competition: Competition;
  trend: Trend;
  score: number;
  sparkline: number[];
  cpc: number;
}

interface KeywordResult {
  keyword: string;
  main: { volume: number; competition: Competition; trend: Trend; score: number };
  volumeTrend: number[];
  related: KW[];
  questions: string[];
  brief: { angle: string; audience: string; productTypes: string };
}

const COMPETITION_STYLES: Record<Competition, { color: string; bg: string }> = {
  low:    { color: "#3e8f72", bg: "rgba(94,184,154,0.10)"  },
  medium: { color: "#c08a2a", bg: "rgba(212,181,114,0.10)" },
  high:   { color: "#d4685f", bg: "rgba(212,104,95,0.10)"  },
};

const TREND_LABEL: Record<Trend, string> = { up: "↑ Rising", down: "↓ Falling", stable: "→ Stable" };
const TREND_COLOR: Record<Trend, string> = { up: "#3e8f72", down: "#d4685f", stable: "#c08a2a" };

function fmt(n: number) {
  if (n >= 1_000) return `${(n / 1_000).toFixed(n >= 10_000 ? 0 : 1)}k`;
  return String(n);
}

function scoreColor(score: number) {
  return score >= 85 ? "#3e8f72" : score >= 70 ? "#a07840" : score >= 55 ? "#c08a2a" : "#d4685f";
}

function TrendIcon({ trend }: { trend: Trend }) {
  if (trend === "up")     return <TrendingUp size={13} color="#3e8f72" />;
  if (trend === "down")   return <TrendingDown size={13} color="#d4685f" />;
  return <Minus size={13} color="#8b8da0" />;
}

export default function KeywordResearchPage() {
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<KeywordResult | null>(null);
  const [savedKws, setSavedKws] = useState<Set<string>>(new Set());

  async function runSearch(term: string) {
    const keyword = term.trim();
    if (!keyword || loading) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/keywords", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ keyword }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data?.error || "Keyword research failed. Please try again.");
        setResult(null);
      } else {
        setResult(data as KeywordResult);
      }
    } catch {
      setError("Network error — please check your connection and try again.");
      setResult(null);
    } finally {
      setLoading(false);
    }
  }

  function handleSearch() {
    runSearch(inputValue);
  }

  function toggleSave(kw: string) {
    setSavedKws((prev) => {
      const next = new Set(prev);
      if (next.has(kw)) { next.delete(kw); } else { next.add(kw); }
      return next;
    });
  }

  function exportCSV() {
    if (!result) return;
    const rows = [["Keyword","Volume","Competition","Trend","Score","CPC"],
      ...result.related.map((k) => [k.keyword, k.volume, k.competition, k.trend, k.score, k.cpc])];
    const csv = rows.map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "keywords.csv"; a.click();
    URL.revokeObjectURL(url);
  }

  const canSearch = !!inputValue.trim() && !loading;

  return (
    <div className="max-w-[1100px]">
      {/* Header */}
      <div className="mb-6">
        <h1 className="font-bold mb-1" style={{ fontSize: 24, color: "#23221f", letterSpacing: "-0.4px" }}>Keyword Research</h1>
        <p className="text-sm" style={{ color: "#4d4b44" }}>Find high-volume, low-competition keywords for your Shopify store and ads.</p>
      </div>

      {/* Search */}
      <div className="rounded-2xl p-6 mb-8" style={{ background: "#ffffff", border: "1px solid #e4e1d8" }}>
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <Search size={16} color="#5d5b54" className="absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              placeholder="face serum, resistance bands, pet feeder…"
              className="w-full rounded-xl pl-10 pr-4 py-3 text-sm"
              style={{ background: "#f3f1ea", border: "1px solid #e4e1d8", color: "#23221f", outline: "none" }}
              onFocus={(e) => (e.currentTarget.style.borderColor = "#a07840")}
              onBlur={(e)  => (e.currentTarget.style.borderColor = "#e4e1d8")}
            />
          </div>
          <button
            onClick={handleSearch}
            disabled={!canSearch}
            className="flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold transition-all"
            style={{
              background: canSearch ? "#a07840" : "#e4e1d8",
              color:      canSearch ? "#23221f" : "#5d5b54",
              cursor:     canSearch ? "pointer" : "not-allowed",
            }}>
            {loading ? <Loader2 size={15} className="animate-spin" /> : <Search size={15} />}
            {loading ? "Researching…" : "Research"}
          </button>
        </div>

        {/* Example queries */}
        <div className="flex items-center gap-2 mt-3 flex-wrap">
          <span className="text-xs" style={{ color: "#5d5b54" }}>Try:</span>
          {["face serum", "resistance bands", "pet feeder", "led lamp", "posture corrector"].map((s) => (
            <button key={s}
              onClick={() => { setInputValue(s); runSearch(s); }}
              disabled={loading}
              className="px-2.5 py-1 rounded-lg text-xs transition-all"
              style={{ background: "#f3f1ea", border: "1px solid #e4e1d8", color: "#4d4b44", cursor: loading ? "not-allowed" : "pointer" }}
              onMouseEnter={(e) => { if (loading) return; e.currentTarget.style.borderColor = "#a07840"; e.currentTarget.style.color = "#8a6530"; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#e4e1d8"; e.currentTarget.style.color = "#4d4b44"; }}>
              {s}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="rounded-xl px-4 py-3 mb-6 text-sm" style={{ background: "rgba(212,104,95,0.10)", border: "1px solid rgba(212,104,95,0.3)", color: "#d4685f" }}>
          {error}
        </div>
      )}

      {loading && !result ? (
        <div className="text-center py-20" style={{ color: "#5d5b54" }}>
          <Loader2 size={40} className="animate-spin mx-auto mb-4" color="#a07840" />
          <p className="font-semibold text-lg" style={{ color: "#4d4b44" }}>Researching “{inputValue.trim()}”…</p>
          <p className="text-sm mt-1">Analyzing search volume, competition and trends with AI.</p>
        </div>
      ) : !result ? (
        <div className="text-center py-20" style={{ color: "#5d5b54" }}>
          <p className="text-5xl mb-4">🔍</p>
          <p className="font-semibold text-lg" style={{ color: "#4d4b44" }}>Enter a keyword to start researching</p>
          <p className="text-sm mt-1">Find search volume, competition, trends and more for any product niche.</p>
        </div>
      ) : (
        <div className="space-y-6" style={{ opacity: loading ? 0.5 : 1, transition: "opacity 0.2s" }}>
          {/* Main keyword stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: "Search Volume", value: fmt(result.main.volume) + "/mo",          color: "#23221f" },
              { label: "Competition",   value: result.main.competition,                   color: COMPETITION_STYLES[result.main.competition].color, capitalize: true },
              { label: "Trend",         value: TREND_LABEL[result.main.trend],            color: TREND_COLOR[result.main.trend] },
              { label: "Keyword IQ",    value: `${result.main.score}/100`,                color: scoreColor(result.main.score) },
            ].map((s) => (
              <div key={s.label} className="rounded-2xl p-4" style={{ background: "#ffffff", border: "1px solid #e4e1d8" }}>
                <p className="text-xs mb-1" style={{ color: "#4d4b44" }}>{s.label}</p>
                <p className="font-bold text-xl" style={{ color: s.color, letterSpacing: "-0.5px", textTransform: s.capitalize ? "capitalize" : "none" }}>{s.value}</p>
              </div>
            ))}
          </div>

          {/* Volume trend */}
          <div className="rounded-2xl p-6" style={{ background: "#ffffff", border: "1px solid #e4e1d8" }}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold" style={{ color: "#23221f" }}>Search Volume Trend (12 months)</h2>
              <button onClick={exportCSV}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
                style={{ background: "#f3f1ea", border: "1px solid #e4e1d8", color: "#4d4b44" }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#a07840"; e.currentTarget.style.color = "#8a6530"; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#e4e1d8"; e.currentTarget.style.color = "#4d4b44"; }}>
                <Download size={12} /> Export CSV
              </button>
            </div>
            <SparklineChart data={result.volumeTrend} color="#a07840" height={120} />
          </div>

          {/* Related keywords table */}
          <div className="rounded-2xl overflow-hidden" style={{ background: "#ffffff", border: "1px solid #e4e1d8" }}>
            <div className="px-5 py-4 flex items-center justify-between" style={{ borderBottom: "1px solid #e4e1d8" }}>
              <h2 className="font-semibold" style={{ color: "#23221f" }}>Related Keywords</h2>
              <span className="text-xs" style={{ color: "#5d5b54" }}>{result.related.length} keywords</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr style={{ borderBottom: "1px solid #f3f1ea" }}>
                    {["Keyword", "Volume/mo", "Competition", "Trend", "Score", "CPC", ""].map((h) => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider"
                        style={{ color: "#5d5b54" }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {result.related.map((kw, i) => {
                    const cs = COMPETITION_STYLES[kw.competition];
                    return (
                      <tr key={kw.keyword}
                        style={{ borderBottom: i < result.related.length - 1 ? "1px solid #f3f1ea" : undefined }}>
                        <td className="px-4 py-3">
                          <span className="text-sm font-medium" style={{ color: "#23221f" }}>{kw.keyword}</span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <div style={{ width: 52, height: 28 }}>
                              <SparklineChart data={kw.sparkline} color="#a07840" height={28} />
                            </div>
                            <span className="text-sm font-bold" style={{ color: "#23221f" }}>{fmt(kw.volume)}</span>
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
                          <span className="text-sm font-bold" style={{ color: scoreColor(kw.score) }}>
                            {kw.score}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm" style={{ color: "#4d4b44" }}>${kw.cpc}</td>
                        <td className="px-4 py-3">
                          <button
                            onClick={() => toggleSave(kw.keyword)}
                            className="p-1.5 rounded-lg transition-all"
                            style={{ color: savedKws.has(kw.keyword) ? "#a07840" : "#5d5b54" }}>
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
          {result.questions.length > 0 && (
            <div className="rounded-2xl p-6" style={{ background: "#ffffff", border: "1px solid #e4e1d8" }}>
              <h2 className="font-semibold mb-4" style={{ color: "#23221f" }}>Common Questions</h2>
              <div className="space-y-2">
                {result.questions.map((q) => (
                  <div key={q} className="flex items-center gap-2 p-3 rounded-xl cursor-pointer transition-all"
                    style={{ background: "#f3f1ea", border: "1px solid #e4e1d8" }}
                    onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#d4cfc2")}
                    onMouseLeave={(e) => (e.currentTarget.style.borderColor = "#e4e1d8")}>
                    <span style={{ color: "#a07840" }}>Q</span>
                    <span className="text-sm" style={{ color: "#23221f" }}>{q}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* AI Keyword Brief */}
          <div className="rounded-2xl p-6" style={{ background: "#ffffff", border: "1px solid #e4e1d8", borderLeft: "2px solid #a07840" }}>
            <div className="flex items-center gap-2 mb-3">
              <span>🤖</span>
              <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: "#a07840" }}>AI Keyword Brief</span>
            </div>
            <div className="text-sm leading-relaxed space-y-2" style={{ color: "#4d4b44" }}>
              {result.brief.angle && (
                <p><strong style={{ color: "#23221f" }}>Best angle:</strong> {result.brief.angle}</p>
              )}
              {result.brief.audience && (
                <p><strong style={{ color: "#23221f" }}>Target audience:</strong> {result.brief.audience}</p>
              )}
              {result.brief.productTypes && (
                <p><strong style={{ color: "#23221f" }}>Product types:</strong> {result.brief.productTypes}</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
