import { NextResponse } from "next/server";
import { prisma } from "@/prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { UserType, UserStatus } from "@/app/generated/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (
    !session ||
    !session.user?.email ||
    session.user.type !== UserType.Admin
  ) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      type: true,
      createdAt: true,
      updatedAt: true,
      lastActiveAt: true,
      status: true,
    },
    orderBy: {
      name: "asc",
    },
  });

  const usersWithStatus = users.map((user) => {
    const now = new Date();
    const lastActive = user.lastActiveAt ? new Date(user.lastActiveAt) : null;

    if (lastActive) {
      const diffInMinutes = Math.floor(
        (now.getTime() - lastActive.getTime()) / 60000
      );

      if (diffInMinutes < 1) {
        user.status = UserStatus.Online;
      }
    }

    return { ...user };
  });

  return NextResponse.json(usersWithStatus, { status: 200 });
}
