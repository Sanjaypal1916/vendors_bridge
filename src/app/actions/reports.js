"use server";

import { prisma } from "@/lib/prisma";

export async function getReportsData() {
  const [
    totalSpend,
    totalVendors,
    activeRFQs,
    pendingApprovals,
    monthlySpend,
    vendorPerformance,
    rfqTrends,
  ] = await Promise.all([
    prisma.purchaseOrder.aggregate({ _sum: { total: true } }),
    prisma.vendor.count({ where: { status: "ACTIVE" } }),
    prisma.rFQ.count({ where: { status: "OPEN" } }),
    prisma.approval.count({ where: { status: "PENDING" } }),
    getMonthlySpend(),
    getVendorPerformance(),
    getRFQTrends(),
  ]);

  return {
    totalSpend: totalSpend._sum.total || 0,
    totalVendors,
    activeRFQs,
    pendingApprovals,
    monthlySpend,
    vendorPerformance,
    rfqTrends,
  };
}

async function getMonthlySpend() {
  const pos = await prisma.purchaseOrder.findMany({
    select: { total: true, createdAt: true },
    orderBy: { createdAt: "asc" },
  });

  const months = {};
  pos.forEach((po) => {
    const key = new Date(po.createdAt).toLocaleString("default", {
      month: "short",
      year: "2-digit",
    });
    months[key] = (months[key] || 0) + po.total;
  });

  return Object.entries(months).map(([month, spend]) => ({ month, spend }));
}

async function getVendorPerformance() {
  const pos = await prisma.purchaseOrder.findMany({
    include: { quotation: { include: { vendor: true } } },
  });

  const map = {};
  pos.forEach((po) => {
    const name = po.quotation.vendor.companyName;
    if (!map[name]) map[name] = { name, totalSpend: 0, poCount: 0 };
    map[name].totalSpend += po.total;
    map[name].poCount++;
  });

  return Object.values(map)
    .sort((a, b) => b.totalSpend - a.totalSpend)
    .slice(0, 10);
}

async function getRFQTrends() {
  const rfqs = await prisma.rFQ.findMany({
    select: { createdAt: true, status: true },
    orderBy: { createdAt: "asc" },
  });

  const months = {};
  rfqs.forEach((rfq) => {
    const key = new Date(rfq.createdAt).toLocaleString("default", {
      month: "short",
      year: "2-digit",
    });
    if (!months[key]) months[key] = { created: 0, awarded: 0 };
    months[key].created++;
    if (rfq.status === "AWARDED") months[key].awarded++;
  });

  return Object.entries(months).map(([month, data]) => ({
    month,
    created: data.created,
    awarded: data.awarded,
  }));
}
