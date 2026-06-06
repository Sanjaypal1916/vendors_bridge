"use client";

import { useMemo, useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { ListToolbar } from "@/components/layout/list-toolbar";
import { matchesSearch, sortBy } from "@/lib/list-utils";
import {
  createVendorAction,
  updateVendorAction,
  deleteVendorAction,
} from "@/app/actions/vendors";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { VendorForm } from "@/components/vendors/vendor-form";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { VENDOR_STATUS_OPTIONS } from "@/lib/constants";
import { matchesCategory } from "@/lib/list-utils";

const SORT_OPTIONS = [
  { value: "name_asc", label: "Company A–Z" },
  { value: "name_desc", label: "Company Z–A" },
  { value: "date_desc", label: "Newest First" },
  { value: "date_asc", label: "Oldest First" },
  { value: "category_asc", label: "Category A–Z" },
];

const SORT_GETTERS = {
  name_asc: (v) => v.companyName,
  name_desc: (v) => v.companyName,
  date_desc: (v) => new Date(v.createdAt),
  date_asc: (v) => new Date(v.createdAt),
  category_asc: (v) => v.category,
};

export function VendorManager({ vendors: initialVendors }) {
  const [vendors, setVendors] = useState(initialVendors);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [sort, setSort] = useState("name_asc");
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [error, setError] = useState("");

  const filtered = useMemo(() => {
    let items = vendors.filter((v) => {
      const matchSearch = matchesSearch(v, search, [
        (i) => i.companyName,
        (i) => i.contactPerson,
        (i) => i.email,
        (i) => i.gstNumber,
      ]);
      const matchCategory = matchesCategory(v.category, categoryFilter);
      const matchStatus = !statusFilter || v.status === statusFilter;
      return matchSearch && matchCategory && matchStatus;
    });
    return sortBy(items, sort, SORT_GETTERS);
  }, [vendors, search, categoryFilter, statusFilter, sort]);

  async function handleCreate(formData) {
    setError("");
    const result = await createVendorAction(formData);
    if (result.error) {
      setError(result.error);
      return;
    }
    setVendors((prev) => [result.vendor, ...prev]);
    setShowForm(false);
  }

  async function handleUpdate(formData) {
    setError("");
    const result = await updateVendorAction(editing.id, formData);
    if (result.error) {
      setError(result.error);
      return;
    }
    window.location.reload();
  }

  async function handleDelete(id) {
    if (!confirm("Delete this vendor and their login account?")) return;
    const result = await deleteVendorAction(id);
    if (result.error) {
      setError(result.error);
      return;
    }
    setVendors((prev) => prev.filter((v) => v.id !== id));
  }

  return (
    <div className="space-y-6">
      <ListToolbar
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search vendors by name, email, GST..."
        categoryFilter={categoryFilter}
        onCategoryChange={setCategoryFilter}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        statusOptions={VENDOR_STATUS_OPTIONS}
        sort={sort}
        onSortChange={setSort}
        sortOptions={SORT_OPTIONS}
        resultCount={filtered.length}
        totalCount={vendors.length}
        actions={
          <Button
            onClick={() => { setShowForm(true); setEditing(null); }}
            className="bg-emerald-500 text-black hover:bg-emerald-400"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Vendor
          </Button>
        }
      />

      {error && (
        <div className="rounded-lg bg-red-500/10 px-4 py-3 text-sm text-red-400">{error}</div>
      )}

      {(showForm || editing) && (
        <div className="rounded-xl border border-border bg-card p-6">
          <h3 className="mb-2 text-lg font-semibold">
            {editing ? "Edit Vendor" : "Register New Vendor"}
          </h3>
          {!editing && (
            <p className="mb-4 text-sm text-muted-foreground">
              Creates a vendor profile and login account. The vendor can sign in immediately — no self-registration needed.
            </p>
          )}
          <form
            action={editing ? handleUpdate : handleCreate}
            className="space-y-4"
          >
            <VendorForm
              mode={editing ? "admin-edit" : "admin-create"}
              defaultValues={
                editing
                  ? {
                      ...editing,
                      country: editing.user?.country,
                      additionalInfo: editing.user?.additionalInfo,
                    }
                  : {}
              }
            />
            <div className="flex gap-2">
              <Button type="submit" className="bg-emerald-500 text-black hover:bg-emerald-400">
                {editing ? "Update Vendor" : "Register Vendor"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => { setShowForm(false); setEditing(null); }}
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      )}

      <div className="rounded-xl border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Company Name</TableHead>
              <TableHead>Contact Person</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>GST Number</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Account</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((vendor) => (
              <TableRow key={vendor.id}>
                <TableCell className="font-medium">{vendor.companyName}</TableCell>
                <TableCell>{vendor.contactPerson}</TableCell>
                <TableCell>{vendor.email}</TableCell>
                <TableCell>{vendor.phone}</TableCell>
                <TableCell>{vendor.gstNumber || "—"}</TableCell>
                <TableCell>{vendor.category}</TableCell>
                <TableCell>
                  <Badge variant={vendor.userId ? "success" : "warning"}>
                    {vendor.userId ? "Registered" : "No Account"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={vendor.status === "ACTIVE" ? "success" : "warning"}>
                    {vendor.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => { setEditing(vendor); setShowForm(false); }}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => handleDelete(vendor.id)}
                    >
                      <Trash2 className="h-4 w-4 text-red-400" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={9} className="py-8 text-center text-muted-foreground">
                  No vendors found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
