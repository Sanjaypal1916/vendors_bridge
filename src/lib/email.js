import nodemailer from "nodemailer";

function getTransporter() {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    return null;
  }

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: parseInt(process.env.SMTP_PORT || "587"),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

export async function sendInvoiceEmail(to, invoice, po, pdfBuffer) {
  const transporter = getTransporter();

  if (!transporter) {
    return {
      success: false,
      message:
        "SMTP not configured. Set SMTP_USER and SMTP_PASS in .env to enable email.",
    };
  }

  try {
    await transporter.sendMail({
      from: process.env.SMTP_FROM || "VendorBridge <noreply@vendorbridge.com>",
      to,
      subject: `Invoice ${invoice.invoiceNumber} - VendorBridge`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px;">
          <h2 style="color: #22c55e;">VendorBridge Invoice</h2>
          <p>Dear Customer,</p>
          <p>Please find attached invoice <strong>${invoice.invoiceNumber}</strong> for Purchase Order <strong>${po.poNumber}</strong>.</p>
          <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
            <tr><td style="padding: 8px; border-bottom: 1px solid #eee;">Subtotal</td><td style="padding: 8px; border-bottom: 1px solid #eee; text-align: right;">$${invoice.subtotal.toLocaleString()}</td></tr>
            <tr><td style="padding: 8px; border-bottom: 1px solid #eee;">Tax</td><td style="padding: 8px; border-bottom: 1px solid #eee; text-align: right;">$${invoice.tax.toLocaleString()}</td></tr>
            <tr><td style="padding: 8px; font-weight: bold;">Total</td><td style="padding: 8px; text-align: right; font-weight: bold;">$${invoice.total.toLocaleString()}</td></tr>
          </table>
          <p>Thank you for your business.</p>
          <p style="color: #888; font-size: 12px;">VendorBridge Procurement ERP</p>
        </div>
      `,
      attachments: [
        {
          filename: `${invoice.invoiceNumber}.pdf`,
          content: pdfBuffer,
          contentType: "application/pdf",
        },
      ],
    });

    return { success: true, message: "Invoice emailed successfully." };
  } catch (error) {
    return { success: false, message: error.message };
  }
}
