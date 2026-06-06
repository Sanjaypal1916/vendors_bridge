import { getCurrentUser } from "@/lib/auth";
import { getPurchaseOrders } from "@/app/actions/purchase-orders";
import { Topbar } from "@/components/layout/topbar";
import { PurchaseOrderList } from "@/components/purchase-orders/po-list";

export default async function PurchaseOrdersPage() {
  const user = await getCurrentUser();
  const orders = await getPurchaseOrders();

  return (
    <>
      <Topbar user={user} title="Purchase Orders" subtitle="View generated purchase orders" />
      <div className="p-8">
        <PurchaseOrderList orders={orders} />
      </div>
    </>
  );
}
