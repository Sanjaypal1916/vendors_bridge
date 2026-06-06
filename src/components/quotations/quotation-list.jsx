"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ListToolbar } from "@/components/layout/list-toolbar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { QUOTATION_STATUS_OPTIONS } from "@/lib/constants";
import { matchesSearch, matchesCategory, sortBy } from "@/lib/list-utils";

const SORT_OPTIONS = [
  { value: "date_desc", label: "Newest First" },
  { value: "date_asc", label: "Oldest First" },
  { value: "price_asc", label: "Price Low–High" },
  { value: "price_desc", label: "Price High–Low" },
  { value: "vendor_asc", label: "Vendor A–Z" },
];

const SORT_GETTERS = {
  date_desc: (q) => new Date(q.createdAt),
  date_asc: (q) => new Date(q.createdAt),
  price_asc: (q) => q.price,
  price_desc: (q) => q.price,
  vendor_asc: (q) => q.vendor.companyName,
};

export function QuotationList({ quotations, user }) {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [sort, setSort] = useState("date_desc");

  const isStaff = user.role === "ADMIN" || user.role === "PROCUREMENT_OFFICER";

  const filtered = useMemo(() => {
    let items = quotations.filter((q) => {
      const matchSearch = matchesSearch(q, search, [
        (i) => i.rfq.title,
        (i) => i.vendor.companyName,
        (i) => i.notes,
      ]);
      const matchStatus = !statusFilter || q.status === statusFilter;
      const matchCategory = matchesCategory(q.rfq.category, categoryFilter);
      return matchSearch && matchStatus && matchCategory;
    });
    return sortBy(items, sort, SORT_GETTERS);
  }, [quotations, search, categoryFilter, statusFilter, sort]);

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
        statusOptions={QUOTATION_STATUS_OPTIONS}
        sort={sort}
        onSortChange={setSort}
        sortOptions={SORT_OPTIONS}
        resultCount={filtered.length}
        totalCount={quotations.length}
        actions={
          user.role === "VENDOR" ? (
            <Link href="/quotations/submit">
              <Button className="bg-emerald-500 text-black hover:bg-emerald-400">
                Submit Quotation
              </Button>
            </Link>
          ) : null
        }
      />

      <div className="rounded-xl border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>RFQ</TableHead>
              <TableHead>Vendor</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Delivery Days</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((q) => (
              <TableRow key={q.id}>
                <TableCell className="font-medium">{q.rfq.title}</TableCell>
                <TableCell>{q.vendor.companyName}</TableCell>
                <TableCell className="text-emerald-400">${q.price.toLocaleString()}</TableCell>
                <TableCell>{q.deliveryDays} days</TableCell>
                <TableCell>
                  <Badge variant={q.status === "SELECTED" ? "success" : q.status === "REJECTED" ? "destructive" : "outline"}>
                    {q.status}
                  </Badge>
                </TableCell>
                <TableCell>{new Date(q.createdAt).toLocaleDateString()}</TableCell>
                <TableCell>
                  {isStaff && (
                    <Link href={`/quotations/compare/${q.rfqId}`}>
                      <Button variant="outline" size="sm" className="text-emerald-400">
                        Compare
                      </Button>
                    </Link>
                  )}
                </TableCell>
              </TableRow>
            ))}
            {filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="py-8 text-center text-muted-foreground">
                  No quotations found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
