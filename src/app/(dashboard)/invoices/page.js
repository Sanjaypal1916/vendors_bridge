import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { getInvoices } from "@/app/actions/invoices";
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

export default async function InvoicesPage() {
  const user = await getCurrentUser();
  const invoices = await getInvoices();

  return (
    <>
      <Topbar user={user} title="Invoices" subtitle="View and manage invoices" />
      <div className="p-8">
        <div className="rounded-xl border border-border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice #</TableHead>
                <TableHead>PO Number</TableHead>
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
              {invoices.map((inv) => (
                <TableRow key={inv.id}>
                  <TableCell className="font-medium">{inv.invoiceNumber}</TableCell>
                  <TableCell>{inv.purchaseOrder.poNumber}</TableCell>
                  <TableCell>
                    {inv.purchaseOrder.quotation.vendor.companyName}
                  </TableCell>
                  <TableCell>${inv.subtotal.toLocaleString()}</TableCell>
                  <TableCell>${inv.tax.toLocaleString()}</TableCell>
                  <TableCell className="font-semibold text-emerald-400">
                    ${inv.total.toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <Badge variant={inv.status === "SENT" ? "success" : "outline"}>
                      {inv.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{new Date(inv.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Link href={`/invoices/${inv.id}`}>
                      <Button variant="outline" size="sm" className="text-emerald-400">
                        View
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
              {invoices.length === 0 && (
                <TableRow>
                  <TableCell colSpan={9} className="py-8 text-center text-muted-foreground">
                    No invoices found
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
