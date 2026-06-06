import { redirect } from "next/navigation";
import { getCurrentUser, requireRole } from "@/lib/auth";
import { getApprovalById } from "@/app/actions/approvals";
import { prisma } from "@/lib/prisma";
import { Topbar } from "@/components/layout/topbar";
import { ApprovalDetail } from "@/components/approvals/approval-detail";

export default async function ApprovalDetailPage({ params }) {
  const user = await getCurrentUser();
  if (!requireRole(user, ["ADMIN", "PROCUREMENT_OFFICER"])) {
    redirect("/dashboard");
  }

  const { id } = await params;
  const approval = await getApprovalById(id);

  if (!approval) redirect("/approvals");

  const history = await prisma.activityLog.findMany({
    where: {
      OR: [
        { action: "WINNER_SELECTED" },
        { action: "APPROVAL_COMPLETED" },
        { action: "APPROVAL_REJECTED" },
        { action: "PO_GENERATED" },
      ],
    },
    orderBy: { createdAt: "desc" },
    take: 10,
  });

  return (
    <>
      <Topbar
        user={user}
        title="Approval Workflow"
        subtitle={`${approval.quotation.rfq.title} — Winner: ${approval.quotation.vendor.companyName}`}
      />
      <div className="p-8">
        <ApprovalDetail approval={approval} history={history} />
      </div>
    </>
  );
}
