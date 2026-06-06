"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2, Search } from "lucide-react";
import {
  createVendorAction,
  updateVendorAction,
  deleteVendorAction,
} from "@/app/actions/vendors";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { VENDOR_CATEGORIES } from "@/lib/constants";

export function VendorManager({ vendors: initialVendors }) {
  const [vendors, setVendors] = useState(initialVendors);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [error, setError] = useState("");

  const filtered = vendors.filter((v) => {
    const matchSearch =
      !search ||
      v.companyName.toLowerCase().includes(search.toLowerCase()) ||
      v.contactPerson.toLowerCase().includes(search.toLowerCase()) ||
      v.email.toLowerCase().includes(search.toLowerCase());
    const matchCategory = !categoryFilter || v.category === categoryFilter;
    const matchStatus = !statusFilter || v.status === statusFilter;
    return matchSearch && matchCategory && matchStatus;
  });

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
    if (!confirm("Delete this vendor?")) return;
    const result = await deleteVendorAction(id);
    if (result.error) {
      setError(result.error);
      return;
    }
    setVendors((prev) => prev.filter((v) => v.id !== id));
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search vendors..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          <Select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
            <option value="">All Categories</option>
            {VENDOR_CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </Select>
          <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="">All Status</option>
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
            <option value="PENDING">Pending</option>
          </Select>
          <Button
            onClick={() => { setShowForm(true); setEditing(null); }}
            className="bg-emerald-500 text-black hover:bg-emerald-400"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Vendor
          </Button>
        </div>
      </div>

      {error && (
        <div className="rounded-lg bg-red-500/10 px-4 py-3 text-sm text-red-400">{error}</div>
      )}

      {(showForm || editing) && (
        <div className="rounded-xl border border-border bg-card p-6">
          <h3 className="mb-4 text-lg font-semibold">
            {editing ? "Edit Vendor" : "Add New Vendor"}
          </h3>
          <form
            action={editing ? handleUpdate : handleCreate}
            className="grid grid-cols-1 gap-4 sm:grid-cols-2"
          >
            <div className="space-y-2">
              <Label>Company Name</Label>
              <Input name="companyName" defaultValue={editing?.companyName} required />
            </div>
            <div className="space-y-2">
              <Label>Contact Person</Label>
              <Input name="contactPerson" defaultValue={editing?.contactPerson} required />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input name="email" type="email" defaultValue={editing?.email} required />
            </div>
            <div className="space-y-2">
              <Label>Phone</Label>
              <Input name="phone" defaultValue={editing?.phone} required />
            </div>
            <div className="space-y-2">
              <Label>GST Number</Label>
              <Input name="gstNumber" defaultValue={editing?.gstNumber || ""} />
            </div>
            <div className="space-y-2">
              <Label>Category</Label>
              <Select name="category" defaultValue={editing?.category || ""} required>
                <option value="" disabled>Select category</option>
                {VENDOR_CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <Select name="status" defaultValue={editing?.status || "ACTIVE"}>
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
                <option value="PENDING">Pending</option>
              </Select>
            </div>
            <div className="flex items-end gap-2 sm:col-span-2">
              <Button type="submit" className="bg-emerald-500 text-black hover:bg-emerald-400">
                {editing ? "Update Vendor" : "Save Vendor"}
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
                <TableCell colSpan={8} className="py-8 text-center text-muted-foreground">
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
