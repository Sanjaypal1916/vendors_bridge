import { redirect } from "next/navigation";
import { getCurrentUser, requireRole } from "@/lib/auth";
import { getVendors } from "@/app/actions/vendors";
import { Topbar } from "@/components/layout/topbar";
import { VendorManager } from "@/components/vendors/vendor-manager";

export default async function VendorsPage() {
  const user = await getCurrentUser();
  if (!requireRole(user, ["ADMIN", "PROCUREMENT_OFFICER"])) {
    redirect("/dashboard");
  }

  const vendors = await getVendors();

  return (
    <>
      <Topbar
        user={user}
        title="Vendors"
        subtitle="Manage supplier profiles and registrations"
      />
      <div className="p-8">
        <VendorManager vendors={vendors} />
      </div>
    </>
  );
}
