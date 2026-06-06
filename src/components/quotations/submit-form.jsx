"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { submitQuotationAction } from "@/app/actions/quotations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function SubmitQuotationForm({ rfqs, defaultRfqId }) {
  const router = useRouter();
  const [error, setError] = useState("");
  const initialRfq =
    defaultRfqId && rfqs.some((r) => r.id === defaultRfqId)
      ? defaultRfqId
      : rfqs[0]?.id || "";
  const [selectedRfq, setSelectedRfq] = useState(initialRfq);

  const rfq = rfqs.find((r) => r.id === selectedRfq);

  async function handleSubmit(formData) {
    setError("");
    const result = await submitQuotationAction(formData);
    if (result.error) {
      setError(result.error);
      return;
    }
    router.push("/quotations");
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="rounded-lg bg-red-500/10 px-4 py-3 text-sm text-red-400">{error}</div>
      )}

      {rfq && (
        <div className="rounded-xl border border-border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>RFQ Title</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Deadline</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">{rfq.title}</TableCell>
                <TableCell>{rfq.category}</TableCell>
                <TableCell>{rfq.quantity}</TableCell>
                <TableCell>{new Date(rfq.deadline).toLocaleDateString()}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      )}

      <form action={handleSubmit} className="max-w-lg space-y-4">
        <div className="space-y-2">
          <Label>Select RFQ</Label>
          <Select
            name="rfqId"
            value={selectedRfq}
            onChange={(e) => setSelectedRfq(e.target.value)}
            required
          >
            {rfqs.map((r) => (
              <option key={r.id} value={r.id}>{r.title}</option>
            ))}
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Price ($)</Label>
          <Input name="price" type="number" step="0.01" min="0" required />
        </div>
        <div className="space-y-2">
          <Label>Delivery Days</Label>
          <Input name="deliveryDays" type="number" min="1" required />
        </div>
        <div className="space-y-2">
          <Label>Notes</Label>
          <Textarea name="notes" rows={4} placeholder="Additional notes or terms..." />
        </div>
        <Button type="submit" className="bg-emerald-500 text-black hover:bg-emerald-400">
          Submit Quotation
        </Button>
      </form>
    </div>
  );
}
