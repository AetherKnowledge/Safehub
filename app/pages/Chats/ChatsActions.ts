"use server";

import { ChatData, Message } from "@/@types/network";
import ActionResult from "@/app/components/ActionResult";
import { ChatType, UserStatus } from "@/app/generated/prisma";
import { auth } from "@/auth";
import { isUserOnline } from "@/lib/redis";
import { Recipient } from "@/lib/socket/SocketEvents";

import { prisma } from "@/prisma/client";

// TODO: Make it so chat name is dependent on the other user's name if it is direct

// only returns latest message for each chat
// useMessaging will fetch all messages for the selected chat
export async function getChats(): Promise<ChatData[]> {
  console.log("Fetching chats...");
  const session = await auth();

  if (!session || session.user.deactivated) {
    throw new Error("Unauthorized");
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
          userId: true,
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

  if (!chats || chats.length === 0) {
    return [];
  }

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
        latestMessage: chat.messages[0]
          ? ({
              ...chat.messages[0],
              name: member?.name || member?.email || "Unknown",
              src: member?.image || undefined,
            } as Message)
          : undefined,
      } as ChatData;
    })
  );

  console.log("Fetched chats:", parsedChats);

  return parsedChats;
}
("");
export async function getDirectChatId(
  userId: string
): Promise<ActionResult<string>> {
  try {
    const session = await auth();
    if (!session?.user?.id || session.user.deactivated) {
      throw new Error("Unauthorized");
    }

    if (!userId || typeof userId !== "string") {
      throw new Error("Invalid user ID");
    }

    const existingChat = await prisma.chat.findFirst({
      where: {
        type: ChatType.DIRECT,
        members: {
          every: {
            userId: { in: [session.user.id, userId] },
          },
        },
      },
    });

    if (!existingChat) {
      return { success: false, message: "Direct chat not found" };
    }

    return { success: true, data: existingChat.id };
  } catch (err) {
    console.error("Error in getDirectChatId:", err);
    return { success: false, message: (err as Error).message };
  }
}

export type ChatInfo = {
  chatId: string;
  chatName?: string;
  recipients: Recipient[];
};

export async function getChatInfo(id: string): Promise<ChatInfo | null> {
  const session = await auth();
  if (!session || session.user.deactivated) {
    throw new Error("Unauthorized");
  }

  if (!id || typeof id !== "string") {
    throw new Error("Invalid chat ID");
  }

  const chat = await prisma.chat.findUnique({
    where: { id },
    select: {
      members: {
        select: { user: { select: { id: true, image: true, name: true } } },
      },
      name: true,
      id: true,
    },
  });

  if (!chat) {
    throw new Error("Chat not found");
  }

  if (!chat.members.some((member) => member.user.id === session.user.id)) {
    throw new Error("You are not a member of this chat");
  }

  return {
    chatId: chat.id,
    chatName: chat.name,
    recipients: chat.members.map((member) => ({
      id: member.user.id,
      name: member.user.name,
      image: member.user.image,
    })),
  } as ChatInfo;
}

export async function getChatById(id: string): Promise<Message[]> {
  const session = await auth();
  if (!session || session.user.deactivated) {
    throw new Error("Unauthorized");
  }

  if (!id || typeof id !== "string") {
    throw new Error("Invalid chat ID");
  }

  const chat = await prisma.chat.findUnique({
    where: { id },
    include: {
      members: {
        where: { userId: session.user.id },
        select: { userId: true },
      },
      messages: {
        orderBy: { createdAt: "asc" },
        include: {
          user: {
            select: { name: true, image: true },
          },
        },
      },
    },
  });

  if (!chat) {
    throw new Error("Chat not found");
  }

  if (!chat.members.some((member) => member.userId === session.user.id)) {
    throw new Error("You are not a member of this chat");
  }

  const messages: Message[] = chat.messages.map((msg) => ({
    id: msg.id,
    chatId: msg.chatId,
    userId: msg.userId,
    content: msg.content,
    createdAt: msg.createdAt,
    updatedAt: msg.updatedAt,
    name: msg.user?.name || "Unknown",
    src: msg.user?.image || undefined,
  }));

  return messages as Message[];
}
