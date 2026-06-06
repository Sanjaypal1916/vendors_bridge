import { jsPDF } from "jspdf";

export function generateInvoicePDF(invoice, po, vendor, rfq) {
  const doc = new jsPDF();
  const margin = 20;
  let y = margin;

  doc.setFontSize(22);
  doc.setTextColor(34, 197, 94);
  doc.text("VendorBridge", margin, y);

  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text("Procurement & Vendor Management ERP", margin, y + 7);

  y += 25;
  doc.setFontSize(18);
  doc.setTextColor(0, 0, 0);
  doc.text("INVOICE", margin, y);

  doc.setFontSize(10);
  doc.setTextColor(80, 80, 80);
  doc.text(`Invoice #: ${invoice.invoiceNumber}`, 140, y - 5);
  doc.text(`PO #: ${po.poNumber}`, 140, y);
  doc.text(`Date: ${new Date(invoice.createdAt).toLocaleDateString()}`, 140, y + 5);

  y += 20;
  doc.setFontSize(11);
  doc.setTextColor(0, 0, 0);
  doc.text("Bill To:", margin, y);
  y += 7;
  doc.setFontSize(10);
  doc.text(vendor.companyName, margin, y);
  doc.text(`Contact: ${vendor.contactPerson}`, margin, y + 5);
  doc.text(`Email: ${vendor.email}`, margin, y + 10);
  doc.text(`Phone: ${vendor.phone}`, margin, y + 15);
  if (vendor.gstNumber) {
    doc.text(`GST: ${vendor.gstNumber}`, margin, y + 20);
    y += 5;
  }

  y += 35;
  doc.setFillColor(34, 197, 94);
  doc.rect(margin, y, 170, 8, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(9);
  doc.text("Item", margin + 2, y + 5.5);
  doc.text("Qty", margin + 90, y + 5.5);
  doc.text("Price", margin + 115, y + 5.5);
  doc.text("Total", margin + 145, y + 5.5);

  y += 12;
  doc.setTextColor(0, 0, 0);
  doc.text(rfq.title, margin + 2, y);
  doc.text(String(rfq.quantity), margin + 90, y);
  doc.text(`$${po.subtotal.toLocaleString()}`, margin + 115, y);
  doc.text(`$${po.subtotal.toLocaleString()}`, margin + 145, y);

  y += 20;
  doc.line(margin, y, 190, y);
  y += 10;

  doc.text("Subtotal:", margin + 115, y);
  doc.text(`$${invoice.subtotal.toLocaleString()}`, margin + 145, y);
  y += 7;
  doc.text("Tax (GST 18%):", margin + 115, y);
  doc.text(`$${invoice.tax.toLocaleString()}`, margin + 145, y);
  y += 10;
  doc.setFontSize(12);
  doc.setFont(undefined, "bold");
  doc.text("Grand Total:", margin + 115, y);
  doc.text(`$${invoice.total.toLocaleString()}`, margin + 145, y);

  y += 25;
  doc.setFontSize(9);
  doc.setFont(undefined, "normal");
  doc.setTextColor(120, 120, 120);
  doc.text("Thank you for your business. Payment due within 30 days.", margin, y);

  return doc;
}
