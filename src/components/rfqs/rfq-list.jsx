"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
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
import { RFQ_STATUS_OPTIONS } from "@/lib/constants";
import { matchesSearch, matchesCategory, sortBy } from "@/lib/list-utils";

const STATUS_COLOR = {
  OPEN: "success",
  DRAFT: "warning",
  CLOSED: "secondary",
  AWARDED: "default",
};

const SORT_OPTIONS = [
  { value: "date_desc", label: "Newest First" },
  { value: "date_asc", label: "Oldest First" },
  { value: "title_asc", label: "Title A–Z" },
  { value: "title_desc", label: "Title Z–A" },
  { value: "deadline_asc", label: "Deadline Soonest" },
  { value: "deadline_desc", label: "Deadline Latest" },
];

const SORT_GETTERS = {
  date_desc: (r) => new Date(r.createdAt),
  date_asc: (r) => new Date(r.createdAt),
  title_asc: (r) => r.title,
  title_desc: (r) => r.title,
  deadline_asc: (r) => new Date(r.deadline),
  deadline_desc: (r) => new Date(r.deadline),
};

export function RFQList({ rfqs, user }) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [sort, setSort] = useState("date_desc");

  const isStaff = user.role === "ADMIN" || user.role === "PROCUREMENT_OFFICER";

  const filtered = useMemo(() => {
    let items = rfqs.filter((rfq) => {
      const matchSearch = matchesSearch(rfq, search, [
        (r) => r.title,
        (r) => r.category,
        (r) => r.createdBy?.name,
      ]);
      const matchStatus = !statusFilter || rfq.status === statusFilter;
      const matchCategory = matchesCategory(rfq.category, categoryFilter);
      return matchSearch && matchStatus && matchCategory;
    });
    return sortBy(items, sort, SORT_GETTERS);
  }, [rfqs, search, statusFilter, categoryFilter, sort]);

  return (
    <div className="space-y-6">
      <ListToolbar
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search RFQs by title, category..."
        categoryFilter={categoryFilter}
        onCategoryChange={setCategoryFilter}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        statusOptions={RFQ_STATUS_OPTIONS}
        sort={sort}
        onSortChange={setSort}
        sortOptions={SORT_OPTIONS}
        resultCount={filtered.length}
        totalCount={rfqs.length}
        actions={
          isStaff ? (
            <Link href="/rfqs/create">
              <Button className="bg-emerald-500 text-black hover:bg-emerald-400">
                <Plus className="mr-2 h-4 w-4" />
                Create RFQ
              </Button>
            </Link>
          ) : null
        }
      />

      <div className="rounded-xl border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Deadline</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Quotations</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((rfq) => (
              <TableRow key={rfq.id}>
                <TableCell className="font-medium">{rfq.title}</TableCell>
                <TableCell>{rfq.category}</TableCell>
                <TableCell>{rfq.quantity}</TableCell>
                <TableCell>{new Date(rfq.deadline).toLocaleDateString()}</TableCell>
                <TableCell>
                  <Badge variant={STATUS_COLOR[rfq.status] || "outline"}>{rfq.status}</Badge>
                </TableCell>
                <TableCell>{rfq._count.quotations}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    {rfq._count.quotations > 0 && isStaff && (
                      <Link href={`/quotations/compare/${rfq.id}`}>
                        <Button variant="outline" size="sm" className="text-emerald-400">
                          Compare
                        </Button>
                      </Link>
                    )}
                    {user.role === "VENDOR" &&
                      rfq.status === "OPEN" &&
                      rfq.rfqVendors?.some((rv) => rv.vendorId === user.vendor?.id) && (
                        <Link href={`/quotations/submit?rfqId=${rfq.id}`}>
                          <Button variant="outline" size="sm" className="text-emerald-400">
                            Submit Quote
                          </Button>
                        </Link>
                      )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="py-8 text-center text-muted-foreground">
                  No RFQs found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
