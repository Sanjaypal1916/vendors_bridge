# VendorBridge — Procurement & Vendor Management ERP

Dark-themed procurement ERP built with Next.js, Prisma, PostgreSQL, and shadcn/ui.

## Prerequisites

- Node.js 18+
- PostgreSQL database

## Setup

1. Install dependencies:

```bash
npm install
```

2. Configure environment variables in `.env`:

```
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/vendorbridge?schema=public"
SESSION_SECRET="your-random-secret"
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"
SMTP_FROM="VendorBridge <noreply@vendorbridge.com>"
```

3. Run database migration and seed:

```bash
npx prisma migrate dev
npx prisma db seed
```

4. Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Seed Login Credentials

Password for all accounts: `password123`

| Email | Role |
|-------|------|
| admin@vendorbridge.com | Admin |
| procurement@vendorbridge.com | Procurement Officer |
| vendor1@vendorbridge.com | Vendor |

## Workflow

1. Procurement Officer creates RFQ and assigns vendors
2. Vendor submits quotation
3. Procurement compares quotations side-by-side
4. Select winning vendor → Approval workflow
5. Approve quotation → PO & Invoice auto-generated
6. Download PDF / Email invoice
7. All actions logged in Activity

## Tech Stack

- Next.js (App Router)
- JavaScript
- Tailwind CSS + shadcn/ui
- Prisma ORM + PostgreSQL
- Server Actions
- Recharts, jsPDF, Nodemailer
- Cookie session auth (bcrypt)
