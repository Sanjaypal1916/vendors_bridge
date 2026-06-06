import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { getQuotations } from "@/app/actions/quotations";
import { Topbar } from "@/components/layout/topbar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default async function QuotationsPage() {
  const user = await getCurrentUser();
  const quotations = await getQuotations();

  return (
    <>
      <Topbar user={user} title="Quotations" subtitle="View and manage quotations" />
      <div className="space-y-6 p-8">
        {user.role === "VENDOR" && (
          <div className="flex justify-end">
            <Link href="/quotations/submit">
              <Button className="bg-emerald-500 text-black hover:bg-emerald-400">
                Submit Quotation
              </Button>
            </Link>
          </div>
        )}

        <div className="rounded-xl border border-border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>RFQ</TableHead>
                <TableHead>Vendor</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Delivery Days</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {quotations.map((q) => (
                <TableRow key={q.id}>
                  <TableCell className="font-medium">{q.rfq.title}</TableCell>
                  <TableCell>{q.vendor.companyName}</TableCell>
                  <TableCell className="text-emerald-400">${q.price.toLocaleString()}</TableCell>
                  <TableCell>{q.deliveryDays} days</TableCell>
                  <TableCell>
                    <Badge variant={q.status === "SELECTED" ? "success" : "outline"}>
                      {q.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{new Date(q.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell>
                    {(user.role === "ADMIN" || user.role === "PROCUREMENT_OFFICER") && (
                      <Link href={`/quotations/compare/${q.rfqId}`}>
                        <Button variant="outline" size="sm" className="text-emerald-400">
                          Compare
                        </Button>
                      </Link>
                    )}
                  </TableCell>
                </TableRow>
              ))}
              {quotations.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="py-8 text-center text-muted-foreground">
                    No quotations found
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
