"use server";

import { prisma } from "@/lib/prisma";

export async function getDashboardStats() {
  const [
    activeRFQs,
    pendingApprovals,
    purchaseOrders,
    totalVendors,
    recentRFQs,
    recentQuotations,
  ] = await Promise.all([
    prisma.rFQ.count({ where: { status: "OPEN" } }),
    prisma.approval.count({ where: { status: "PENDING" } }),
    prisma.purchaseOrder.count(),
    prisma.vendor.count({ where: { status: "ACTIVE" } }),
    prisma.rFQ.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: { _count: { select: { quotations: true } } },
    }),
    prisma.quotation.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: { rfq: true, vendor: true },
    }),
  ]);

  const totalSpend = await prisma.purchaseOrder.aggregate({
    _sum: { total: true },
  });

  const rfqByStatus = await prisma.rFQ.groupBy({
    by: ["status"],
    _count: true,
  });

  return {
    activeRFQs,
    pendingApprovals,
    purchaseOrders,
    totalVendors,
    totalSpend: totalSpend._sum.total || 0,
    recentRFQs,
    recentQuotations,
    rfqByStatus,
  };
}
