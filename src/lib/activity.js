import { prisma } from "@/lib/prisma";

export async function logActivity(action, description, userId = null) {
  await prisma.activityLog.create({
    data: { action, description, userId },
  });
}
