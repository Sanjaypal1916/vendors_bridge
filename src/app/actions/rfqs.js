"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getCurrentUser, requireRole } from "@/lib/auth";
import { logActivity } from "@/lib/activity";

export async function getRFQs() {
  const user = await getCurrentUser();
  if (!user) return [];

  if (user.role === "VENDOR" && user.vendor) {
    return prisma.rFQ.findMany({
      where: {
        OR: [
          { status: "OPEN" },
          { rfqVendors: { some: { vendorId: user.vendor.id } } },
        ],
      },
      include: {
        createdBy: { select: { name: true } },
        rfqVendors: { include: { vendor: true } },
        _count: { select: { quotations: true } },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  return prisma.rFQ.findMany({
    include: {
      createdBy: { select: { name: true } },
      rfqVendors: { include: { vendor: true } },
      _count: { select: { quotations: true } },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function getRFQById(id) {
  return prisma.rFQ.findUnique({
    where: { id },
    include: {
      createdBy: { select: { name: true, email: true } },
      rfqVendors: { include: { vendor: true } },
      quotations: {
        include: {
          vendor: true,
          approval: { include: { approvedBy: { select: { name: true } } } },
          purchaseOrder: { include: { invoice: true } },
        },
      },
    },
  });
}

export async function createRFQAction(formData) {
  const user = await getCurrentUser();
  if (!requireRole(user, ["ADMIN", "PROCUREMENT_OFFICER"])) {
    return { error: "Unauthorized" };
  }

  const title = formData.get("title")?.toString().trim();
  const category = formData.get("category")?.toString();
  const quantity = parseInt(formData.get("quantity")?.toString() || "0");
  const deadline = formData.get("deadline")?.toString();
  const description = formData.get("description")?.toString().trim();
  const vendorIds = formData.getAll("vendorIds");

  if (!title || !category || !quantity || !deadline) {
    return { error: "Title, category, quantity, and deadline are required." };
  }

  const rfq = await prisma.rFQ.create({
    data: {
      title,
      category,
      quantity,
      deadline: new Date(deadline),
      description: description || null,
      status: "OPEN",
      createdById: user.id,
      rfqVendors: {
        create: vendorIds.map((vendorId) => ({ vendorId: vendorId.toString() })),
      },
    },
  });

  await logActivity(
    "RFQ_CREATED",
    `RFQ '${rfq.title}' was created by ${user.name}`,
    user.id
  );
  revalidatePath("/rfqs");
  revalidatePath("/dashboard");
  return { success: true, rfq };
}
