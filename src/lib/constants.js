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

export const VENDOR_CATEGORIES = [
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
];

export const RFQ_CATEGORIES = [
  "Electronics",
  "Office Supplies",
  "Raw Materials",
  "IT Services",
  "Construction",
  "Logistics",
  "Packaging",
  "General",
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
