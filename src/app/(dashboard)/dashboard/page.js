import Link from "next/link";
import {
  FileText,
  CheckCircle,
  ShoppingCart,
  Building2,
  Plus,
} from "lucide-react";
import { getCurrentUser } from "@/lib/auth";
import { getDashboardStats } from "@/app/actions/dashboard";
import { Topbar } from "@/components/layout/topbar";
import { StatCard } from "@/components/layout/stat-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { DashboardChart } from "@/components/charts/dashboard-chart";
import { ROLE_LABELS } from "@/lib/constants";

export default async function DashboardPage() {
  const user = await getCurrentUser();
  const stats = await getDashboardStats();

  const statusColor = {
    OPEN: "success",
    DRAFT: "warning",
    CLOSED: "secondary",
    AWARDED: "default",
  };

  return (
    <>
      <Topbar
        user={user}
        title="Dashboard"
        subtitle={`Welcome back, ${ROLE_LABELS[user.role]} — Today's Overview`}
      />
      <div className="space-y-6 p-8">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard title="Active RFQs" value={stats.activeRFQs} icon={FileText} />
          <StatCard title="Pending Approvals" value={stats.pendingApprovals} icon={CheckCircle} />
          <StatCard
            title="Total Spend"
            value={`$${stats.totalSpend.toLocaleString()}`}
            icon={ShoppingCart}
          />
          <StatCard title="Total Vendors" value={stats.totalVendors} icon={Building2} />
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Recent RFQs</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Quotes</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {stats.recentRFQs.map((rfq) => (
                    <TableRow key={rfq.id}>
                      <TableCell className="font-medium">{rfq.title}</TableCell>
                      <TableCell>
                        <Badge variant={statusColor[rfq.status] || "outline"}>
                          {rfq.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{rfq._count.quotations}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {new Date(rfq.createdAt).toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Procurement Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <DashboardChart data={stats.rfqByStatus} />
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Recent Quotations</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>RFQ</TableHead>
                  <TableHead>Vendor</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Delivery</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {stats.recentQuotations.map((q) => (
                  <TableRow key={q.id}>
                    <TableCell>{q.rfq.title}</TableCell>
                    <TableCell>{q.vendor.companyName}</TableCell>
                    <TableCell className="font-medium text-emerald-400">
                      ${q.price.toLocaleString()}
                    </TableCell>
                    <TableCell>{q.deliveryDays} days</TableCell>
                    <TableCell>
                      <Badge variant={q.status === "SELECTED" ? "success" : "outline"}>
                        {q.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {(user.role === "ADMIN" || user.role === "PROCUREMENT_OFFICER") && (
          <div className="flex flex-wrap gap-3">
            <Link href="/vendors">
              <Button variant="outline" className="border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10">
                <Plus className="mr-2 h-4 w-4" />
                Create Vendor
              </Button>
            </Link>
            <Link href="/rfqs/create">
              <Button variant="outline" className="border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10">
                <Plus className="mr-2 h-4 w-4" />
                Create RFQ
              </Button>
            </Link>
            <Link href="/reports">
              <Button variant="outline" className="border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10">
                View Reports
              </Button>
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
