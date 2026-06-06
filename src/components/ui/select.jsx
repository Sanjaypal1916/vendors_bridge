import { cn } from "@/lib/utils";

function Select({ className, children, ...props }) {
  return (
    <select
      data-slot="select"
      className={cn(
        "flex h-9 w-full rounded-lg border border-input bg-input/30 px-3 py-1 text-sm shadow-xs transition-colors outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-white/10 dark:bg-white/5",
        className
      )}
      {...props}
    >
      {children}
    </select>
  );
}

export { Select };
