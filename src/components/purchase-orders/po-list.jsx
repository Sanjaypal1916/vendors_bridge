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
import { PO_STATUS_OPTIONS } from "@/lib/constants";
import { matchesSearch, matchesCategory, sortBy } from "@/lib/list-utils";

const SORT_OPTIONS = [
  { value: "date_desc", label: "Newest First" },
  { value: "date_asc", label: "Oldest First" },
  { value: "total_desc", label: "Highest Total" },
  { value: "total_asc", label: "Lowest Total" },
  { value: "po_asc", label: "PO Number A–Z" },
];

const SORT_GETTERS = {
  date_desc: (po) => new Date(po.createdAt),
  date_asc: (po) => new Date(po.createdAt),
  total_desc: (po) => po.total,
  total_asc: (po) => po.total,
  po_asc: (po) => po.poNumber,
};

export function PurchaseOrderList({ orders }) {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [sort, setSort] = useState("date_desc");

  const filtered = useMemo(() => {
    let items = orders.filter((po) => {
      const matchSearch = matchesSearch(po, search, [
        (i) => i.poNumber,
        (i) => i.quotation.rfq.title,
        (i) => i.quotation.vendor.companyName,
      ]);
      const matchStatus = !statusFilter || po.status === statusFilter;
      const matchCategory = matchesCategory(po.quotation.rfq.category, categoryFilter);
      return matchSearch && matchStatus && matchCategory;
    });
    return sortBy(items, sort, SORT_GETTERS);
  }, [orders, search, categoryFilter, statusFilter, sort]);

  return (
    <div className="space-y-6">
      <ListToolbar
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search by PO#, RFQ, vendor..."
        categoryFilter={categoryFilter}
        onCategoryChange={setCategoryFilter}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        statusOptions={PO_STATUS_OPTIONS}
        sort={sort}
        onSortChange={setSort}
        sortOptions={SORT_OPTIONS}
        resultCount={filtered.length}
        totalCount={orders.length}
      />

      <div className="rounded-xl border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>PO Number</TableHead>
              <TableHead>RFQ</TableHead>
              <TableHead>Vendor</TableHead>
              <TableHead>Subtotal</TableHead>
              <TableHead>Tax</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((po) => (
              <TableRow key={po.id}>
                <TableCell className="font-medium">{po.poNumber}</TableCell>
                <TableCell>{po.quotation.rfq.title}</TableCell>
                <TableCell>{po.quotation.vendor.companyName}</TableCell>
                <TableCell>${po.subtotal.toLocaleString()}</TableCell>
                <TableCell>${po.tax.toLocaleString()}</TableCell>
                <TableCell className="font-semibold text-emerald-400">
                  ${po.total.toLocaleString()}
                </TableCell>
                <TableCell>
                  <Badge variant="success">{po.status}</Badge>
                </TableCell>
                <TableCell>{new Date(po.createdAt).toLocaleDateString()}</TableCell>
                <TableCell>
                  <Link href={`/purchase-orders/${po.id}`}>
                    <Button variant="outline" size="sm" className="text-emerald-400">
                      View
                    </Button>
                  </Link>
                </TableCell>
              </TableRow>
            ))}
            {filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={9} className="py-8 text-center text-muted-foreground">
                  No purchase orders found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
