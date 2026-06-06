import { cn } from "@/lib/utils";

export function StatCard({ title, value, icon: Icon, className }) {
  return (
    <div
      className={cn(
        "rounded-xl border border-border bg-card p-6 transition-colors hover:border-emerald-500/30",
        className
      )}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="mt-2 text-3xl font-bold text-foreground">{value}</p>
        </div>
        {Icon && (
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10">
            <Icon className="h-6 w-6 text-emerald-400" />
          </div>
        )}
      </div>
    </div>
  );
}
