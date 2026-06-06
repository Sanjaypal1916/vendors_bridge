import { notFound } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { getInvoiceById } from "@/app/actions/invoices";
import { Topbar } from "@/components/layout/topbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { InvoiceActions } from "@/components/invoices/invoice-actions";

export default async function InvoiceDetailPage({ params }) {
  const user = await getCurrentUser();
  const { id } = await params;
  const invoice = await getInvoiceById(id);

  if (!invoice) notFound();

  const { purchaseOrder: po } = invoice;
  const { quotation } = po;
  const { vendor, rfq } = quotation;

  return (
    <>
      <Topbar
        user={user}
        title="Purchase Order & Invoice"
        subtitle={`Invoice ${invoice.invoiceNumber} — PO ${po.poNumber}`}
      />
      <div className="p-8">
        <div className="mb-6">
          <InvoiceActions invoiceId={invoice.id} />
        </div>

        <Card className="print:border-none print:shadow-none" id="invoice-document">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <div className="mb-2 flex items-center gap-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500">
                    <span className="text-sm font-bold text-black">VB</span>
                  </div>
                  <span className="text-lg font-bold text-emerald-400">VendorBridge</span>
                </div>
                <CardTitle className="text-2xl">INVOICE</CardTitle>
              </div>
              <div className="text-right text-sm">
                <p className="font-semibold">{invoice.invoiceNumber}</p>
                <p className="text-muted-foreground">PO: {po.poNumber}</p>
                <p className="text-muted-foreground">
                  {new Date(invoice.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <h4 className="mb-2 font-semibold">Bill To</h4>
                <p>{vendor.companyName}</p>
                <p className="text-sm text-muted-foreground">{vendor.contactPerson}</p>
                <p className="text-sm text-muted-foreground">{vendor.email}</p>
                {vendor.gstNumber && (
                  <p className="text-sm text-muted-foreground">GST: {vendor.gstNumber}</p>
                )}
              </div>
              <div>
                <h4 className="mb-2 font-semibold">Order Details</h4>
                <p>{rfq.title}</p>
                <p className="text-sm text-muted-foreground">Quantity: {rfq.quantity}</p>
              </div>
            </div>

            <div className="rounded-lg border border-border">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-emerald-500/10">
                    <th className="p-3 text-left">Item</th>
                    <th className="p-3 text-right">Qty</th>
                    <th className="p-3 text-right">Price</th>
                    <th className="p-3 text-right">Total</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="p-3">{rfq.title}</td>
                    <td className="p-3 text-right">{rfq.quantity}</td>
                    <td className="p-3 text-right">${invoice.subtotal.toLocaleString()}</td>
                    <td className="p-3 text-right">${invoice.subtotal.toLocaleString()}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="flex justify-end">
              <div className="w-64 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>${invoice.subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tax (GST 18%)</span>
                  <span>${invoice.tax.toLocaleString()}</span>
                </div>
                <div className="flex justify-between border-t border-border pt-2 text-lg font-bold">
                  <span>Grand Total</span>
                  <span className="text-emerald-400">${invoice.total.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
