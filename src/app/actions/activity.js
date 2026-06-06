"use server";

import { prisma } from "@/lib/prisma";

export async function getActivityLogs(filter = "ALL") {
  const actionMap = {
    RFQ: ["RFQ_CREATED"],
    PO: ["PO_GENERATED"],
    INVOICE: ["INVOICE_GENERATED", "INVOICE_EMAILED"],
    VENDORS: ["VENDOR_CREATED", "VENDOR_UPDATED", "VENDOR_DELETED"],
  };

  const where = {};
  if (filter !== "ALL" && actionMap[filter]) {
    where.action = { in: actionMap[filter] };
  }

  return prisma.activityLog.findMany({
    where,
    include: { user: { select: { name: true } } },
    orderBy: { createdAt: "desc" },
    take: 100,
  });
}
