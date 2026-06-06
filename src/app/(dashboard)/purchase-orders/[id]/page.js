import Link from "next/link";
import { notFound } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { getPurchaseOrderById } from "@/app/actions/purchase-orders";
import { Topbar } from "@/components/layout/topbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default async function PurchaseOrderDetailPage({ params }) {
  const user = await getCurrentUser();
  const { id } = await params;
  const po = await getPurchaseOrderById(id);

  if (!po) notFound();

  const { quotation } = po;
  const { vendor, rfq } = quotation;

  return (
    <>
      <Topbar
        user={user}
        title="Purchase Order & Invoice"
        subtitle={`PO ${po.poNumber}`}
      />
      <div className="p-8">
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-2xl">{po.poNumber}</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Date: {new Date(po.createdAt).toLocaleDateString()}
                </p>
              </div>
              {po.invoice && (
                <Link href={`/invoices/${po.invoice.id}`}>
                  <Button className="bg-emerald-500 text-black hover:bg-emerald-400">
                    View Invoice
                  </Button>
                </Link>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <h4 className="mb-2 font-semibold">Vendor Details</h4>
                <p>{vendor.companyName}</p>
                <p className="text-sm text-muted-foreground">{vendor.contactPerson}</p>
                <p className="text-sm text-muted-foreground">{vendor.email}</p>
                <p className="text-sm text-muted-foreground">{vendor.phone}</p>
              </div>
              <div>
                <h4 className="mb-2 font-semibold">RFQ Details</h4>
                <p>{rfq.title}</p>
                <p className="text-sm text-muted-foreground">Qty: {rfq.quantity}</p>
                <p className="text-sm text-muted-foreground">Category: {rfq.category}</p>
              </div>
            </div>

            <div className="rounded-lg border border-border">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-white/5">
                    <th className="p-3 text-left">Item</th>
                    <th className="p-3 text-right">Qty</th>
                    <th className="p-3 text-right">Price</th>
                    <th className="p-3 text-right">Total</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-border">
                    <td className="p-3">{rfq.title}</td>
                    <td className="p-3 text-right">{rfq.quantity}</td>
                    <td className="p-3 text-right">${po.subtotal.toLocaleString()}</td>
                    <td className="p-3 text-right">${po.subtotal.toLocaleString()}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="flex justify-end">
              <div className="w-64 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>${po.subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tax (GST 18%)</span>
                  <span>${po.tax.toLocaleString()}</span>
                </div>
                <div className="flex justify-between border-t border-border pt-2 text-lg font-bold">
                  <span>Grand Total</span>
                  <span className="text-emerald-400">${po.total.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
