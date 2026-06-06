"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function getPurchaseOrders() {
  const user = await getCurrentUser();
  if (!user) return [];

  const where =
    user.role === "VENDOR" && user.vendor
      ? { quotation: { vendorId: user.vendor.id } }
      : {};

  return prisma.purchaseOrder.findMany({
    where,
    include: {
      quotation: {
        include: {
          rfq: true,
          vendor: true,
        },
      },
      invoice: true,
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function getPurchaseOrderById(id) {
  return prisma.purchaseOrder.findUnique({
    where: { id },
    include: {
      quotation: {
        include: {
          rfq: true,
          vendor: true,
        },
      },
      invoice: true,
    },
  });
}
