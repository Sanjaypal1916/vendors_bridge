import { redirect } from "next/navigation";
import { DollarSign, Building2, FileText, CheckCircle } from "lucide-react";
import { getCurrentUser, requireRole } from "@/lib/auth";
import { getReportsData } from "@/app/actions/reports";
import { Topbar } from "@/components/layout/topbar";
import { StatCard } from "@/components/layout/stat-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { MonthlySpendChart, RFQTrendsChart } from "@/components/charts/reports-charts";

export default async function ReportsPage() {
  const user = await getCurrentUser();
  if (!requireRole(user, ["ADMIN", "PROCUREMENT_OFFICER"])) {
    redirect("/dashboard");
  }

  const data = await getReportsData();

  return (
    <>
      <Topbar
        user={user}
        title="Reports & Analytics"
        subtitle={`Procurement analytics — ${new Date().toLocaleDateString()}`}
      />
      <div className="space-y-6 p-8">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="Total Spend"
            value={`$${data.totalSpend.toLocaleString()}`}
            icon={DollarSign}
          />
          <StatCard title="Total Vendors" value={data.totalVendors} icon={Building2} />
          <StatCard title="Active RFQs" value={data.activeRFQs} icon={FileText} />
          <StatCard title="Pending Approvals" value={data.pendingApprovals} icon={CheckCircle} />
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Monthly Spend</CardTitle>
            </CardHeader>
            <CardContent>
              <MonthlySpendChart data={data.monthlySpend} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>RFQ Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <RFQTrendsChart data={data.rfqTrends} />
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Vendor Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Vendor Name</TableHead>
                  <TableHead>Total Spend</TableHead>
                  <TableHead>Purchase Orders</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.vendorPerformance.map((v) => (
                  <TableRow key={v.name}>
                    <TableCell className="font-medium">{v.name}</TableCell>
                    <TableCell className="text-emerald-400">
                      ${v.totalSpend.toLocaleString()}
                    </TableCell>
                    <TableCell>{v.poCount}</TableCell>
                  </TableRow>
                ))}
                {data.vendorPerformance.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={3} className="py-8 text-center text-muted-foreground">
                      No vendor performance data yet
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
