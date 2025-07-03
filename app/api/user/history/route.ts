import { NextResponse } from "next/server";
import { prisma } from "@/prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { chathistory } from "@/app/generated/prisma";

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
