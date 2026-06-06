"use client";

import { useMemo, useState } from "react";
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
import { ListToolbar } from "@/components/layout/list-toolbar";
import { ACTIVITY_STATUS_OPTIONS } from "@/lib/constants";
import {
  matchesSearch,
  matchesActivityCategory,
  matchesActivityStatus,
  sortBy,
} from "@/lib/list-utils";

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

const SORT_OPTIONS = [
  { value: "date_desc", label: "Newest First" },
  { value: "date_asc", label: "Oldest First" },
];

const SORT_GETTERS = {
  date_desc: (log) => new Date(log.createdAt),
  date_asc: (log) => new Date(log.createdAt),
};

export function ActivityTimeline({ initialLogs }) {
  const [logs] = useState(initialLogs);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [sort, setSort] = useState("date_desc");

  const filtered = useMemo(() => {
    let items = logs.filter((log) => {
      const matchSearch = matchesSearch(log, search, [
        (l) => l.description,
        (l) => l.action,
        (l) => l.user?.name,
      ]);
      const matchCategory = matchesActivityCategory(log, categoryFilter);
      const matchStatus = matchesActivityStatus(log, statusFilter);
      return matchSearch && matchCategory && matchStatus;
    });
    return sortBy(items, sort, SORT_GETTERS);
  }, [logs, search, categoryFilter, statusFilter, sort]);

  return (
    <div className="space-y-6">
      <ListToolbar
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search activity by description, user..."
        categoryFilter={categoryFilter}
        onCategoryChange={setCategoryFilter}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        statusOptions={ACTIVITY_STATUS_OPTIONS}
        sort={sort}
        onSortChange={setSort}
        sortOptions={SORT_OPTIONS}
        resultCount={filtered.length}
        totalCount={logs.length}
      />

      <div className="space-y-1">
        {filtered.map((log) => {
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
        {filtered.length === 0 && (
          <p className="py-8 text-center text-muted-foreground">No activity logs found</p>
        )}
      </div>
    </div>
  );
}
