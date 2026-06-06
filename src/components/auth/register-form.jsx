"use client";

import { useState } from "react";
import { registerAction } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { VendorForm } from "@/components/vendors/vendor-form";

export function RegisterForm() {
  const [error, setError] = useState("");
  const [role, setRole] = useState("");

  async function handleSubmit(formData) {
    setError("");
    const result = await registerAction(formData);
    if (result?.error) setError(result.error);
  }

  const isVendor = role === "VENDOR";

  return (
    <form action={handleSubmit} className="space-y-4">
      {error && (
        <div className="rounded-lg bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="role">Register As <span className="text-red-400">*</span></Label>
        <Select
          id="role"
          name="role"
          required
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          <option value="" disabled>Select role</option>
          <option value="VENDOR">Vendor (Supplier)</option>
          <option value="PROCUREMENT_OFFICER">Procurement Officer</option>
          <option value="ADMIN">Admin</option>
        </Select>
      </div>

      {isVendor ? (
        <>
          <p className="text-sm text-muted-foreground">
            Register your company as a vendor. If an admin already created your account, please{" "}
            <a href="/login" className="text-emerald-400 hover:underline">login</a> instead.
          </p>
          <VendorForm mode="vendor-register" />
        </>
      ) : role ? (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name <span className="text-red-400">*</span></Label>
              <Input id="firstName" name="firstName" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name <span className="text-red-400">*</span></Label>
              <Input id="lastName" name="lastName" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address <span className="text-red-400">*</span></Label>
              <Input id="email" name="email" type="email" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input id="phone" name="phone" type="tel" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="country">Country</Label>
              <Input id="country" name="country" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password <span className="text-red-400">*</span></Label>
            <Input id="password" name="password" type="password" required minLength={6} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="additionalInfo">Additional Information</Label>
            <Textarea
              id="additionalInfo"
              name="additionalInfo"
              placeholder="Tell us more about your organization..."
              rows={3}
            />
          </div>
        </>
      ) : null}

      {role && (
        <Button
          type="submit"
          className="w-full bg-emerald-500 text-black hover:bg-emerald-400"
        >
          Register
        </Button>
      )}
    </form>
  );
}
