import { ParsedChat } from "@/@types/network";
import AuthOptions from "@/app/components/AuthOptions";
import { authenticateUser } from "@/app/components/Utils";
import { prisma } from "@/prisma/client";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const session = await getServerSession(AuthOptions);

  if (!session || !(await authenticateUser(session))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const chats = await prisma.chat.findMany({
    where: {
      members: {
        some: {
          userId: session.user.id,
        },
      },
    },

    select: {
      id: true,
      name: true,
      createdAt: true,
      type: true,
      members: {
        select: {
          user: {
            select: {
              id: true,
              name: true,
              image: true,
              email: true,
            },
          },
        },
      },
    },
  });

  const parsedChats = chats.map((chat) => {
    const member = chat.members.find(
      (member) => member.user.id !== session.user.id
    )?.user;

    if (!member) {
      return {
        id: chat.id,
        name: "Unknown",
        type: chat.type,
        src: undefined,
      } as ParsedChat;
    }

    return {
      id: chat.id,
      name: member?.name || "Unknown",
      type: chat.type,
      src: member.image,
    } as ParsedChat;
  });

  return NextResponse.json(parsedChats, { status: 200 });
}
