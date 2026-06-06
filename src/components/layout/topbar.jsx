import { Bell, Search } from "lucide-react";
import { ROLE_LABELS } from "@/lib/constants";

export function Topbar({ user, title, subtitle }) {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-[#0a0a0a]/80 px-8 backdrop-blur-sm">
      <div>
        <h2 className="text-xl font-semibold text-foreground">{title}</h2>
        {subtitle && (
          <p className="text-sm text-muted-foreground">{subtitle}</p>
        )}
      </div>
      <div className="flex items-center gap-4">
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search..."
            className="h-9 w-64 rounded-lg border border-border bg-white/5 pl-10 pr-4 text-sm outline-none focus:border-emerald-500/50"
          />
        </div>
        <button className="relative rounded-lg p-2 text-muted-foreground hover:bg-white/5 hover:text-foreground">
          <Bell className="h-5 w-5" />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-emerald-500" />
        </button>
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-500/20 text-sm font-medium text-emerald-400">
          {user.name.charAt(0)}
        </div>
        <span className="hidden text-xs text-muted-foreground lg:block">
          {ROLE_LABELS[user.role]}
        </span>
      </div>
    </header>
  );
}
