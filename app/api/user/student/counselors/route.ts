import { UserStatus, UserType } from "@/app/generated/prisma";
import authOptions from "@/lib/auth/authOptions";
import { isUserOnline } from "@/lib/redis";
import { prisma } from "@/prisma/client";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);

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
      email: true,
      Counselor: {
        select: {
          AvailableSlots: true,
        },
      },
    },
  });

  const counselorsWithStatus = await Promise.all(
    counselors.map(async (counselor) =>
      (await isUserOnline(counselor.id))
        ? { ...counselor, status: UserStatus.Online }
        : { ...counselor, status: UserStatus.Offline }
    )
  );

  return NextResponse.json(counselorsWithStatus, { status: 200 });
}
