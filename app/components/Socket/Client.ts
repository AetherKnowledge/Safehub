import { prisma } from "@/prisma/client";
import { JWT } from "next-auth/jwt/types";
import { WebSocket, WebSocketServer } from "ws";
import { Message } from "../Chats/Chatbox/messaging";
import { joinChatSchema, messageSchema } from "../Schemas";
import {
  SocketError,
  SocketEvent,
  SocketEventType,
  SocketMessage,
} from "./SocketEvents";

class Client {
  private client: WebSocket;
  private clientToken: JWT;
  private server: WebSocketServer;

  constructor(client: WebSocket, server: WebSocketServer, token: JWT) {
    this.client = client;
    this.server = server;
    this.clientToken = token;
    this.client.userId = token.sub;

    this.client.on("open", () => {
      console.log(
        `WebSocket connection established for user: ${this.clientToken.name}`
      );
    });

    this.client.on("message", (data: JSON) => {
      try {
        const event = JSON.parse(data.toString()) as SocketEvent;
        this.handlePayload(event);
      } catch (error) {
        console.error("Error parsing message:", error);
        this.client.send(
          JSON.stringify({
            type: SocketEventType.ERROR,
            payload: "Invalid data format",
          })
        );
      }
    });

    this.client.on("error", (error: Error) => {
      console.error("WebSocket error:", error);
    });

    this.client.on("close", () => {
      console.log("WebSocket connection closed");
    });
  }

  private handlePayload(event: SocketEvent) {
    switch (event.type) {
      case SocketEventType.MESSAGE:
        console.log("Message received:", event.payload);
        this.receiveMessage(event.payload as SocketMessage);
        break;
      case SocketEventType.CALL:
        console.log("Call event received:", event.payload);
        break;
      case SocketEventType.ERROR:
        console.error("Error event received:", event.payload);
        break;
      case SocketEventType.JOINCHAT:
        console.log("Join chat event received:", event.payload);
        this.joinChat(event.payload as JSON);
        break;
      case SocketEventType.LEAVECHAT:
        console.log("Leave chat event received:", event.payload);
        this.leaveChat();
        break;
      case SocketEventType.TYPING:
        console.log("Typing event received:", event.payload);
        // Handle typing event logic here
        break;
      default:
        console.warn("Unknown event type:", event.type);
    }
  }

  public joinChat(payload: JSON) {
    const validation = joinChatSchema.safeParse(payload);
    if (!validation.success || !validation.data) {
      console.error("Invalid join chat payload:", payload, validation.error);
      this.client.send(
        this.makeErrorResponse("Invalid join chat payload", 400)
      );
      return;
    }

    const { chatId } = validation.data;
    console.log("Joining chat with ID:", chatId);
    if (!this.isMemberOfChat(chatId)) {
      console.error("User is not a member of the chat:", chatId);
      this.client.send(
        this.makeErrorResponse("You are not a member of this chat", 403)
      );
      return;
    }

    this.client.chatId = chatId;
  }

  public leaveChat() {
    console.log("Leaving chat with ID:", this.client.chatId);
    this.client.chatId = undefined; // Clear the chatId
  }

  public isMemberOfChat(chatId: string): Promise<boolean> {
    return prisma.chat
      .findUnique({
        where: { id: chatId },
        select: {
          members: {
            where: { userId: this.clientToken.sub },
            select: { userId: true },
          },
        },
      })
      .then((chat) => {
        if (!chat) return false;
        return chat.members.length > 0;
      });
  }

  public sendMessage(message: SocketMessage) {
    const event: SocketEvent = {
      type: SocketEventType.MESSAGE,
      payload: message,
    };
    this.client.send(JSON.stringify(event));
  }

  private async receiveMessage(payload: SocketMessage) {
    console.log("Handling message:", payload);
    const validation = messageSchema.safeParse(payload);

    if (!validation.success || !validation.data) {
      console.error("Invalid message format:", payload, validation.error);
      this.client.send(JSON.stringify({ error: "Invalid message format" }));
      return;
    }

    console.log("Message content validated:", validation.data);

    const chat = await prisma.chat.findUnique({
      where: { id: payload.chatId },
      include: {
        members: {
          where: { userId: this.clientToken.sub },
          select: { userId: true },
        },
      },
    });

    if (!chat) {
      console.error("Chat not found for ID:", payload.chatId);
      this.client.close(1008, "Chat not found");
      return;
    }

    if (
      !chat.members.some((member) => member.userId === this.clientToken.sub)
    ) {
      console.log("User is not a member of the chat");
      this.client.close(1008, "You are not a member of this chat");
      return;
    }

    const newMessage = await prisma.chatMessage.create({
      data: {
        chatId: payload.chatId,
        userId: this.clientToken.sub!,
        content: validation.data.content,
      },
    });

    for (const ws of this.server.clients) {
      if (ws.readyState === WebSocket.OPEN && ws.chatId === payload.chatId) {
        console.log(
          "Sending message to client:",
          ws.userId,
          newMessage.content
        );
        ws.send(
          JSON.stringify({
            type: SocketEventType.MESSAGE,
            payload: {
              ...newMessage,
              name: this.clientToken.name,
              src: this.clientToken.picture,
            },
          } as SocketEvent<Message>)
        );
      }
    }
  }

  public makeErrorResponse(message: string, code?: number): string {
    return JSON.stringify({
      type: SocketEventType.ERROR,
      payload: {
        message,
        code: code, // Custom error code for unauthorized access
      } as SocketError,
    });
  }

  public close() {
    this.client.close();
  }
}

export default Client;
