import { getCurrentUser } from "@/lib/auth";
import { getQuotations } from "@/app/actions/quotations";
import { Topbar } from "@/components/layout/topbar";
import { QuotationList } from "@/components/quotations/quotation-list";

export default async function QuotationsPage() {
  const user = await getCurrentUser();
  const quotations = await getQuotations();

  return (
    <>
      <Topbar user={user} title="Quotations" subtitle="View and manage quotations" />
      <div className="p-8">
        <QuotationList quotations={quotations} user={user} />
      </div>
    </>
  );
}
