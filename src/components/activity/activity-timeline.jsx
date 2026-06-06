"use client";

import { useState } from "react";
import {
  Plus,
  FileText,
  DollarSign,
  CheckCircle,
  ShoppingCart,
  Receipt,
  Building2,
  LogIn,
} from "lucide-react";
import { getActivityLogs } from "@/app/actions/activity";
import { Button } from "@/components/ui/button";

const ACTION_ICONS = {
  VENDOR_CREATED: Building2,
  VENDOR_UPDATED: Building2,
  VENDOR_DELETED: Building2,
  RFQ_CREATED: FileText,
  QUOTATION_SUBMITTED: DollarSign,
  WINNER_SELECTED: CheckCircle,
  APPROVAL_COMPLETED: CheckCircle,
  APPROVAL_REJECTED: CheckCircle,
  PO_GENERATED: ShoppingCart,
  INVOICE_GENERATED: Receipt,
  INVOICE_EMAILED: Receipt,
  LOGIN: LogIn,
  REGISTER: Plus,
  LOGOUT: LogIn,
};

const FILTERS = ["ALL", "RFQ", "PO", "INVOICE", "VENDORS"];

export function ActivityTimeline({ initialLogs }) {
  const [logs, setLogs] = useState(initialLogs);
  const [filter, setFilter] = useState("ALL");
  const [loading, setLoading] = useState(false);

  async function handleFilter(f) {
    setFilter(f);
    setLoading(true);
    const data = await getActivityLogs(f);
    setLogs(data);
    setLoading(false);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <Button
            key={f}
            variant={filter === f ? "default" : "outline"}
            size="sm"
            onClick={() => handleFilter(f)}
            className={filter === f ? "bg-emerald-500 text-black hover:bg-emerald-400" : ""}
          >
            {f === "ALL" ? "All" : f.charAt(0) + f.slice(1).toLowerCase()}
          </Button>
        ))}
      </div>

      {loading ? (
        <p className="text-muted-foreground">Loading...</p>
      ) : (
        <div className="space-y-1">
          {logs.map((log) => {
            const Icon = ACTION_ICONS[log.action] || Plus;
            return (
              <div
                key={log.id}
                className="flex gap-4 rounded-lg border border-border bg-card p-4"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-500/10">
                  <Icon className="h-5 w-5 text-emerald-400" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{log.description}</p>
                  <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                    <span>{new Date(log.createdAt).toLocaleString()}</span>
                    {log.user && <span>• {log.user.name}</span>}
                    <span className="rounded bg-white/5 px-2 py-0.5">{log.action}</span>
                  </div>
                </div>
              </div>
            );
          })}
          {logs.length === 0 && (
            <p className="py-8 text-center text-muted-foreground">No activity logs found</p>
          )}
        </div>
      )}
    </div>
  );
}
