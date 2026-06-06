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

export async function loginAction(formData) {
  const email = formData.get("email")?.toString().trim();
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
  const firstName = formData.get("firstName")?.toString().trim();
  const lastName = formData.get("lastName")?.toString().trim();
  const email = formData.get("email")?.toString().trim();
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
    return { error: "Email already registered." };
  }

  const validRoles = ["ADMIN", "PROCUREMENT_OFFICER", "VENDOR"];
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

  if (role === "VENDOR") {
    await prisma.vendor.create({
      data: {
        companyName: `${firstName} ${lastName} Co.`,
        contactPerson: name,
        email,
        phone: phone || "N/A",
        category: "General",
        status: "PENDING",
        userId: user.id,
      },
    });
  }

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
