import nodemailer from "nodemailer";

function getTransporter() {
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!user || !pass) return null;

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: Number(process.env.SMTP_PORT || 587),
    secure: false,
    auth: { user, pass },
  });
}

export async function sendInvoiceEmail(vendor, invoice, po, pdfBuffer) {
  const transporter = getTransporter();

  if (!transporter) {
    return {
      success: false,
      message: "SMTP not configured. Set SMTP_USER and SMTP_PASS in .env to enable email.",
    };
  }

  const from =
    process.env.SMTP_FROM || `VendorBridge <${process.env.SMTP_USER}>`;
  const to = vendor.email;

  if (!to) {
    return { success: false, message: "Vendor does not have an email address on file." };
  }

  try {
    await transporter.sendMail({
      from,
      to,
      subject: `Invoice ${invoice.invoiceNumber} — VendorBridge`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; color: #111;">
          <div style="background: #000; padding: 24px; border-radius: 8px 8px 0 0;">
            <h2 style="color: #22c55e; margin: 0;">VendorBridge</h2>
            <p style="color: #aaa; margin: 4px 0 0; font-size: 12px;">Procurement & Vendor Management ERP</p>
          </div>
          <div style="border: 1px solid #eee; border-top: none; padding: 24px; border-radius: 0 0 8px 8px;">
            <h3 style="margin-top: 0;">Invoice ${invoice.invoiceNumber}</h3>
            <p>Dear ${vendor.contactPerson || "Vendor"},</p>
            <p>Please find attached invoice <strong>${invoice.invoiceNumber}</strong> for Purchase Order <strong>${po.poNumber}</strong> from <strong>${vendor.companyName}</strong>.</p>
            <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
              <tr>
                <td style="padding: 8px; border-bottom: 1px solid #eee;">Subtotal</td>
                <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: right;">$${invoice.subtotal.toLocaleString()}</td>
              </tr>
              <tr>
                <td style="padding: 8px; border-bottom: 1px solid #eee;">Tax (GST)</td>
                <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: right;">$${invoice.tax.toLocaleString()}</td>
              </tr>
              <tr>
                <td style="padding: 8px; font-weight: bold;">Grand Total</td>
                <td style="padding: 8px; text-align: right; font-weight: bold; color: #22c55e;">$${invoice.total.toLocaleString()}</td>
              </tr>
            </table>
            <p>Thank you for your business.</p>
            <p style="color: #888; font-size: 12px; margin-bottom: 0;">VendorBridge Procurement ERP</p>
          </div>
        </div>
      `,
      attachments: [
        {
          filename: `${invoice.invoiceNumber}.pdf`,
          content: pdfBuffer,
        },
      ],
    });

    return {
      success: true,
      message: `Invoice emailed to ${to} from VendorBridge.`,
    };
  } catch (error) {
    return { success: false, message: error.message };
  }
}
