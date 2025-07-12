import { ParsedChat } from "@/@types/network";
import { UserStatus } from "@/app/generated/prisma";
import authOptions from "@/lib/auth/authOptions";
import { isUserOnline } from "@/lib/redis";
import { authenticateUser } from "@/lib/utils";
import { prisma } from "@/prisma/client";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);

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
      messages: {
        orderBy: {
          createdAt: "desc",
        },
        take: 1,
        select: {
          content: true,
          createdAt: true,
        },
      },
      lastMessageAt: true,
    },

    orderBy: {
      lastMessageAt: "desc",
    },
  });

  const parsedChats = await Promise.all(
    chats.map(async (chat) => {
      const member = chat.members.find(
        (member) => member.user.id !== session.user.id
      )?.user;

      return {
        id: chat.id,
        name: member?.name || member?.email || "Unknown",
        type: chat.type,
        src: member?.image,
        status: (await isUserOnline(member?.id || ""))
          ? UserStatus.Online
          : UserStatus.Offline,
        latestMessageAt: chat.lastMessageAt,
      } as ParsedChat;
    })
  );

  return NextResponse.json(parsedChats, { status: 200 });
}
