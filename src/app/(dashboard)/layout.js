import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { Sidebar } from "@/components/layout/sidebar";

export default async function DashboardLayout({ children }) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  return (
    <div className="dark min-h-screen bg-[#000000]">
      <Sidebar user={user} />
      <main className="ml-64 min-h-screen">{children}</main>
    </div>
  );
}
