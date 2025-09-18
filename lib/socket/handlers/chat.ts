import { joinChatSchema } from "@/lib/schemas";
import { prisma } from "@/prisma/client";
import ClientSocketServer from "../ClientSocketServer";
import { SocketErrorRequestType, SocketJoinChat } from "../SocketEvents";
import { sendErrorResponseToSelf } from "./messaging";

export async function joinChat(
  client: ClientSocketServer,
  payload: SocketJoinChat
) {
  const validation = joinChatSchema.safeParse(payload);
  if (!validation.success || !validation.data) {
    sendErrorResponseToSelf(
      client,
      "Invalid join chat payload",
      SocketErrorRequestType.INVALID_DATA
    );
    return;
  }
  const { chatId } = validation.data;
  console.log("Joining chat with ID:", chatId);
  if (!(await isMemberOfChat(client, chatId))) {
    sendErrorResponseToSelf(
      client,
      `You are not a member of chat ${chatId}`,
      SocketErrorRequestType.FORBIDDEN
    );
    return;
  }
  client.clientSocket.chatId = chatId;
  console.log("User joined chat:", chatId);
}

export async function leaveChat(client: ClientSocketServer) {
  console.log("Leaving chat with ID:", client.clientSocket.chatId);
  client.clientSocket.chatId = undefined;
}

export async function isMemberOfChat(
  client: ClientSocketServer,
  chatId: string,
  userId: string = client.socketUser.id!
): Promise<boolean> {
  console.log("Checking if user:", userId, "is a member of chat:", chatId);
  try {
    const chat = await prisma.chat.findUnique({
      where: { id: chatId },
      select: {
        members: {
          where: { userId },
          select: { userId: true },
        },
      },
    });
    const isMember = !!chat && chat.members.length > 0;
    console.log(
      `isMemberOfChat result for user ${userId} in chat ${chatId}:`,
      isMember
    );
    return isMember;
  } catch (error) {
    console.error("Error checking chat membership:", error);
    return false;
  }
}
