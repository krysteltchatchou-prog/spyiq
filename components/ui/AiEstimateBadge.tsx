"use client";
// Subtle, reusable "AI estimate" disclaimer shown next to AI-generated figures.
// Quiet by design — a helpful note, not a warning. Two variants:
//   "inline"  — tiny label + tooltip, sits next to a number (default)
//   "banner"  — thin full-width row for the top of an AI panel
import { Info } from "lucide-react";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@/components/ui/tooltip";

const LABEL = "AI estimate";
const DISCLAIMER = "AI-generated estimate for research only — verify before making business decisions.";

interface Props {
  variant?: "inline" | "banner";
  className?: string;
}

export function AiEstimateBadge({ variant = "inline", className }: Props) {
  if (variant === "banner") {
    return (
      <div
        className={cn("flex items-center gap-2 rounded-lg px-3 py-2 text-[11px] leading-snug", className)}
        style={{ background: "#1d1d24", border: "1px solid #2a2a33", color: "#8a8a94" }}
      >
        <Info size={12} style={{ flexShrink: 0 }} />
        <span>
          <span className="font-semibold uppercase tracking-wider">{LABEL}</span>
          <span style={{ color: "#5c5c64" }}> — {DISCLAIMER}</span>
        </span>
      </div>
    );
  }

  return (
    <TooltipProvider delayDuration={150}>
      <Tooltip>
        <TooltipTrigger asChild>
          <span
            className={cn(
              "inline-flex items-center gap-1 align-middle cursor-help select-none text-[10px] font-semibold uppercase tracking-wider",
              className
            )}
            style={{ color: "#8a8a94" }}
          >
            <Info size={11} />
            {LABEL}
          </span>
        </TooltipTrigger>
        <TooltipContent>{DISCLAIMER}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
