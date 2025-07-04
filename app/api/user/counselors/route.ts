import { NextResponse } from "next/server";
import { prisma } from "@/prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { UserType } from "@/app/generated/prisma";

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const counselors = await prisma.user.findMany({
    where: {
      type: UserType.counselor,
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

  return NextResponse.json(counselors, { status: 200 });
}
