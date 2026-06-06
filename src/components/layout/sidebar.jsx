"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Building2,
  FileText,
  DollarSign,
  CheckCircle,
  ShoppingCart,
  Receipt,
  BarChart3,
  Activity,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { NAV_ITEMS } from "@/lib/constants";
import { logoutAction } from "@/app/actions/auth";

const ICONS = {
  LayoutDashboard,
  Building2,
  FileText,
  DollarSign,
  CheckCircle,
  ShoppingCart,
  Receipt,
  BarChart3,
  Activity,
};

export function Sidebar({ user }) {
  const pathname = usePathname();
  const items = NAV_ITEMS.filter((item) => item.roles.includes(user.role));

  return (
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-64 flex-col border-r border-border bg-[#0a0a0a]">
      <div className="flex h-16 items-center gap-3 border-b border-border px-6">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-500">
          <span className="text-sm font-bold text-black">VB</span>
        </div>
        <div>
          <h1 className="text-sm font-bold text-white">VendorBridge</h1>
          <p className="text-[10px] text-muted-foreground">Procurement ERP</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto p-4">
        {items.map((item) => {
          const Icon = ICONS[item.icon];
          const isActive =
            pathname === item.href || pathname.startsWith(item.href + "/");

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-emerald-500/15 text-emerald-400"
                  : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
              )}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-border p-4">
        <div className="mb-3 rounded-lg bg-white/5 px-3 py-2">
          <p className="text-xs font-medium text-foreground">{user.name}</p>
          <p className="text-[10px] text-muted-foreground">{user.email}</p>
        </div>
        <form action={logoutAction}>
          <button
            type="submit"
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-white/5 hover:text-red-400"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </form>
      </div>
    </aside>
  );
}
