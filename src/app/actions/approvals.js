"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getCurrentUser, requireRole } from "@/lib/auth";
import { logActivity } from "@/lib/activity";

export async function getApprovals() {
  return prisma.approval.findMany({
    include: {
      quotation: {
        include: {
          rfq: true,
          vendor: true,
        },
      },
      approvedBy: { select: { name: true } },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function getApprovalById(id) {
  return prisma.approval.findUnique({
    where: { id },
    include: {
      quotation: {
        include: {
          rfq: true,
          vendor: true,
        },
      },
      approvedBy: { select: { name: true, email: true } },
    },
  });
}

export async function getPendingApprovalsCount() {
  return prisma.approval.count({ where: { status: "PENDING" } });
}

async function getNextPONumber() {
  const last = await prisma.purchaseOrder.findFirst({
    orderBy: { createdAt: "desc" },
  });
  if (!last) return "PO-0001";
  const num = parseInt(last.poNumber.replace("PO-", "")) + 1;
  return `PO-${String(num).padStart(4, "0")}`;
}

async function getNextInvoiceNumber() {
  const last = await prisma.invoice.findFirst({
    orderBy: { createdAt: "desc" },
  });
  if (!last) return "INV-0001";
  const num = parseInt(last.invoiceNumber.replace("INV-", "")) + 1;
  return `INV-${String(num).padStart(4, "0")}`;
}

export async function approveQuotationAction(approvalId, remarks) {
  const user = await getCurrentUser();
  if (!requireRole(user, ["ADMIN", "PROCUREMENT_OFFICER"])) {
    return { error: "Unauthorized" };
  }

  const approval = await prisma.approval.findUnique({
    where: { id: approvalId },
    include: {
      quotation: { include: { rfq: true, vendor: true } },
    },
  });

  if (!approval) return { error: "Approval not found" };
  if (approval.status !== "PENDING") return { error: "Already processed" };
  if (approval.quotation.status !== "SELECTED") {
    return { error: "Please select a winning vendor before approving." };
  }

  const subtotal = approval.quotation.price;
  const tax = subtotal * 0.18;
  const total = subtotal + tax;

  const poNumber = await getNextPONumber();
  const invoiceNumber = await getNextInvoiceNumber();

  await prisma.$transaction(async (tx) => {
    await tx.approval.update({
      where: { id: approvalId },
      data: {
        status: "APPROVED",
        remarks: remarks || null,
        approvedById: user.id,
        approvedAt: new Date(),
      },
    });

    const po = await tx.purchaseOrder.create({
      data: {
        poNumber,
        quotationId: approval.quotationId,
        subtotal,
        tax,
        total,
        status: "GENERATED",
      },
    });

    await tx.invoice.create({
      data: {
        invoiceNumber,
        poId: po.id,
        subtotal,
        tax,
        total,
        status: "GENERATED",
      },
    });
  });

  await logActivity(
    "APPROVAL_COMPLETED",
    `Quotation from '${approval.quotation.vendor.companyName}' approved by ${user.name}. PO ${poNumber} generated.`,
    user.id
  );
  await logActivity(
    "PO_GENERATED",
    `Purchase Order ${poNumber} generated for RFQ '${approval.quotation.rfq.title}'`,
    user.id
  );
  await logActivity(
    "INVOICE_GENERATED",
    `Invoice ${invoiceNumber} generated for PO ${poNumber}`,
    user.id
  );

  revalidatePath("/approvals");
  revalidatePath("/purchase-orders");
  revalidatePath("/invoices");
  revalidatePath("/dashboard");
  return { success: true, poNumber, invoiceNumber };
}

export async function rejectQuotationAction(approvalId, remarks) {
  const user = await getCurrentUser();
  if (!requireRole(user, ["ADMIN", "PROCUREMENT_OFFICER"])) {
    return { error: "Unauthorized" };
  }

  const approval = await prisma.approval.findUnique({
    where: { id: approvalId },
    include: { quotation: { include: { vendor: true, rfq: true } } },
  });

  if (!approval) return { error: "Approval not found" };

  await prisma.approval.update({
    where: { id: approvalId },
    data: {
      status: "REJECTED",
      remarks: remarks || null,
      approvedById: user.id,
      approvedAt: new Date(),
    },
  });

  await logActivity(
    "APPROVAL_REJECTED",
    `Quotation from '${approval.quotation.vendor.companyName}' rejected by ${user.name}`,
    user.id
  );

  revalidatePath("/approvals");
  return { success: true };
}
