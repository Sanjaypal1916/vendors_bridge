"use client";

import { useRouter } from "next/navigation";
import { selectWinnerAction } from "@/app/actions/quotations";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function ComparisonGrid({ quotations, rfq }) {
  const router = useRouter();

  if (quotations.length === 0) {
    return (
      <p className="py-8 text-center text-muted-foreground">
        No quotations received for this RFQ yet.
      </p>
    );
  }

  const lowestPrice = Math.min(...quotations.map((q) => q.price));
  const fastestDelivery = Math.min(...quotations.map((q) => q.deliveryDays));
  const selectionComplete =
    rfq?.status === "AWARDED" || quotations.some((q) => q.status === "SELECTED");
  const selectedQuotation = quotations.find((q) => q.status === "SELECTED");

  async function handleSelectWinner(quotationId) {
    const result = await selectWinnerAction(quotationId);
    if (result.success) {
      router.push(`/approvals`);
    }
  }

  return (
    <div className="overflow-x-auto">
      <div
        className="grid gap-4"
        style={{
          gridTemplateColumns: `140px repeat(${quotations.length}, minmax(200px, 1fr))`,
        }}
      >
        <div className="font-medium text-muted-foreground">Vendor</div>
        {quotations.map((q) => (
          <div
            key={`vendor-${q.id}`}
            className={`rounded-lg border p-4 ${
              q.status === "SELECTED"
                ? "border-emerald-500 bg-emerald-500/20"
                : q.price === lowestPrice
                  ? "border-emerald-500/50 bg-emerald-500/10"
                  : "border-border bg-card"
            }`}
          >
            <p className="font-semibold">{q.vendor.companyName}</p>
            {q.status === "SELECTED" && (
              <Badge variant="success" className="mt-1">Winner</Badge>
            )}
            {q.status === "REJECTED" && (
              <Badge variant="destructive" className="mt-1">Rejected</Badge>
            )}
            {q.status === "SUBMITTED" && q.price === lowestPrice && (
              <Badge variant="success" className="mt-1">Lowest Price</Badge>
            )}
          </div>
        ))}

        <div className="font-medium text-muted-foreground">Price</div>
        {quotations.map((q) => (
          <div
            key={`price-${q.id}`}
            className={`rounded-lg border p-4 ${
              q.price === lowestPrice
                ? "border-emerald-500/50 bg-emerald-500/10"
                : "border-border bg-card"
            }`}
          >
            <p className="text-2xl font-bold text-emerald-400">
              ${q.price.toLocaleString()}
            </p>
          </div>
        ))}

        <div className="font-medium text-muted-foreground">Delivery Days</div>
        {quotations.map((q) => (
          <div
            key={`delivery-${q.id}`}
            className={`rounded-lg border p-4 ${
              q.deliveryDays === fastestDelivery
                ? "border-emerald-500/50 bg-emerald-500/10"
                : "border-border bg-card"
            }`}
          >
            <p className="text-lg font-semibold">{q.deliveryDays} days</p>
            {q.deliveryDays === fastestDelivery && (
              <Badge variant="success" className="mt-1">Fastest</Badge>
            )}
          </div>
        ))}

        <div className="font-medium text-muted-foreground">Notes</div>
        {quotations.map((q) => (
          <div key={`notes-${q.id}`} className="rounded-lg border border-border bg-card p-4">
            <p className="text-sm text-muted-foreground">{q.notes || "—"}</p>
          </div>
        ))}

        {selectionComplete ? (
          <>
            <div className="font-medium text-muted-foreground">Result</div>
            {quotations.map((q) => (
              <div key={`result-${q.id}`} className="p-2">
                {q.status === "SELECTED" ? (
                  <div className="rounded-lg border border-emerald-500/50 bg-emerald-500/10 p-3 text-center">
                    <p className="text-sm font-semibold text-emerald-400">Selected Winner</p>
                  </div>
                ) : q.status === "REJECTED" ? (
                  <div className="rounded-lg border border-border bg-white/5 p-3 text-center">
                    <p className="text-sm text-muted-foreground">Not Selected</p>
                  </div>
                ) : null}
              </div>
            ))}
          </>
        ) : (
          <>
            <div className="font-medium text-muted-foreground">Action</div>
            {quotations.map((q) => (
              <div key={`action-${q.id}`} className="p-2">
                <Button
                  onClick={() => handleSelectWinner(q.id)}
                  className="w-full bg-emerald-500 text-black hover:bg-emerald-400"
                >
                  Select Winner
                </Button>
              </div>
            ))}
          </>
        )}
      </div>

      {selectionComplete && selectedQuotation && (
        <p className="mt-4 text-sm text-muted-foreground">
          Winner selected: <span className="text-emerald-400">{selectedQuotation.vendor.companyName}</span>.
          Comparison is read-only. Proceed to Approvals to complete the workflow.
        </p>
      )}
    </div>
  );
}
