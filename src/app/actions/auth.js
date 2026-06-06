"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import {
  hashPassword,
  verifyPassword,
  createSession,
  destroySession,
  getCurrentUser,
} from "@/lib/auth";
import { logActivity } from "@/lib/activity";
import { createVendorAccount } from "@/lib/vendor-account";

export async function loginAction(formData) {
  const email = formData.get("email")?.toString().trim().toLowerCase();
  const password = formData.get("password")?.toString();

  if (!email || !password) {
    return { error: "Email and password are required." };
  }

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user || !(await verifyPassword(password, user.password))) {
    return { error: "Invalid email or password." };
  }

  await createSession(user.id);
  await logActivity("LOGIN", `User '${user.name}' logged in`, user.id);
  redirect("/dashboard");
}

export async function registerAction(formData) {
  const role = formData.get("role")?.toString();

  if (role === "VENDOR") {
    return registerVendorAction(formData);
  }

  return registerStaffAction(formData);
}

async function registerVendorAction(formData) {
  const companyName = formData.get("companyName")?.toString().trim();
  const contactPerson = formData.get("contactPerson")?.toString().trim();
  const email = formData.get("email")?.toString().trim().toLowerCase();
  const phone = formData.get("phone")?.toString().trim();
  const gstNumber = formData.get("gstNumber")?.toString().trim() || null;
  const category = formData.get("category")?.toString();
  const password = formData.get("password")?.toString();
  const country = formData.get("country")?.toString().trim() || null;
  const additionalInfo = formData.get("additionalInfo")?.toString().trim() || null;

  const result = await createVendorAccount({
    companyName,
    contactPerson,
    email,
    phone,
    gstNumber,
    category,
    password,
    country,
    additionalInfo,
    status: "PENDING",
  });

  if (result.error) return { error: result.error };

  await createSession(result.user.id);
  await logActivity(
    "REGISTER",
    `Vendor '${result.vendor.companyName}' self-registered`,
    result.user.id
  );
  await logActivity(
    "VENDOR_CREATED",
    `Vendor '${result.vendor.companyName}' registered via self-signup`,
    result.user.id
  );
  redirect("/dashboard");
}

async function registerStaffAction(formData) {
  const firstName = formData.get("firstName")?.toString().trim();
  const lastName = formData.get("lastName")?.toString().trim();
  const email = formData.get("email")?.toString().trim().toLowerCase();
  const phone = formData.get("phone")?.toString().trim();
  const role = formData.get("role")?.toString();
  const country = formData.get("country")?.toString().trim();
  const additionalInfo = formData.get("additionalInfo")?.toString().trim();
  const password = formData.get("password")?.toString();

  if (!firstName || !lastName || !email || !role || !password) {
    return { error: "Please fill in all required fields." };
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return { error: "Email already registered. Please login instead." };
  }

  const validRoles = ["ADMIN", "PROCUREMENT_OFFICER"];
  if (!validRoles.includes(role)) {
    return { error: "Invalid role selected." };
  }

  const hashed = await hashPassword(password);
  const name = `${firstName} ${lastName}`;

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashed,
      role,
      phone: phone || null,
      country: country || null,
      additionalInfo: additionalInfo || null,
    },
  });

  await createSession(user.id);
  await logActivity("REGISTER", `New user '${name}' registered as ${role}`, user.id);
  redirect("/dashboard");
}

export async function logoutAction() {
  const user = await getCurrentUser();
  if (user) {
    await logActivity("LOGOUT", `User '${user.name}' logged out`, user.id);
  }
  await destroySession();
  redirect("/login");
}
