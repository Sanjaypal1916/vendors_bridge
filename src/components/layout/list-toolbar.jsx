"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { PROCUREMENT_CATEGORIES } from "@/lib/constants";

export function ListToolbar({
  search,
  onSearchChange,
  searchPlaceholder = "Search...",
  categoryFilter,
  onCategoryChange,
  statusFilter,
  onStatusChange,
  statusOptions = [],
  sort,
  onSortChange,
  sortOptions = [],
  actions,
  resultCount,
  totalCount,
}) {
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 items-center gap-3 sm:grid-cols-2 lg:grid-cols-12">
        <div className="relative sm:col-span-2 lg:col-span-4">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder={searchPlaceholder}
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="lg:col-span-2">
          <Select
            value={categoryFilter}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="w-full"
          >
            <option value="">All Categories</option>
            {PROCUREMENT_CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </Select>
        </div>

        <div className="lg:col-span-2">
          <Select
            value={statusFilter}
            onChange={(e) => onStatusChange(e.target.value)}
            className="w-full"
          >
            {statusOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </Select>
        </div>

        {sortOptions.length > 0 && onSortChange && (
          <div className={actions ? "lg:col-span-2" : "lg:col-span-4"}>
            <Select
              value={sort}
              onChange={(e) => onSortChange(e.target.value)}
              className="w-full"
            >
              {sortOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </Select>
          </div>
        )}

        {actions && (
          <div className="flex justify-start sm:col-span-2 lg:col-span-2 lg:justify-end">
            {actions}
          </div>
        )}
      </div>

      {resultCount != null && totalCount != null && (
        <p className="text-xs text-muted-foreground">
          Showing {resultCount} of {totalCount} results
          {search ? ` for "${search}"` : ""}
        </p>
      )}
    </div>
  );
}
