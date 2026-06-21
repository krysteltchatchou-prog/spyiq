"use client";

import { useState } from "react";

export default function FaqAccordion({ items }: { items: { q: string; a: string }[] }) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="space-y-3">
      {items.map((item, i) => {
        const isOpen = open === i;
        return (
          <div
            key={item.q}
            className="rounded-2xl overflow-hidden transition-colors"
            style={{
              background: "#ffffff",
              border: `1px solid ${isOpen ? "#d4cfc2" : "#e4e1d8"}`,
              boxShadow: isOpen ? "0 8px 24px -16px rgba(60,50,30,0.25)" : "none",
            }}
          >
            <button
              onClick={() => setOpen(isOpen ? null : i)}
              className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left"
            >
              <span className="font-semibold text-sm" style={{ color: "#23221f" }}>
                {item.q}
              </span>
              <span
                className="shrink-0 flex items-center justify-center w-6 h-6 rounded-full transition-transform duration-300"
                style={{
                  background: isOpen ? "#a07840" : "#f3f1ea",
                  border: "1px solid #e4e1d8",
                  transform: isOpen ? "rotate(45deg)" : "none",
                }}
              >
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M6 2v8M2 6h8" stroke={isOpen ? "#ffffff" : "#4d4b44"} strokeWidth="1.6" strokeLinecap="round" />
                </svg>
              </span>
            </button>
            <div
              className="grid transition-all duration-300 ease-out"
              style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
            >
              <div className="overflow-hidden">
                <p className="px-5 pb-4 text-sm leading-relaxed" style={{ color: "#4d4b44" }}>
                  {item.a}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
