import Link from "next/link";
import { Plus } from "lucide-react";
import { getCurrentUser } from "@/lib/auth";
import { getRFQs } from "@/app/actions/rfqs";
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

export default async function RFQsPage() {
  const user = await getCurrentUser();
  const rfqs = await getRFQs();

  const statusColor = {
    OPEN: "success",
    DRAFT: "warning",
    CLOSED: "secondary",
    AWARDED: "default",
  };

  return (
    <>
      <Topbar user={user} title="RFQs" subtitle="Request for Quotations management" />
      <div className="space-y-6 p-8">
        {(user.role === "ADMIN" || user.role === "PROCUREMENT_OFFICER") && (
          <div className="flex justify-end">
            <Link href="/rfqs/create">
              <Button className="bg-emerald-500 text-black hover:bg-emerald-400">
                <Plus className="mr-2 h-4 w-4" />
                Create RFQ
              </Button>
            </Link>
          </div>
        )}

        <div className="rounded-xl border border-border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Deadline</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Quotations</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rfqs.map((rfq) => (
                <TableRow key={rfq.id}>
                  <TableCell className="font-medium">{rfq.title}</TableCell>
                  <TableCell>{rfq.category}</TableCell>
                  <TableCell>{rfq.quantity}</TableCell>
                  <TableCell>{new Date(rfq.deadline).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Badge variant={statusColor[rfq.status] || "outline"}>{rfq.status}</Badge>
                  </TableCell>
                  <TableCell>{rfq._count.quotations}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      {rfq._count.quotations > 0 &&
                        (user.role === "ADMIN" || user.role === "PROCUREMENT_OFFICER") && (
                          <Link href={`/quotations/compare/${rfq.id}`}>
                            <Button variant="outline" size="sm" className="text-emerald-400">
                              Compare
                            </Button>
                          </Link>
                        )}
                      {user.role === "VENDOR" && rfq.status === "OPEN" && (
                        <Link href="/quotations/submit">
                          <Button variant="outline" size="sm" className="text-emerald-400">
                            Submit Quote
                          </Button>
                        </Link>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {rfqs.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="py-8 text-center text-muted-foreground">
                    No RFQs found
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
