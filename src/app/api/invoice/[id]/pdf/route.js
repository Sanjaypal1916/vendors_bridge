import { NextResponse } from "next/server";
import { getInvoiceById } from "@/app/actions/invoices";
import { generateInvoicePDF } from "@/lib/pdf";

export async function GET(request, { params }) {
  const { id } = await params;
  const invoice = await getInvoiceById(id);

  if (!invoice) {
    return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
  }

  const { purchaseOrder: po } = invoice;
  const { quotation } = po;
  const { vendor, rfq } = quotation;

  const doc = generateInvoicePDF(invoice, po, vendor, rfq);
  const pdfBuffer = Buffer.from(doc.output("arraybuffer"));

  return new NextResponse(pdfBuffer, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${invoice.invoiceNumber}.pdf"`,
    },
  });
}
