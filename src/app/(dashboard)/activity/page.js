import { redirect } from "next/navigation";
import { getCurrentUser, requireRole } from "@/lib/auth";
import { getActivityLogs } from "@/app/actions/activity";
import { Topbar } from "@/components/layout/topbar";
import { ActivityTimeline } from "@/components/activity/activity-timeline";

export default async function ActivityPage() {
  const user = await getCurrentUser();
  if (!requireRole(user, ["ADMIN", "PROCUREMENT_OFFICER"])) {
    redirect("/dashboard");
  }

  const logs = await getActivityLogs();

  return (
    <>
      <Topbar
        user={user}
        title="Activity & Logs"
        subtitle="Procurement audit trail"
      />
      <div className="p-8">
        <ActivityTimeline initialLogs={logs} />
      </div>
    </>
  );
}
