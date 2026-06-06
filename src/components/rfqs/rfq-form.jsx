"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createRFQAction } from "@/app/actions/rfqs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { RFQ_CATEGORIES } from "@/lib/constants";
import { cn } from "@/lib/utils";

function vendorMatchesCategory(vendorCategory, rfqCategory) {
  return vendorCategory === rfqCategory;
}

export function RFQForm({ vendors }) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");

  const eligibleVendors = vendors.filter((v) =>
    vendorMatchesCategory(v.category, selectedCategory)
  );

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setLoading(true);

    const form = event.currentTarget;
    const formData = new FormData(form);

    const title = formData.get("title")?.toString().trim();
    const category = formData.get("category")?.toString();
    const quantity = formData.get("quantity")?.toString();
    const deadline = formData.get("deadline")?.toString();

    const vendorIds = formData.getAll("vendorIds").filter(Boolean);

    if (!title || !category || !quantity || !deadline) {
      setError("Title, category, quantity, and deadline are required.");
      setStep(1);
      setLoading(false);
      return;
    }

    if (vendorIds.length === 0) {
      setError(
        `Please select at least one vendor in the "${category}" category.`
      );
      setStep(3);
      setLoading(false);
      return;
    }

    try {
      const result = await createRFQAction(formData);
      if (result?.error) {
        setError(result.error);
        setLoading(false);
        return;
      }
      router.push("/rfqs");
      router.refresh();
    } catch (err) {
      setError("Failed to save RFQ. Please try again.");
      setLoading(false);
    }
  }

  function handleNext() {
    setError("");
    const form = document.getElementById("rfq-form");
    const title = form?.title?.value?.trim();
    const category = form?.category?.value;
    const quantity = form?.quantity?.value;
    const deadline = form?.deadline?.value;

    if (!title || !category || !quantity || !deadline) {
      setError("Please fill in title, category, quantity, and deadline before continuing.");
      return;
    }

    setSelectedCategory(category);

    if (step === 2) {
      const matching = vendors.filter((v) => vendorMatchesCategory(v.category, category));
      if (matching.length === 0) {
        setError(
          `No active vendors found for "${category}". Add vendors in this category before continuing.`
        );
        return;
      }
    }

    setStep((s) => Math.min(s + 1, 3));
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

      <form id="rfq-form" onSubmit={handleSubmit} className="space-y-6">
        <div hidden={step !== 1}>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">RFQ Title</Label>
                <Input id="title" name="title" placeholder="Enter RFQ title" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select
                  id="category"
                  name="category"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  <option value="" disabled>Select category</option>
                  {RFQ_CATEGORIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="quantity">Quantity</Label>
                <Input id="quantity" name="quantity" type="number" min="1" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="deadline">Deadline</Label>
                <Input id="deadline" name="deadline" type="date" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" name="description" rows={10} placeholder="Describe the requirements..." />
            </div>
          </div>
        </div>

        <div hidden={step !== 2}>
          <div className="rounded-xl border border-border bg-card p-6">
            <p className="text-sm text-muted-foreground">
              Review the RFQ details in step 1. Items are defined by title, quantity, and description.
            </p>
            {selectedCategory && (
              <p className="mt-2 text-sm text-emerald-400">
                Category: {selectedCategory} — only vendors in this category can be assigned next.
              </p>
            )}
          </div>
        </div>

        <div hidden={step !== 3}>
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <Label>Assign Vendors <span className="text-red-400">*</span></Label>
              {selectedCategory && (
                <Badge variant="success">{selectedCategory}</Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground">
              Select vendors matching the RFQ category. Other vendors are shown but cannot be selected.
              {eligibleVendors.length > 0 && (
                <span className="text-emerald-400">
                  {" "}{eligibleVendors.length} eligible vendor{eligibleVendors.length !== 1 ? "s" : ""} available.
                </span>
              )}
            </p>
            {vendors.length === 0 ? (
              <p className="text-sm text-amber-400">
                No active vendors found. Add vendors from the Vendors page before creating an RFQ.
              </p>
            ) : (
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {vendors.map((vendor) => {
                  const isEligible = vendorMatchesCategory(vendor.category, selectedCategory);
                  return (
                    <label
                      key={vendor.id}
                      className={cn(
                        "flex items-center gap-3 rounded-lg border p-4 transition-colors",
                        isEligible
                          ? "cursor-pointer border-border hover:border-emerald-500/30"
                          : "cursor-not-allowed border-border/50 bg-white/5 opacity-50"
                      )}
                    >
                      <input
                        type="checkbox"
                        name="vendorIds"
                        value={vendor.id}
                        disabled={!isEligible}
                        className="h-4 w-4 accent-emerald-500 disabled:cursor-not-allowed"
                      />
                      <div className="min-w-0 flex-1">
                        <p className={cn("text-sm font-medium", !isEligible && "text-muted-foreground")}>
                          {vendor.companyName}
                        </p>
                        <p className="text-xs text-muted-foreground">{vendor.category}</p>
                        {!isEligible && (
                          <p className="mt-1 text-xs text-amber-400/80">Category does not match</p>
                        )}
                      </div>
                    </label>
                  );
                })}
              </div>
            )}
            {vendors.length > 0 && eligibleVendors.length === 0 && (
              <p className="text-sm text-amber-400">
                No vendors match &quot;{selectedCategory}&quot;. Go back and change the category or add vendors in this category.
              </p>
            )}
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
              onClick={handleNext}
            >
              Next
            </Button>
          ) : (
            <Button
              type="submit"
              disabled={loading || eligibleVendors.length === 0}
              className="bg-emerald-500 text-black hover:bg-emerald-400"
            >
              {loading ? "Saving..." : "Save RFQ"}
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}
