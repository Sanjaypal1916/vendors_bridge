"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { VENDOR_CATEGORIES } from "@/lib/constants";

export function VendorForm({ mode = "admin-create", defaultValues = {} }) {
  const isEdit = mode === "admin-edit";
  const showStatus = mode === "admin-create" || mode === "admin-edit";
  const showPassword = mode === "admin-create" || mode === "vendor-register";

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <div className="space-y-2">
        <Label htmlFor="companyName">Company Name <span className="text-red-400">*</span></Label>
        <Input
          id="companyName"
          name="companyName"
          defaultValue={defaultValues.companyName || ""}
          placeholder="e.g. Zebra Supplies"
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="contactPerson">Contact Person <span className="text-red-400">*</span></Label>
        <Input
          id="contactPerson"
          name="contactPerson"
          defaultValue={defaultValues.contactPerson || ""}
          placeholder="Full name"
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Email <span className="text-red-400">*</span></Label>
        <Input
          id="email"
          name="email"
          type="email"
          defaultValue={defaultValues.email || ""}
          placeholder="vendor@company.com"
          required
          readOnly={isEdit}
          className={isEdit ? "opacity-70" : ""}
        />
        {isEdit && (
          <p className="text-xs text-muted-foreground">Email cannot be changed after registration.</p>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="phone">Phone <span className="text-red-400">*</span></Label>
        <Input
          id="phone"
          name="phone"
          type="tel"
          defaultValue={defaultValues.phone || ""}
          placeholder="+1-555-0100"
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="gstNumber">GST Number</Label>
        <Input
          id="gstNumber"
          name="gstNumber"
          defaultValue={defaultValues.gstNumber || ""}
          placeholder="GST-000000"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="category">Category <span className="text-red-400">*</span></Label>
        <Select
          id="category"
          name="category"
          defaultValue={defaultValues.category || ""}
          required
        >
          <option value="" disabled>Select category</option>
          {VENDOR_CATEGORIES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="country">Country</Label>
        <Input
          id="country"
          name="country"
          defaultValue={defaultValues.country || ""}
          placeholder="e.g. USA"
        />
      </div>
      {showStatus && (
        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select id="status" name="status" defaultValue={defaultValues.status || "ACTIVE"}>
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
            <option value="PENDING">Pending</option>
          </Select>
        </div>
      )}
      {showPassword && (
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="password">Password <span className="text-red-400">*</span></Label>
          <Input
            id="password"
            name="password"
            type="password"
            minLength={6}
            placeholder="Minimum 6 characters"
            required
          />
          {mode === "admin-create" && (
            <p className="text-xs text-muted-foreground">
              The vendor will use this email and password to login. No self-registration needed.
            </p>
          )}
          {mode === "vendor-register" && (
            <p className="text-xs text-muted-foreground">
              If an admin already registered your company, please login instead of registering again.
            </p>
          )}
        </div>
      )}
      <div className="space-y-2 sm:col-span-2">
        <Label htmlFor="additionalInfo">Additional Information</Label>
        <Textarea
          id="additionalInfo"
          name="additionalInfo"
          defaultValue={defaultValues.additionalInfo || ""}
          placeholder="Company details, certifications, notes..."
          rows={3}
        />
      </div>
    </div>
  );
}
