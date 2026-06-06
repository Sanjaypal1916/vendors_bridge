import { redirect } from "next/navigation";
import { getCurrentUser, requireRole } from "@/lib/auth";
import { getRFQs } from "@/app/actions/rfqs";
import { Topbar } from "@/components/layout/topbar";
import { SubmitQuotationForm } from "@/components/quotations/submit-form";

export default async function SubmitQuotationPage({ searchParams }) {
  const user = await getCurrentUser();
  if (!requireRole(user, ["VENDOR"])) {
    redirect("/dashboard");
  }

  const params = await searchParams;
  const rfqs = await getRFQs();
  const openRFQs = rfqs.filter((r) => r.status === "OPEN");

  return (
    <>
      <Topbar
        user={user}
        title="Submit Quotations"
        subtitle="RFQs assigned to your company"
      />
      <div className="p-8">
        {openRFQs.length > 0 ? (
          <SubmitQuotationForm
            rfqs={openRFQs}
            defaultRfqId={params?.rfqId}
          />
        ) : (
          <p className="text-muted-foreground">
            No RFQs have been sent to you. You will only see RFQs that procurement assigned to your company.
          </p>
        )}
      </div>
    </>
  );
}
