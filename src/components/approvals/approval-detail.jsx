"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  approveQuotationAction,
  rejectQuotationAction,
} from "@/app/actions/approvals";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, Clock } from "lucide-react";

export function ApprovalDetail({ approval, history }) {
  const router = useRouter();
  const [remarks, setRemarks] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { quotation } = approval;
  const isPending = approval.status === "PENDING";

  async function handleApprove() {
    setLoading(true);
    setError("");
    const result = await approveQuotationAction(approval.id, remarks);
    if (result.error) {
      setError(result.error);
      setLoading(false);
      return;
    }
    router.refresh();
    setLoading(false);
  }

  async function handleReject() {
    setLoading(true);
    setError("");
    const result = await rejectQuotationAction(approval.id, remarks);
    if (result.error) {
      setError(result.error);
      setLoading(false);
      return;
    }
    router.refresh();
    setLoading(false);
  }

  const steps = [
    { label: "Pending", status: "PENDING", icon: Clock },
    { label: "Approved", status: "APPROVED", icon: CheckCircle },
    { label: "PO Generated", status: "APPROVED", icon: CheckCircle },
  ];

  const currentStep =
    approval.status === "APPROVED" ? 2 : approval.status === "REJECTED" ? -1 : 0;

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <div className="space-y-6 lg:col-span-2">
        <div className="rounded-xl border border-border bg-card p-6">
          <div className="mb-6">
            <p className="text-sm text-muted-foreground">RFQ</p>
            <h3 className="text-xl font-semibold">{quotation.rfq.title}</h3>
            <p className="mt-2 text-emerald-400">
              Winner: {quotation.vendor.companyName} — ${quotation.price.toLocaleString()}
            </p>
          </div>

          <div className="mb-8 flex items-center gap-4">
            {steps.map((step, i) => {
              const Icon = step.icon;
              const active = i <= currentStep;
              return (
                <div key={step.label} className="flex items-center gap-2">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-full ${
                      active ? "bg-emerald-500 text-black" : "bg-white/10 text-muted-foreground"
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className={`text-sm ${active ? "text-emerald-400" : "text-muted-foreground"}`}>
                    {step.label}
                  </span>
                  {i < steps.length - 1 && (
                    <div className={`mx-2 h-px w-16 ${active ? "bg-emerald-500" : "bg-border"}`} />
                  )}
                </div>
              );
            })}
          </div>

          {error && (
            <div className="mb-4 rounded-lg bg-red-500/10 px-4 py-3 text-sm text-red-400">
              {error}
            </div>
          )}

          {isPending ? (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Approval Remarks</Label>
                <Textarea
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  rows={4}
                  placeholder="Enter approval or rejection remarks..."
                />
              </div>
              <div className="flex gap-3">
                <Button
                  onClick={handleApprove}
                  disabled={loading}
                  className="bg-emerald-500 text-black hover:bg-emerald-400"
                >
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Approve
                </Button>
                <Button
                  onClick={handleReject}
                  disabled={loading}
                  variant="destructive"
                >
                  <XCircle className="mr-2 h-4 w-4" />
                  Reject
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <Badge variant={approval.status === "APPROVED" ? "success" : "destructive"}>
                {approval.status}
              </Badge>
              {approval.remarks && (
                <p className="text-sm text-muted-foreground">{approval.remarks}</p>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card p-6">
        <h3 className="mb-4 text-lg font-semibold">Approval History</h3>
        <div className="space-y-4">
          {history.map((item, i) => (
            <div key={i} className="flex gap-3">
              <div className="flex flex-col items-center">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500/20">
                  <CheckCircle className="h-4 w-4 text-emerald-400" />
                </div>
                {i < history.length - 1 && (
                  <div className="my-1 h-full w-px bg-border" />
                )}
              </div>
              <div className="pb-4">
                <p className="text-sm font-medium">{item.description}</p>
                <p className="text-xs text-muted-foreground">
                  {new Date(item.createdAt).toLocaleString()}
                </p>
              </div>
            </div>
          ))}
          {history.length === 0 && (
            <p className="text-sm text-muted-foreground">No history yet</p>
          )}
        </div>
      </div>
    </div>
  );
}
