import { getCurrentUser } from "@/lib/auth";
import { getInvoices } from "@/app/actions/invoices";
import { Topbar } from "@/components/layout/topbar";
import { InvoiceList } from "@/components/invoices/invoice-list";

export default async function InvoicesPage() {
  const user = await getCurrentUser();
  const invoices = await getInvoices();

  return (
    <>
      <Topbar user={user} title="Invoices" subtitle="View and manage invoices" />
      <div className="p-8">
        <InvoiceList invoices={invoices} />
      </div>
    </>
  );
}
