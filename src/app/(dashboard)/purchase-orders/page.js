import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { getPurchaseOrders } from "@/app/actions/purchase-orders";
import { Topbar } from "@/components/layout/topbar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default async function PurchaseOrdersPage() {
  const user = await getCurrentUser();
  const orders = await getPurchaseOrders();

  return (
    <>
      <Topbar user={user} title="Purchase Orders" subtitle="View generated purchase orders" />
      <div className="p-8">
        <div className="rounded-xl border border-border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>PO Number</TableHead>
                <TableHead>RFQ</TableHead>
                <TableHead>Vendor</TableHead>
                <TableHead>Subtotal</TableHead>
                <TableHead>Tax</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((po) => (
                <TableRow key={po.id}>
                  <TableCell className="font-medium">{po.poNumber}</TableCell>
                  <TableCell>{po.quotation.rfq.title}</TableCell>
                  <TableCell>{po.quotation.vendor.companyName}</TableCell>
                  <TableCell>${po.subtotal.toLocaleString()}</TableCell>
                  <TableCell>${po.tax.toLocaleString()}</TableCell>
                  <TableCell className="font-semibold text-emerald-400">
                    ${po.total.toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <Badge variant="success">{po.status}</Badge>
                  </TableCell>
                  <TableCell>{new Date(po.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Link href={`/purchase-orders/${po.id}`}>
                      <Button variant="outline" size="sm" className="text-emerald-400">
                        View
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
              {orders.length === 0 && (
                <TableRow>
                  <TableCell colSpan={9} className="py-8 text-center text-muted-foreground">
                    No purchase orders found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </>
  );
}
