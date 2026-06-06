import { redirect } from "next/navigation";
import { getCurrentUser, requireRole } from "@/lib/auth";
import { getRFQById } from "@/app/actions/rfqs";
import { getQuotationsByRFQ } from "@/app/actions/quotations";
import { Topbar } from "@/components/layout/topbar";
import { ComparisonGrid } from "@/components/quotations/comparison-grid";

export default async function CompareQuotationsPage({ params }) {
  const user = await getCurrentUser();
  if (!requireRole(user, ["ADMIN", "PROCUREMENT_OFFICER"])) {
    redirect("/dashboard");
  }

  const { rfqId } = await params;
  const rfq = await getRFQById(rfqId);
  const quotations = await getQuotationsByRFQ(rfqId);

  if (!rfq) redirect("/rfqs");

  return (
    <>
      <Topbar
        user={user}
        title="Quotation Comparison"
        subtitle={`${rfq.title} — ${quotations.length} quotation(s) received`}
      />
      <div className="p-8">
        <ComparisonGrid quotations={quotations} rfq={rfq} />
      </div>
    </>
  );
}
