"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getCurrentUser, requireRole } from "@/lib/auth";
import { logActivity } from "@/lib/activity";

export async function getQuotations() {
  const user = await getCurrentUser();
  if (!user) return [];

  const where = user.role === "VENDOR" && user.vendor
    ? { vendorId: user.vendor.id }
    : {};

  return prisma.quotation.findMany({
    where,
    include: {
      rfq: true,
      vendor: true,
      approval: true,
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function getQuotationsByRFQ(rfqId) {
  return prisma.quotation.findMany({
    where: { rfqId },
    include: {
      vendor: true,
      approval: { include: { approvedBy: { select: { name: true } } } },
    },
    orderBy: { price: "asc" },
  });
}

export async function submitQuotationAction(formData) {
  const user = await getCurrentUser();
  if (!requireRole(user, ["VENDOR"]) || !user.vendor) {
    return { error: "Only vendors can submit quotations." };
  }

  const rfqId = formData.get("rfqId")?.toString();
  const price = parseFloat(formData.get("price")?.toString() || "0");
  const deliveryDays = parseInt(formData.get("deliveryDays")?.toString() || "0");
  const notes = formData.get("notes")?.toString().trim();

  if (!rfqId || !price || !deliveryDays) {
    return { error: "RFQ, price, and delivery days are required." };
  }

  const assignment = await prisma.rFQVendor.findFirst({
    where: { rfqId, vendorId: user.vendor.id },
  });
  if (!assignment) {
    return { error: "This RFQ was not sent to you. Only assigned vendors can submit quotations." };
  }

  const rfq = await prisma.rFQ.findUnique({ where: { id: rfqId } });
  if (!rfq || rfq.status !== "OPEN") {
    return { error: "This RFQ is not open for quotations." };
  }

  const existing = await prisma.quotation.findFirst({
    where: { rfqId, vendorId: user.vendor.id },
  });
  if (existing) {
    return { error: "You have already submitted a quotation for this RFQ." };
  }

  const quotation = await prisma.quotation.create({
    data: {
      rfqId,
      vendorId: user.vendor.id,
      price,
      deliveryDays,
      notes: notes || null,
      status: "SUBMITTED",
    },
    include: { rfq: true, vendor: true },
  });

  await prisma.approval.create({
    data: { quotationId: quotation.id, status: "PENDING" },
  });

  await logActivity(
    "QUOTATION_SUBMITTED",
    `Quotation of $${price} submitted by ${user.vendor.companyName} for RFQ '${quotation.rfq.title}'`,
    user.id
  );

  revalidatePath("/quotations");
  revalidatePath("/rfqs");
  return { success: true, quotation };
}

export async function selectWinnerAction(quotationId) {
  const user = await getCurrentUser();
  if (!requireRole(user, ["ADMIN", "PROCUREMENT_OFFICER"])) {
    return { error: "Unauthorized" };
  }

  const quotation = await prisma.quotation.findUnique({
    where: { id: quotationId },
    include: { rfq: true, vendor: true },
  });

  if (!quotation) return { error: "Quotation not found" };

  if (quotation.rfq.status === "AWARDED") {
    return { error: "A winner has already been selected for this RFQ." };
  }

  const existingWinner = await prisma.quotation.findFirst({
    where: { rfqId: quotation.rfqId, status: "SELECTED" },
  });
  if (existingWinner) {
    return { error: "A winner has already been selected for this RFQ." };
  }

  await prisma.quotation.updateMany({
    where: { rfqId: quotation.rfqId },
    data: { status: "REJECTED" },
  });

  await prisma.quotation.update({
    where: { id: quotationId },
    data: { status: "SELECTED" },
  });

  const otherQuotations = await prisma.quotation.findMany({
    where: { rfqId: quotation.rfqId, id: { not: quotationId } },
    select: { id: true },
  });

  if (otherQuotations.length > 0) {
    await prisma.approval.updateMany({
      where: {
        quotationId: { in: otherQuotations.map((q) => q.id) },
        status: "PENDING",
      },
      data: { status: "REJECTED", remarks: "Another vendor was selected as winner" },
    });
  }

  await prisma.rFQ.update({
    where: { id: quotation.rfqId },
    data: { status: "AWARDED" },
  });

  await logActivity(
    "WINNER_SELECTED",
    `Vendor '${quotation.vendor.companyName}' selected as winner for RFQ '${quotation.rfq.title}'`,
    user.id
  );

  revalidatePath(`/quotations/compare/${quotation.rfqId}`);
  revalidatePath("/approvals");
  return { success: true, rfqId: quotation.rfqId };
}
