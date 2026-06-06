export const ROLES = {
  ADMIN: "ADMIN",
  PROCUREMENT_OFFICER: "PROCUREMENT_OFFICER",
  VENDOR: "VENDOR",
};

export const ROLE_LABELS = {
  ADMIN: "Admin",
  PROCUREMENT_OFFICER: "Procurement Officer",
  VENDOR: "Vendor",
};

export const PROCUREMENT_CATEGORIES = [
  "Electronics",
  "Office Supplies",
  "Raw Materials",
  "IT Services",
  "Construction",
  "Logistics",
  "Packaging",
  "Chemicals",
  "Machinery",
  "Consulting",
  "General",
];

export const VENDOR_CATEGORIES = PROCUREMENT_CATEGORIES;
export const RFQ_CATEGORIES = PROCUREMENT_CATEGORIES;

export const VENDOR_STATUS_OPTIONS = [
  { value: "", label: "All Status" },
  { value: "ACTIVE", label: "Active" },
  { value: "INACTIVE", label: "Inactive" },
  { value: "PENDING", label: "Pending" },
];

export const RFQ_STATUS_OPTIONS = [
  { value: "", label: "All Status" },
  { value: "OPEN", label: "Open" },
  { value: "AWARDED", label: "Awarded" },
  { value: "CLOSED", label: "Closed" },
  { value: "DRAFT", label: "Draft" },
];

export const QUOTATION_STATUS_OPTIONS = [
  { value: "", label: "All Status" },
  { value: "SUBMITTED", label: "Submitted" },
  { value: "SELECTED", label: "Selected" },
  { value: "REJECTED", label: "Rejected" },
];

export const APPROVAL_STATUS_OPTIONS = [
  { value: "", label: "All Status" },
  { value: "PENDING", label: "Pending" },
  { value: "APPROVED", label: "Approved" },
  { value: "REJECTED", label: "Rejected" },
];

export const PO_STATUS_OPTIONS = [
  { value: "", label: "All Status" },
  { value: "GENERATED", label: "Generated" },
  { value: "SENT", label: "Sent" },
  { value: "COMPLETED", label: "Completed" },
];

export const INVOICE_STATUS_OPTIONS = [
  { value: "", label: "All Status" },
  { value: "GENERATED", label: "Generated" },
  { value: "SENT", label: "Sent" },
  { value: "PAID", label: "Paid" },
];

export const ACTIVITY_STATUS_OPTIONS = [
  { value: "", label: "All Status" },
  { value: "CREATED", label: "Created" },
  { value: "APPROVED", label: "Approved" },
  { value: "REJECTED", label: "Rejected" },
  { value: "GENERATED", label: "Generated" },
  { value: "SENT", label: "Sent" },
];

export const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: "LayoutDashboard", roles: ["ADMIN", "PROCUREMENT_OFFICER", "VENDOR"] },
  { href: "/vendors", label: "Vendors", icon: "Building2", roles: ["ADMIN", "PROCUREMENT_OFFICER"] },
  { href: "/rfqs", label: "RFQs", icon: "FileText", roles: ["ADMIN", "PROCUREMENT_OFFICER", "VENDOR"] },
  { href: "/quotations", label: "Quotations", icon: "DollarSign", roles: ["ADMIN", "PROCUREMENT_OFFICER", "VENDOR"] },
  { href: "/approvals", label: "Approvals", icon: "CheckCircle", roles: ["ADMIN", "PROCUREMENT_OFFICER"] },
  { href: "/purchase-orders", label: "Purchase Orders", icon: "ShoppingCart", roles: ["ADMIN", "PROCUREMENT_OFFICER", "VENDOR"] },
  { href: "/invoices", label: "Invoices", icon: "Receipt", roles: ["ADMIN", "PROCUREMENT_OFFICER", "VENDOR"] },
  { href: "/reports", label: "Reports", icon: "BarChart3", roles: ["ADMIN", "PROCUREMENT_OFFICER"] },
  { href: "/activity", label: "Activity", icon: "Activity", roles: ["ADMIN", "PROCUREMENT_OFFICER"] },
];
