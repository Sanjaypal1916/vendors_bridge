"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getCurrentUser, requireRole } from "@/lib/auth";
import { logActivity } from "@/lib/activity";

export async function getVendors(search = "", category = "", status = "") {
  const where = {};

  if (search) {
    where.OR = [
      { companyName: { contains: search, mode: "insensitive" } },
      { contactPerson: { contains: search, mode: "insensitive" } },
      { email: { contains: search, mode: "insensitive" } },
    ];
  }
  if (category) where.category = category;
  if (status) where.status = status;

  return prisma.vendor.findMany({
    where,
    orderBy: { createdAt: "desc" },
  });
}

export async function createVendorAction(formData) {
  const user = await getCurrentUser();
  if (!requireRole(user, ["ADMIN", "PROCUREMENT_OFFICER"])) {
    return { error: "Unauthorized" };
  }

  const data = {
    companyName: formData.get("companyName")?.toString().trim(),
    contactPerson: formData.get("contactPerson")?.toString().trim(),
    email: formData.get("email")?.toString().trim(),
    phone: formData.get("phone")?.toString().trim(),
    gstNumber: formData.get("gstNumber")?.toString().trim() || null,
    category: formData.get("category")?.toString(),
    status: formData.get("status")?.toString() || "ACTIVE",
  };

  if (!data.companyName || !data.contactPerson || !data.email || !data.phone || !data.category) {
    return { error: "All required fields must be filled." };
  }

  const vendor = await prisma.vendor.create({ data });
  await logActivity(
    "VENDOR_CREATED",
    `Vendor '${vendor.companyName}' was created by ${user.name}`,
    user.id
  );
  revalidatePath("/vendors");
  return { success: true, vendor };
}

export async function updateVendorAction(id, formData) {
  const user = await getCurrentUser();
  if (!requireRole(user, ["ADMIN", "PROCUREMENT_OFFICER"])) {
    return { error: "Unauthorized" };
  }

  const data = {
    companyName: formData.get("companyName")?.toString().trim(),
    contactPerson: formData.get("contactPerson")?.toString().trim(),
    email: formData.get("email")?.toString().trim(),
    phone: formData.get("phone")?.toString().trim(),
    gstNumber: formData.get("gstNumber")?.toString().trim() || null,
    category: formData.get("category")?.toString(),
    status: formData.get("status")?.toString(),
  };

  const vendor = await prisma.vendor.update({ where: { id }, data });
  await logActivity(
    "VENDOR_UPDATED",
    `Vendor '${vendor.companyName}' was updated by ${user.name}`,
    user.id
  );
  revalidatePath("/vendors");
  return { success: true };
}

export async function deleteVendorAction(id) {
  const user = await getCurrentUser();
  if (!requireRole(user, ["ADMIN", "PROCUREMENT_OFFICER"])) {
    return { error: "Unauthorized" };
  }

  const vendor = await prisma.vendor.findUnique({ where: { id } });
  if (!vendor) return { error: "Vendor not found" };

  await prisma.vendor.delete({ where: { id } });
  await logActivity(
    "VENDOR_DELETED",
    `Vendor '${vendor.companyName}' was deleted by ${user.name}`,
    user.id
  );
  revalidatePath("/vendors");
  return { success: true };
}
