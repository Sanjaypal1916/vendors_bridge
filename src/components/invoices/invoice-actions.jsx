"use client";

import { useState } from "react";
import { Download, Printer, Mail } from "lucide-react";
import { emailInvoiceAction } from "@/app/actions/invoices";
import { Button } from "@/components/ui/button";

export function InvoiceActions({ invoiceId }) {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleEmail() {
    setLoading(true);
    setMessage("");
    const result = await emailInvoiceAction(invoiceId);
    setMessage(result.message);
    setLoading(false);
  }

  function handlePrint() {
    window.print();
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-3">
        <a href={`/api/invoice/${invoiceId}/pdf`} target="_blank" rel="noopener noreferrer">
          <Button variant="outline" className="border-emerald-500/30 text-emerald-400">
            <Download className="mr-2 h-4 w-4" />
            Download PDF
          </Button>
        </a>
        <Button
          variant="outline"
          className="border-emerald-500/30 text-emerald-400"
          onClick={handlePrint}
        >
          <Printer className="mr-2 h-4 w-4" />
          Print
        </Button>
        <Button
          variant="outline"
          className="border-emerald-500/30 text-emerald-400"
          onClick={handleEmail}
          disabled={loading}
        >
          <Mail className="mr-2 h-4 w-4" />
          {loading ? "Sending..." : "Email Invoice"}
        </Button>
      </div>
      {message && (
        <p className={`text-sm ${message.includes("success") ? "text-emerald-400" : "text-amber-400"}`}>
          {message}
        </p>
      )}
    </div>
  );
}
