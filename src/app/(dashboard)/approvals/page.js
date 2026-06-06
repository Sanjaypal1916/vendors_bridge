import { redirect } from "next/navigation";
import { getCurrentUser, requireRole } from "@/lib/auth";
import { getApprovals } from "@/app/actions/approvals";
import { Topbar } from "@/components/layout/topbar";
import { ApprovalList } from "@/components/approvals/approval-list";

export default async function ApprovalsPage() {
  const user = await getCurrentUser();
  if (!requireRole(user, ["ADMIN", "PROCUREMENT_OFFICER"])) {
    redirect("/dashboard");
  }

  const approvals = await getApprovals();

  return (
    <>
      <Topbar user={user} title="Approval Workflow" subtitle="Review and approve quotations" />
      <div className="p-8">
        <ApprovalList approvals={approvals} />
      </div>
    </>
  );
}
