"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createRFQAction } from "@/app/actions/rfqs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { RFQ_CATEGORIES } from "@/lib/constants";

export function RFQForm({ vendors }) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [step, setStep] = useState(1);

  async function handleSubmit(formData) {
    setError("");
    const result = await createRFQAction(formData);
    if (result.error) {
      setError(result.error);
      return;
    }
    router.push("/rfqs");
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex items-center gap-2">
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium ${
                step >= s
                  ? "bg-emerald-500 text-black"
                  : "bg-white/10 text-muted-foreground"
              }`}
            >
              {s}
            </div>
            <span className={`text-sm ${step >= s ? "text-emerald-400" : "text-muted-foreground"}`}>
              {s === 1 ? "Details" : s === 2 ? "Items" : "Vendors"}
            </span>
            {s < 3 && <div className="mx-2 h-px w-12 bg-border" />}
          </div>
        ))}
      </div>

      {error && (
        <div className="rounded-lg bg-red-500/10 px-4 py-3 text-sm text-red-400">{error}</div>
      )}

      <form action={handleSubmit} className="space-y-6">
        <div className={step === 1 ? "block" : "hidden"}>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>RFQ Title</Label>
                <Input name="title" placeholder="Enter RFQ title" required />
              </div>
              <div className="space-y-2">
                <Label>Category</Label>
                <Select name="category" required defaultValue="">
                  <option value="" disabled>Select category</option>
                  {RFQ_CATEGORIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Quantity</Label>
                <Input name="quantity" type="number" min="1" required />
              </div>
              <div className="space-y-2">
                <Label>Deadline</Label>
                <Input name="deadline" type="date" required />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea name="description" rows={10} placeholder="Describe the requirements..." />
            </div>
          </div>
        </div>

        <div className={step === 2 ? "block" : "hidden"}>
          <div className="rounded-xl border border-border bg-card p-6">
            <p className="text-sm text-muted-foreground">
              Review the RFQ details in step 1. Items are defined by title, quantity, and description.
            </p>
          </div>
        </div>

        <div className={step === 3 ? "block" : "hidden"}>
          <div className="space-y-4">
            <Label>Assign Vendors</Label>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {vendors.map((vendor) => (
                <label
                  key={vendor.id}
                  className="flex cursor-pointer items-center gap-3 rounded-lg border border-border p-4 hover:border-emerald-500/30"
                >
                  <input
                    type="checkbox"
                    name="vendorIds"
                    value={vendor.id}
                    className="h-4 w-4 accent-emerald-500"
                  />
                  <div>
                    <p className="text-sm font-medium">{vendor.companyName}</p>
                    <p className="text-xs text-muted-foreground">{vendor.category}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          {step > 1 && (
            <Button type="button" variant="outline" onClick={() => setStep(step - 1)}>
              Previous
            </Button>
          )}
          {step < 3 ? (
            <Button
              type="button"
              className="bg-emerald-500 text-black hover:bg-emerald-400"
              onClick={() => setStep(step + 1)}
            >
              Next
            </Button>
          ) : (
            <Button type="submit" className="bg-emerald-500 text-black hover:bg-emerald-400">
              Save RFQ
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}
