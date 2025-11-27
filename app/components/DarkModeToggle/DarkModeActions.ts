"use server";

import { auth } from "@/auth";
import { prisma } from "@/prisma/client";

export async function changeDarkMode(darkMode: boolean) {
  const session = await auth();
  if (!session?.user?.id || session.user.deactivated) {
    throw new Error("Unauthorized");
  }

  await prisma.user.update({
    where: { id: session.user.id },
    data: { darkMode },
  });
}
