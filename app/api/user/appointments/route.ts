import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { Appointment, chathistory } from "@/app/generated/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Get the user ID from the email via Prisma
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const appointments: Appointment[] = await prisma.appointment.findMany({
    where:
      user.type === "student"
        ? { studentId: user.id }
        : { counselorId: user.id },
    orderBy: {
      createdAt: "asc",
    },
    include: {
      student: {
        select: {
          id: true,
          name: true,
          image: true,
        },
      },
      counselor: {
        select: {
          id: true,
          name: true,
          image: true,
        },
      },
    },
  });

  return NextResponse.json(appointments, { status: 200 });
}
