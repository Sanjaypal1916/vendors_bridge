import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser, requireRole } from "@/lib/auth";
import { getApprovals } from "@/app/actions/approvals";
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

export default async function ApprovalsPage() {
  const user = await getCurrentUser();
  if (!requireRole(user, ["ADMIN", "PROCUREMENT_OFFICER"])) {
    redirect("/dashboard");
  }

  const approvals = await getApprovals();

  const statusVariant = {
    PENDING: "warning",
    APPROVED: "success",
    REJECTED: "destructive",
  };

  return (
    <>
      <Topbar user={user} title="Approval Workflow" subtitle="Review and approve quotations" />
      <div className="p-8">
        <div className="rounded-xl border border-border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>RFQ</TableHead>
                <TableHead>Vendor</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Approved By</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {approvals.map((a) => (
                <TableRow key={a.id}>
                  <TableCell className="font-medium">{a.quotation.rfq.title}</TableCell>
                  <TableCell>{a.quotation.vendor.companyName}</TableCell>
                  <TableCell className="text-emerald-400">
                    ${a.quotation.price.toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <Badge variant={statusVariant[a.status]}>{a.status}</Badge>
                  </TableCell>
                  <TableCell>{a.approvedBy?.name || "—"}</TableCell>
                  <TableCell>
                    {a.approvedAt
                      ? new Date(a.approvedAt).toLocaleDateString()
                      : new Date(a.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Link href={`/approvals/${a.id}`}>
                      <Button variant="outline" size="sm" className="text-emerald-400">
                        Review
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
              {approvals.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="py-8 text-center text-muted-foreground">
                    No approvals found
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
