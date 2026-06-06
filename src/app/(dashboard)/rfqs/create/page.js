import { redirect } from "next/navigation";
import { getCurrentUser, requireRole } from "@/lib/auth";
import { getVendors } from "@/app/actions/vendors";
import { Topbar } from "@/components/layout/topbar";
import { RFQForm } from "@/components/rfqs/rfq-form";

export default async function CreateRFQPage() {
  const user = await getCurrentUser();
  if (!requireRole(user, ["ADMIN", "PROCUREMENT_OFFICER"])) {
    redirect("/dashboard");
  }

  const vendors = await getVendors("", "", "ACTIVE");

  return (
    <>
      <Topbar
        user={user}
        title="Create RFQs"
        subtitle="New request for quotation"
      />
      <div className="p-8">
        <RFQForm vendors={vendors} />
      </div>
    </>
  );
}
