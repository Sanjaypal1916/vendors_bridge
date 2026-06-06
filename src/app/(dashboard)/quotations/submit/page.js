import { redirect } from "next/navigation";
import { getCurrentUser, requireRole } from "@/lib/auth";
import { getRFQs } from "@/app/actions/rfqs";
import { Topbar } from "@/components/layout/topbar";
import { SubmitQuotationForm } from "@/components/quotations/submit-form";

export default async function SubmitQuotationPage() {
  const user = await getCurrentUser();
  if (!requireRole(user, ["VENDOR"])) {
    redirect("/dashboard");
  }

  const rfqs = await getRFQs();
  const openRFQs = rfqs.filter((r) => r.status === "OPEN");

  return (
    <>
      <Topbar
        user={user}
        title="Submit Quotations"
        subtitle="Submit your quotation for an open RFQ"
      />
      <div className="p-8">
        {openRFQs.length > 0 ? (
          <SubmitQuotationForm rfqs={openRFQs} />
        ) : (
          <p className="text-muted-foreground">No open RFQs available for quotation.</p>
        )}
      </div>
    </>
  );
}
