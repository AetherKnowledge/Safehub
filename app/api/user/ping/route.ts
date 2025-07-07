// pages/api/ping.ts
import { getServerSession } from "next-auth";
import AuthOptions from "@/app/components/AuthOptions";
import { prisma } from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const session = await getServerSession(AuthOptions);

  if (!session || !session.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await prisma.user.update({
    where: { email: session.user.email },
    data: { lastActiveAt: new Date() },
  });

  return NextResponse.json({ message: "Pong" }, { status: 200 });
}
