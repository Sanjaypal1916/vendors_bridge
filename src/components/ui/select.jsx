import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

function Select({ className, children, ...props }) {
  return (
    <div className="relative z-10 w-full">
      <select
        data-slot="select"
        className={cn(
          "flex h-9 w-full cursor-pointer appearance-none rounded-lg border border-border bg-[#1a1a1a] px-3 py-1 pr-9 text-sm text-white shadow-xs transition-colors outline-none focus-visible:border-emerald-500/50 focus-visible:ring-3 focus-visible:ring-emerald-500/20 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        {...props}
      >
        {children}
      </select>
      <ChevronDown
        className="pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-muted-foreground"
        aria-hidden="true"
      />
    </div>
  );
}

export { Select };
