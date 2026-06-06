"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { generateInvoicePDF } from "@/lib/pdf";
import { sendInvoiceEmail } from "@/lib/email";
import { logActivity } from "@/lib/activity";

export async function getInvoices() {
  const user = await getCurrentUser();
  if (!user) return [];

  const where =
    user.role === "VENDOR" && user.vendor
      ? { purchaseOrder: { quotation: { vendorId: user.vendor.id } } }
      : {};

  return prisma.invoice.findMany({
    where,
    include: {
      purchaseOrder: {
        include: {
          quotation: {
            include: { rfq: true, vendor: true },
          },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function getInvoiceById(id) {
  return prisma.invoice.findUnique({
    where: { id },
    include: {
      purchaseOrder: {
        include: {
          quotation: {
            include: { rfq: true, vendor: true },
          },
        },
      },
    },
  });
}

export async function emailInvoiceAction(invoiceId) {
  const user = await getCurrentUser();
  if (!user) return { error: "Unauthorized" };

  const invoice = await getInvoiceById(invoiceId);
  if (!invoice) return { error: "Invoice not found" };

  const { purchaseOrder: po } = invoice;
  const { quotation } = po;
  const { vendor, rfq } = quotation;

  const doc = generateInvoicePDF(invoice, po, vendor, rfq);
  const pdfBuffer = Buffer.from(doc.output("arraybuffer"));

  const result = await sendInvoiceEmail(vendor, invoice, po, pdfBuffer);

  if (result.success) {
    await prisma.invoice.update({
      where: { id: invoiceId },
      data: { status: "SENT" },
    });
    await logActivity(
      "INVOICE_EMAILED",
      `Invoice ${invoice.invoiceNumber} emailed to ${vendor.email}`,
      user.id
    );
    revalidatePath(`/invoices/${invoiceId}`);
    revalidatePath("/invoices");
  }

  return result;
}
