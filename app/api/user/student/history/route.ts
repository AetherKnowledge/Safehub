import { chathistory } from "@/app/generated/prisma";
import authOptions from "@/lib/auth/authOptions";
import { prisma } from "@/prisma/client";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const chatHistory: chathistory[] = await prisma.chathistory.findMany({
    where: {
      session_id: session.user.id,
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  return NextResponse.json(chatHistory, { status: 200 });
}
