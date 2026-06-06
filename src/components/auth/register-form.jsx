"use client";

import { useState } from "react";
import { registerAction } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

export function RegisterForm() {
  const [error, setError] = useState("");

  async function handleSubmit(formData) {
    setError("");
    const result = await registerAction(formData);
    if (result?.error) setError(result.error);
  }

  return (
    <form action={handleSubmit} className="space-y-4">
      {error && (
        <div className="rounded-lg bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      )}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="firstName">First Name</Label>
          <Input id="firstName" name="firstName" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName">Last Name</Label>
          <Input id="lastName" name="lastName" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email Address</Label>
          <Input id="email" name="email" type="email" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number</Label>
          <Input id="phone" name="phone" type="tel" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="role">Job Role</Label>
          <Select id="role" name="role" required defaultValue="">
            <option value="" disabled>Select role</option>
            <option value="ADMIN">Admin</option>
            <option value="PROCUREMENT_OFFICER">Procurement Officer</option>
            <option value="VENDOR">Vendor</option>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="country">Country</Label>
          <Input id="country" name="country" />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input id="password" name="password" type="password" required minLength={6} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="additionalInfo">Additional Information</Label>
        <Textarea id="additionalInfo" name="additionalInfo" placeholder="Tell us more about your organization..." rows={3} />
      </div>
      <Button
        type="submit"
        className="w-full bg-emerald-500 text-black hover:bg-emerald-400"
      >
        Register
      </Button>
    </form>
  );
}
