import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium border",
  {
    variants: {
      variant: {
        default: "bg-[rgba(160,120,64,0.12)] border-[rgba(160,120,64,0.25)] text-[#c49a5a]",
        green: "bg-[rgba(94,184,154,0.10)] border-[rgba(94,184,154,0.25)] text-[#5eb89a]",
        red: "bg-[rgba(212,104,95,0.10)] border-[rgba(212,104,95,0.25)] text-[#d4685f]",
        yellow: "bg-[rgba(212,181,114,0.10)] border-[rgba(212,181,114,0.25)] text-[#d4b572]",
        muted: "bg-[#1d1d24] border-[#2a2a33] text-[#8a8a94]",
      },
    },
    defaultVariants: { variant: "default" },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
