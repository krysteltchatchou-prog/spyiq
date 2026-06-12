"use client";
import { useState, useMemo } from "react";
import { LayoutGrid, List, Download } from "lucide-react";
import { ProductFilters, DEFAULT_FILTERS, type FilterState } from "./ProductFilters";
import { ProductTable } from "./ProductTable";
import { ProductCard }  from "./ProductCard";
import { MOCK_PRODUCTS } from "@/lib/mock-data";
import { formatNumber } from "@/lib/utils";

export function ProductsClient() {
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);
  const [view, setView]       = useState<"table" | "grid">("table");

  const filtered = useMemo(() => {
    let list = [...MOCK_PRODUCTS];

    if (filters.search) {
      const q = filters.search.toLowerCase();
      list = list.filter(
        (p) => p.name.toLowerCase().includes(q) || p.niche.toLowerCase().includes(q)
      );
    }
    if (filters.niches.length) {
      list = list.filter((p) => filters.niches.includes(p.niche));
    }
    if (filters.iq_min > 0) {
      list = list.filter((p) => p.iq_score >= filters.iq_min);
    }
    if (filters.trending) {
      list = list.filter((p) => p.is_trending);
    }
    if (filters.supplier) {
      list = list.filter((p) => p.supplier_available);
    }
    if (filters.platform !== "All") {
      list = list.filter((p) => p.platforms.includes(filters.platform));
    }

    // Sort
    list.sort((a, b) => {
      switch (filters.sort) {
        case "iq_score":          return b.iq_score - a.iq_score;
        case "monthly_sales_est": return b.monthly_sales_est - a.monthly_sales_est;
        case "margin_pct":        return b.margin_pct - a.margin_pct;
        case "viral_score":       return b.viral_score - a.viral_score;
        case "created_at":        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        default:                  return 0;
      }
    });

    return list;
  }, [filters]);

  return (
    <div className="space-y-4">
      {/* Sticky filter bar */}
      <ProductFilters filters={filters} onChange={setFilters} />

      {/* Results header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <p className="text-sm font-medium" style={{ color: "#f5f3ee" }}>
            {formatNumber(filtered.length)} products
          </p>
          {filtered.length < MOCK_PRODUCTS.length && (
            <span className="text-xs px-2 py-0.5 rounded-full"
              style={{ background: "rgba(160,120,64,0.10)", color: "#a07840", border: "1px solid rgba(160,120,64,0.2)" }}>
              filtered
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Export */}
          <button
            className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors"
            style={{ background: "#15151a", border: "1px solid #2a2a33", color: "#8a8a94" }}
          >
            <Download size={12} /> Export CSV
          </button>

          {/* View toggle */}
          <div className="flex rounded-lg overflow-hidden" style={{ border: "1px solid #2a2a33", background: "#15151a" }}>
            <button
              onClick={() => setView("table")}
              className="p-2 transition-colors"
              style={view === "table" ? { background: "#a07840", color: "#f5f3ee" } : { color: "#8a8a94" }}
            >
              <List size={14} />
            </button>
            <button
              onClick={() => setView("grid")}
              className="p-2 transition-colors"
              style={view === "grid" ? { background: "#a07840", color: "#f5f3ee" } : { color: "#8a8a94" }}
            >
              <LayoutGrid size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Product list */}
      {view === "table" ? (
        <ProductTable products={filtered} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.length === 0 ? (
            <div className="col-span-full rounded-xl flex flex-col items-center justify-center py-20"
              style={{ background: "#15151a", border: "1px solid #2a2a33" }}>
              <p style={{ fontSize: 32 }}>🔍</p>
              <p className="mt-3 font-semibold" style={{ color: "#f5f3ee" }}>No products match your filters</p>
              <p className="text-sm mt-1" style={{ color: "#8a8a94" }}>Try adjusting or clearing the filters above</p>
            </div>
          ) : (
            filtered.map((p) => <ProductCard key={p.id} product={p} />)
          )}
        </div>
      )}
    </div>
  );
}
