"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ListToolbar } from "@/components/layout/list-toolbar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { APPROVAL_STATUS_OPTIONS } from "@/lib/constants";
import { matchesSearch, matchesCategory, sortBy } from "@/lib/list-utils";

const STATUS_VARIANT = {
  PENDING: "warning",
  APPROVED: "success",
  REJECTED: "destructive",
};

const SORT_OPTIONS = [
  { value: "date_desc", label: "Newest First" },
  { value: "date_asc", label: "Oldest First" },
  { value: "price_asc", label: "Price Low–High" },
  { value: "price_desc", label: "Price High–Low" },
  { value: "vendor_asc", label: "Vendor A–Z" },
];

const SORT_GETTERS = {
  date_desc: (a) => new Date(a.approvedAt || a.createdAt),
  date_asc: (a) => new Date(a.approvedAt || a.createdAt),
  price_asc: (a) => a.quotation.price,
  price_desc: (a) => a.quotation.price,
  vendor_asc: (a) => a.quotation.vendor.companyName,
};

export function ApprovalList({ approvals }) {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [sort, setSort] = useState("date_desc");

  const filtered = useMemo(() => {
    let items = approvals.filter((a) => {
      const matchSearch = matchesSearch(a, search, [
        (i) => i.quotation.rfq.title,
        (i) => i.quotation.vendor.companyName,
        (i) => i.approvedBy?.name,
      ]);
      const matchStatus = !statusFilter || a.status === statusFilter;
      const matchCategory = matchesCategory(a.quotation.rfq.category, categoryFilter);
      return matchSearch && matchStatus && matchCategory;
    });
    return sortBy(items, sort, SORT_GETTERS);
  }, [approvals, search, categoryFilter, statusFilter, sort]);

  return (
    <div className="space-y-6">
      <ListToolbar
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search by RFQ, vendor..."
        categoryFilter={categoryFilter}
        onCategoryChange={setCategoryFilter}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        statusOptions={APPROVAL_STATUS_OPTIONS}
        sort={sort}
        onSortChange={setSort}
        sortOptions={SORT_OPTIONS}
        resultCount={filtered.length}
        totalCount={approvals.length}
      />

      <div className="rounded-xl border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>RFQ</TableHead>
              <TableHead>Vendor</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Approved By</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((a) => (
              <TableRow key={a.id}>
                <TableCell className="font-medium">{a.quotation.rfq.title}</TableCell>
                <TableCell>{a.quotation.vendor.companyName}</TableCell>
                <TableCell className="text-emerald-400">
                  ${a.quotation.price.toLocaleString()}
                </TableCell>
                <TableCell>
                  <Badge variant={STATUS_VARIANT[a.status]}>{a.status}</Badge>
                </TableCell>
                <TableCell>{a.approvedBy?.name || "—"}</TableCell>
                <TableCell>
                  {a.approvedAt
                    ? new Date(a.approvedAt).toLocaleDateString()
                    : new Date(a.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <Link href={`/approvals/${a.id}`}>
                    <Button variant="outline" size="sm" className="text-emerald-400">
                      Review
                    </Button>
                  </Link>
                </TableCell>
              </TableRow>
            ))}
            {filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="py-8 text-center text-muted-foreground">
                  No approvals found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
