"use server";

import { auth } from "@/auth";
import { prisma } from "@/prisma/client";

// TODO: secure this later

export async function getUserName(userId: string): Promise<string> {
  const session = await auth();
  if (!session?.user || session.user.deactivated) {
    throw new Error("User not authenticated");
  }

  return await prisma.user
    .findUnique({
      where: { id: userId },
      select: { name: true },
    })
    .then((user) => user?.name || "Unknown User");
}
