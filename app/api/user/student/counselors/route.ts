import AuthOptions from "@/app/components/AuthOptions";
import { UserStatus, UserType } from "@/app/generated/prisma";
import { prisma } from "@/prisma/client";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const session = await getServerSession(AuthOptions);

  if (!session || !session.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const counselors = await prisma.user.findMany({
    where: {
      type: UserType.Counselor,
    },
    orderBy: {
      createdAt: "asc",
    },
    select: {
      id: true,
      name: true,
      image: true,
      lastActiveAt: true,
      status: true,
      email: true,
      Counselor: {
        select: {
          AvailableSlots: true,
        },
      },
    },
  });

  const counselorWithStatus = counselors.map((counselor) => {
    const now = new Date();
    const lastActive = counselor.lastActiveAt
      ? new Date(counselor.lastActiveAt)
      : null;

    if (lastActive) {
      const diffInMinutes = Math.floor(
        (now.getTime() - lastActive.getTime()) / 60000
      );

      if (diffInMinutes < 1) {
        counselor.status = UserStatus.Online;
      }
    }

    return { ...counselor };
  });

  return NextResponse.json(counselorWithStatus, { status: 200 });
}
