import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/auth";

export async function checkVendorEmailAvailable(email) {
  const normalized = email.trim().toLowerCase();

  const existingUser = await prisma.user.findUnique({
    where: { email: normalized },
  });
  if (existingUser) {
    return {
      available: false,
      message: "This email is already registered. Please login instead.",
    };
  }

  const existingVendor = await prisma.vendor.findFirst({
    where: { email: { equals: normalized, mode: "insensitive" } },
  });
  if (existingVendor) {
    return {
      available: false,
      message: existingVendor.userId
        ? "This vendor is already registered. Please login instead."
        : "A vendor with this email already exists.",
    };
  }

  return { available: true };
}

export async function createVendorAccount({
  companyName,
  contactPerson,
  email,
  phone,
  gstNumber,
  category,
  password,
  country,
  additionalInfo,
  status = "PENDING",
}) {
  const normalizedEmail = email.trim().toLowerCase();

  const availability = await checkVendorEmailAvailable(normalizedEmail);
  if (!availability.available) {
    return { error: availability.message };
  }

  if (!companyName || !contactPerson || !normalizedEmail || !phone || !category || !password) {
    return { error: "Company name, contact person, email, phone, category, and password are required." };
  }

  if (password.length < 6) {
    return { error: "Password must be at least 6 characters." };
  }

  const hashed = await hashPassword(password);

  const result = await prisma.$transaction(async (tx) => {
    const user = await tx.user.create({
      data: {
        name: contactPerson,
        email: normalizedEmail,
        password: hashed,
        role: "VENDOR",
        phone: phone || null,
        country: country || null,
        additionalInfo: additionalInfo || null,
      },
    });

    const vendor = await tx.vendor.create({
      data: {
        companyName,
        contactPerson,
        email: normalizedEmail,
        phone,
        gstNumber: gstNumber || null,
        category,
        status,
        userId: user.id,
      },
    });

    return { user, vendor };
  });

  return { success: true, ...result };
}
