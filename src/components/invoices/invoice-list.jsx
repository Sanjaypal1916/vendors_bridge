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
import { INVOICE_STATUS_OPTIONS } from "@/lib/constants";
import { matchesSearch, matchesCategory, sortBy } from "@/lib/list-utils";

const SORT_OPTIONS = [
  { value: "date_desc", label: "Newest First" },
  { value: "date_asc", label: "Oldest First" },
  { value: "total_desc", label: "Highest Total" },
  { value: "total_asc", label: "Lowest Total" },
  { value: "invoice_asc", label: "Invoice # A–Z" },
];

const SORT_GETTERS = {
  date_desc: (inv) => new Date(inv.createdAt),
  date_asc: (inv) => new Date(inv.createdAt),
  total_desc: (inv) => inv.total,
  total_asc: (inv) => inv.total,
  invoice_asc: (inv) => inv.invoiceNumber,
};

export function InvoiceList({ invoices }) {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [sort, setSort] = useState("date_desc");

  const filtered = useMemo(() => {
    let items = invoices.filter((inv) => {
      const matchSearch = matchesSearch(inv, search, [
        (i) => i.invoiceNumber,
        (i) => i.purchaseOrder.poNumber,
        (i) => i.purchaseOrder.quotation.vendor.companyName,
        (i) => i.purchaseOrder.quotation.rfq.title,
      ]);
      const matchStatus = !statusFilter || inv.status === statusFilter;
      const matchCategory = matchesCategory(
        inv.purchaseOrder.quotation.rfq.category,
        categoryFilter
      );
      return matchSearch && matchStatus && matchCategory;
    });
    return sortBy(items, sort, SORT_GETTERS);
  }, [invoices, search, categoryFilter, statusFilter, sort]);

  return (
    <div className="space-y-6">
      <ListToolbar
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search by invoice#, PO, vendor..."
        categoryFilter={categoryFilter}
        onCategoryChange={setCategoryFilter}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        statusOptions={INVOICE_STATUS_OPTIONS}
        sort={sort}
        onSortChange={setSort}
        sortOptions={SORT_OPTIONS}
        resultCount={filtered.length}
        totalCount={invoices.length}
      />

      <div className="rounded-xl border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Invoice #</TableHead>
              <TableHead>PO Number</TableHead>
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
            {filtered.map((inv) => (
              <TableRow key={inv.id}>
                <TableCell className="font-medium">{inv.invoiceNumber}</TableCell>
                <TableCell>{inv.purchaseOrder.poNumber}</TableCell>
                <TableCell>{inv.purchaseOrder.quotation.vendor.companyName}</TableCell>
                <TableCell>${inv.subtotal.toLocaleString()}</TableCell>
                <TableCell>${inv.tax.toLocaleString()}</TableCell>
                <TableCell className="font-semibold text-emerald-400">
                  ${inv.total.toLocaleString()}
                </TableCell>
                <TableCell>
                  <Badge variant={inv.status === "SENT" ? "success" : "outline"}>
                    {inv.status}
                  </Badge>
                </TableCell>
                <TableCell>{new Date(inv.createdAt).toLocaleDateString()}</TableCell>
                <TableCell>
                  <Link href={`/invoices/${inv.id}`}>
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
                  No invoices found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
