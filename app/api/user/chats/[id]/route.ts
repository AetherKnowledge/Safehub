import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/prisma/client";
import { getServerSession } from "next-auth";
import { Message } from "@/app/components/Chats/Chatbox/messaging";
import AuthOptions from "@/app/components/AuthOptions";
import { messageSchema } from "@/app/components/Schemas";
import { IncomingMessage } from "node:http";
import { WebSocket, WebSocketServer } from "ws";
import { getToken } from "next-auth/jwt";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(AuthOptions);
  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;

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
    return NextResponse.json({ error: "Chat not found" }, { status: 404 });
  }

  if (!chat.members.some((member) => member.userId === session.user.id)) {
    return NextResponse.json(
      { error: "You are not a member of this chat" },
      { status: 403 }
    );
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

  return NextResponse.json(messages, { status: 200 });
}

const secret = process.env.NEXTAUTH_SECRET;

export async function SOCKET(
  client: WebSocket,
  request: IncomingMessage,
  server: WebSocketServer,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  const token = await getToken({ req: request as any, secret });
  console.log(
    "WebSocket connection attempt for chat:",
    id,
    " by ",
    token?.name
  );

  if (!token || !token.sub || !token.email) {
    console.error("Unauthorized access attempt:", request.socket.remoteAddress);
    client.close(1008, "Unauthorized");
    return;
  }

  const userId = token.sub;
  const userName = token.name || "Anonymous";
  const userImage = token.picture;

  console.log("Client connected to chat:", id, "User ID:", userId);

  const chat = await prisma.chat.findUnique({
    where: { id },
    include: {
      members: {
        where: { userId },
        select: { userId: true },
      },
    },
  });

  if (!chat) {
    client.close(1008, "Chat not found");
    return;
  }

  if (!chat.members.some((member) => member.userId === userId)) {
    client.close(1008, "You are not a member of this chat");
    return;
  }

  client.on("message", async (data: JSON) => {
    try {
      const messageData = JSON.parse(data.toString());
      const validation = messageSchema.safeParse(messageData);

      if (!validation.success || !validation.data || !validation.data.content) {
        client.send(JSON.stringify({ error: "Invalid message format" }));
        return;
      }

      const newMessage = await prisma.chatMessage.create({
        data: {
          chatId: id,
          userId,
          content: validation.data.content,
        },
      });

      for (const ws of server.clients) {
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(
            JSON.stringify({
              message: {
                ...newMessage,
                name: userName,
                src: userImage,
              } as Message,
            })
          );
        }
      }
    } catch (error) {
      console.error("Error processing message:", error);
      client.send(JSON.stringify({ error: "Failed to process message" }));
    }
  });

  client.on("close", () => {
    console.log("Client disconnected from chat:", id, "User ID:", userId);
    client.close();
  });
}
