"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getCurrentUser, requireRole } from "@/lib/auth";
import { logActivity } from "@/lib/activity";
import { createVendorAccount, checkVendorEmailAvailable } from "@/lib/vendor-account";

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
    include: {
      user: { select: { id: true, country: true, additionalInfo: true } },
    },
    orderBy: { createdAt: "desc" },
  });
}

function parseVendorFormData(formData) {
  return {
    companyName: formData.get("companyName")?.toString().trim(),
    contactPerson: formData.get("contactPerson")?.toString().trim(),
    email: formData.get("email")?.toString().trim().toLowerCase(),
    phone: formData.get("phone")?.toString().trim(),
    gstNumber: formData.get("gstNumber")?.toString().trim() || null,
    category: formData.get("category")?.toString(),
    password: formData.get("password")?.toString(),
    country: formData.get("country")?.toString().trim() || null,
    additionalInfo: formData.get("additionalInfo")?.toString().trim() || null,
    status: formData.get("status")?.toString() || "ACTIVE",
  };
}

export async function createVendorAction(formData) {
  const user = await getCurrentUser();
  if (!requireRole(user, ["ADMIN", "PROCUREMENT_OFFICER"])) {
    return { error: "Unauthorized" };
  }

  const data = parseVendorFormData(formData);

  const result = await createVendorAccount({
    ...data,
    status: data.status || "ACTIVE",
  });

  if (result.error) return { error: result.error };

  await logActivity(
    "VENDOR_CREATED",
    `Vendor '${result.vendor.companyName}' was registered by ${user.name}`,
    user.id
  );
  revalidatePath("/vendors");
  return { success: true, vendor: result.vendor };
}

export async function updateVendorAction(id, formData) {
  const user = await getCurrentUser();
  if (!requireRole(user, ["ADMIN", "PROCUREMENT_OFFICER"])) {
    return { error: "Unauthorized" };
  }

  const existing = await prisma.vendor.findUnique({
    where: { id },
    include: { user: true },
  });
  if (!existing) return { error: "Vendor not found" };

  const data = {
    companyName: formData.get("companyName")?.toString().trim(),
    contactPerson: formData.get("contactPerson")?.toString().trim(),
    phone: formData.get("phone")?.toString().trim(),
    gstNumber: formData.get("gstNumber")?.toString().trim() || null,
    category: formData.get("category")?.toString(),
    status: formData.get("status")?.toString(),
    country: formData.get("country")?.toString().trim() || null,
    additionalInfo: formData.get("additionalInfo")?.toString().trim() || null,
  };

  if (!data.companyName || !data.contactPerson || !data.phone || !data.category) {
    return { error: "All required fields must be filled." };
  }

  await prisma.$transaction(async (tx) => {
    await tx.vendor.update({
      where: { id },
      data: {
        companyName: data.companyName,
        contactPerson: data.contactPerson,
        phone: data.phone,
        gstNumber: data.gstNumber,
        category: data.category,
        status: data.status,
      },
    });

    if (existing.user) {
      await tx.user.update({
        where: { id: existing.user.id },
        data: {
          name: data.contactPerson,
          phone: data.phone,
          country: data.country,
          additionalInfo: data.additionalInfo,
        },
      });
    }
  });

  const vendor = await prisma.vendor.findUnique({ where: { id } });

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

  const vendor = await prisma.vendor.findUnique({
    where: { id },
    include: { user: true },
  });
  if (!vendor) return { error: "Vendor not found" };

  await prisma.$transaction(async (tx) => {
    await tx.vendor.delete({ where: { id } });
    if (vendor.userId) {
      await tx.session.deleteMany({ where: { userId: vendor.userId } });
      await tx.user.delete({ where: { id: vendor.userId } });
    }
  });

  await logActivity(
    "VENDOR_DELETED",
    `Vendor '${vendor.companyName}' was deleted by ${user.name}`,
    user.id
  );
  revalidatePath("/vendors");
  return { success: true };
}

export async function checkVendorEmailAction(email) {
  return checkVendorEmailAvailable(email);
}
