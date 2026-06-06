import { getCurrentUser } from "@/lib/auth";
import { getRFQs } from "@/app/actions/rfqs";
import { Topbar } from "@/components/layout/topbar";
import { RFQList } from "@/components/rfqs/rfq-list";

export default async function RFQsPage() {
  const user = await getCurrentUser();
  const rfqs = await getRFQs();

  return (
    <>
      <Topbar
        user={user}
        title="RFQs"
        subtitle={
          user.role === "VENDOR"
            ? "RFQs sent to your company"
            : "Request for Quotations management"
        }
      />
      <div className="p-8">
        <RFQList rfqs={rfqs} user={user} />
      </div>
    </>
  );
}
