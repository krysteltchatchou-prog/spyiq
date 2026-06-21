import * as React from "react";
import { cn } from "@/lib/utils";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-9 w-full rounded-md bg-[#1d1d24] border border-[#2a2a33] px-3 py-2 text-sm text-[#f5f3ee] placeholder:text-[#8a8a94]",
          "focus:outline-none focus:ring-2 focus:ring-[rgba(160,120,64,0.38)] focus:border-[#a07840]",
          "disabled:cursor-not-allowed disabled:bg-[#3a3a42] disabled:text-[#5c5c64]",
          "transition-colors",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };
