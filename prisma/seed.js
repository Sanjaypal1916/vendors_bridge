const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  await prisma.activityLog.deleteMany();
  await prisma.invoice.deleteMany();
  await prisma.purchaseOrder.deleteMany();
  await prisma.approval.deleteMany();
  await prisma.quotation.deleteMany();
  await prisma.rFQVendor.deleteMany();
  await prisma.rFQ.deleteMany();
  await prisma.vendor.deleteMany();
  await prisma.session.deleteMany();
  await prisma.user.deleteMany();

  const password = await bcrypt.hash("password123", 12);

  const users = await Promise.all([
    prisma.user.create({
      data: {
        name: "Admin User",
        email: "admin@vendorbridge.com",
        password,
        role: "ADMIN",
        phone: "+1-555-0100",
        country: "USA",
      },
    }),
    prisma.user.create({
      data: {
        name: "Sarah Procurement",
        email: "procurement@vendorbridge.com",
        password,
        role: "PROCUREMENT_OFFICER",
        phone: "+1-555-0101",
        country: "USA",
      },
    }),
    prisma.user.create({
      data: {
        name: "Mike Officer",
        email: "officer@vendorbridge.com",
        password,
        role: "PROCUREMENT_OFFICER",
        phone: "+1-555-0102",
        country: "UK",
      },
    }),
    prisma.user.create({
      data: {
        name: "John Vendor",
        email: "vendor1@vendorbridge.com",
        password,
        role: "VENDOR",
        phone: "+1-555-0200",
        country: "USA",
      },
    }),
    prisma.user.create({
      data: {
        name: "Jane Supplier",
        email: "vendor2@vendorbridge.com",
        password,
        role: "VENDOR",
        phone: "+1-555-0201",
        country: "Canada",
      },
    }),
  ]);

  const [admin, procurement, , vendorUser1, vendorUser2] = users;

  const vendorData = [
    { companyName: "Zebra Supplies", contactPerson: "Tom Zebra", email: "tom@zebra.com", phone: "+1-555-1001", gstNumber: "GST-001", category: "Office Supplies", status: "ACTIVE" },
    { companyName: "TechParts Inc", contactPerson: "Lisa Tech", email: "lisa@techparts.com", phone: "+1-555-1002", gstNumber: "GST-002", category: "Electronics", status: "ACTIVE" },
    { companyName: "SteelWorks Ltd", contactPerson: "Bob Steel", email: "bob@steelworks.com", phone: "+1-555-1003", gstNumber: "GST-003", category: "Raw Materials", status: "ACTIVE" },
    { companyName: "CloudServe IT", contactPerson: "Amy Cloud", email: "amy@cloudserve.com", phone: "+1-555-1004", gstNumber: "GST-004", category: "IT Services", status: "ACTIVE" },
    { companyName: "BuildRight Co", contactPerson: "Dan Build", email: "dan@buildright.com", phone: "+1-555-1005", gstNumber: "GST-005", category: "Construction", status: "ACTIVE" },
    { companyName: "FastFreight", contactPerson: "Eve Fast", email: "eve@fastfreight.com", phone: "+1-555-1006", gstNumber: "GST-006", category: "Logistics", status: "ACTIVE" },
    { companyName: "PackPro Solutions", contactPerson: "Frank Pack", email: "frank@packpro.com", phone: "+1-555-1007", gstNumber: "GST-007", category: "Packaging", status: "ACTIVE" },
    { companyName: "MachineMax", contactPerson: "Henry Machine", email: "henry@machinemax.com", phone: "+1-555-1009", gstNumber: "GST-009", category: "Machinery", status: "ACTIVE" },
    { companyName: "ConsultPro", contactPerson: "Ivy Consult", email: "ivy@consultpro.com", phone: "+1-555-1010", gstNumber: "GST-010", category: "Consulting", status: "ACTIVE" },
  ];

  const vendors = [];
  for (let i = 0; i < vendorData.length; i++) {
    const data = { ...vendorData[i] };
    if (i === 0) data.userId = vendorUser1.id;
    if (i === 1) data.userId = vendorUser2.id;
    vendors.push(await prisma.vendor.create({ data }));
  }

  const rfqTitles = [
    { title: "Office Chairs Bulk Order", category: "Office Supplies", quantity: 200, description: "Ergonomic office chairs for new office wing" },
    { title: "Laptop Procurement Q2", category: "Electronics", quantity: 50, description: "Business laptops with 16GB RAM minimum" },
    { title: "Steel Beams for Warehouse", category: "Raw Materials", quantity: 100, description: "Grade A steel beams, 6m length" },
    { title: "Cloud Migration Services", category: "IT Services", quantity: 1, description: "Full cloud migration for ERP system" },
    { title: "Office Renovation Materials", category: "Construction", quantity: 1, description: "Complete renovation package for floor 3" },
    { title: "Annual Freight Contract", category: "Logistics", quantity: 12, description: "Monthly freight services for 12 months" },
    { title: "Packaging Materials Q3", category: "Packaging", quantity: 5000, description: "Corrugated boxes and bubble wrap" },
    { title: "Industrial Cleaning Chemicals", category: "Chemicals", quantity: 200, description: "Eco-friendly industrial cleaning supplies" },
    { title: "CNC Machine Maintenance", category: "Machinery", quantity: 3, description: "Annual maintenance for CNC machines" },
    { title: "Procurement Process Audit", category: "Consulting", quantity: 1, description: "Full procurement process audit and recommendations" },
  ];

  const rfqs = [];
  for (let i = 0; i < rfqTitles.length; i++) {
    const deadline = new Date();
    deadline.setDate(deadline.getDate() + 30 + i * 5);

    const rfq = await prisma.rFQ.create({
      data: {
        ...rfqTitles[i],
        deadline,
        status: i < 7 ? "OPEN" : i < 9 ? "AWARDED" : "CLOSED",
        createdById: procurement.id,
        rfqVendors: {
          create: [
            { vendorId: vendors[i % vendors.length].id },
            { vendorId: vendors[(i + 1) % vendors.length].id },
          ],
        },
      },
    });
    rfqs.push(rfq);
  }

  const quotations = [];
  for (let i = 0; i < rfqs.length; i++) {
    const rfq = rfqs[i];
    const numQuotes = i < 8 ? 2 : 1;

    for (let j = 0; j < numQuotes; j++) {
      const vendor = vendors[(i + j) % vendors.length];
      const price = 5000 + i * 1200 + j * 800 + Math.floor(Math.random() * 500);
      const deliveryDays = 7 + j * 5 + i;

      const quotation = await prisma.quotation.create({
        data: {
          rfqId: rfq.id,
          vendorId: vendor.id,
          price,
          deliveryDays,
          notes: j === 0 ? "Best price guarantee with 1-year warranty" : "Includes free delivery and installation",
          status: i >= 7 && j === 0 ? "SELECTED" : "SUBMITTED",
        },
      });

      await prisma.approval.create({
        data: {
          quotationId: quotation.id,
          status: i < 5 ? "PENDING" : i < 7 ? "PENDING" : "APPROVED",
          approvedById: i >= 7 ? procurement.id : null,
          approvedAt: i >= 7 ? new Date() : null,
          remarks: i >= 7 ? "Approved based on lowest price and fastest delivery" : null,
        },
      });

      quotations.push(quotation);
    }
  }

  const approvedForPO = await prisma.quotation.findMany({
    where: {
      status: "SELECTED",
      approval: { status: "APPROVED" },
      purchaseOrder: null,
    },
    take: 5,
  });

  const pos = [];
  const invoices = [];

  for (let i = 0; i < approvedForPO.length; i++) {
    const quotation = approvedForPO[i];
    const subtotal = quotation.price;
    const tax = subtotal * 0.18;
    const total = subtotal + tax;

    const po = await prisma.purchaseOrder.create({
      data: {
        poNumber: `PO-${String(i + 1).padStart(4, "0")}`,
        quotationId: quotation.id,
        subtotal,
        tax,
        total,
        status: "GENERATED",
      },
    });
    pos.push(po);

    const invoice = await prisma.invoice.create({
      data: {
        invoiceNumber: `INV-${String(i + 1).padStart(4, "0")}`,
        poId: po.id,
        subtotal,
        tax,
        total,
        status: i < 2 ? "SENT" : "GENERATED",
      },
    });
    invoices.push(invoice);
  }

  const activities = [
    { action: "VENDOR_CREATED", description: "Vendor 'Zebra Supplies' was created by Admin", userId: admin.id },
    { action: "RFQ_CREATED", description: "RFQ 'Office Chairs Bulk Order' was created by Sarah Procurement", userId: procurement.id },
    { action: "QUOTATION_SUBMITTED", description: "Quotation of $5000 submitted by Zebra Supplies", userId: vendorUser1.id },
    { action: "WINNER_SELECTED", description: "Vendor 'TechParts Inc' selected as winner for Laptop Procurement Q2", userId: procurement.id },
    { action: "APPROVAL_COMPLETED", description: "Quotation from SteelWorks Ltd approved. PO PO-0001 generated.", userId: procurement.id },
    { action: "PO_GENERATED", description: "Purchase Order PO-0001 generated", userId: procurement.id },
    { action: "INVOICE_GENERATED", description: "Invoice INV-0001 generated for PO PO-0001", userId: procurement.id },
    { action: "INVOICE_EMAILED", description: "Invoice INV-0001 emailed to tom@zebra.com", userId: procurement.id },
  ];

  for (const activity of activities) {
    await prisma.activityLog.create({ data: activity });
  }

  console.log("Seed completed:");
  console.log(`  Users: ${users.length}`);
  console.log(`  Vendors: ${vendors.length}`);
  console.log(`  RFQs: ${rfqs.length}`);
  console.log(`  Quotations: ${quotations.length}`);
  console.log(`  Purchase Orders: ${pos.length}`);
  console.log(`  Invoices: ${invoices.length}`);
  console.log("\nLogin credentials (password: password123):");
  console.log("  admin@vendorbridge.com (Admin)");
  console.log("  procurement@vendorbridge.com (Procurement Officer)");
  console.log("  vendor1@vendorbridge.com (Vendor)");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
