import { CallStatus } from "@/app/generated/prisma";
import { prisma } from "@/prisma/client";
import { JWT } from "next-auth/jwt/types";
import { WebSocket, WebSocketServer } from "ws";
import {
  answerCallSchema,
  initiateCallSchema,
  joinChatSchema,
  leaveCallSchema,
  messageSchema,
  sdpSchema,
} from "../Schemas";
import {
  CallAnswerType,
  SocketAnswerCall,
  SocketCallEnded,
  SocketError,
  SocketEvent,
  SocketEventType,
  SocketInitiateCall,
  SocketJoinChat,
  SocketLeaveCall,
  SocketMessage,
  SocketSdp,
} from "./SocketEvents";
import { Message } from "./useMessaging";

class ClientSocketServer {
  private client: WebSocket;
  private clientToken: JWT;
  private server: WebSocketServer;
  private lastMessageTime: number = 0;
  private messageCount: number = 0;
  private readonly MESSAGE_RATE_LIMIT = 10; // messages per minute
  private readonly MESSAGE_RATE_WINDOW = 60000; // 1 minute in ms
  private heartbeatInterval?: NodeJS.Timeout;
  private callTimeout?: NodeJS.Timeout;

  constructor(client: WebSocket, server: WebSocketServer, token: JWT) {
    this.client = client;
    this.server = server;
    this.clientToken = token;
    this.client.userId = token.sub;
    this.client.socketId = crypto.randomUUID(); // Assign a unique socket ID

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
      console.log(
        `WebSocket connection closed for user: ${this.clientToken.name}`
      );
      this.cleanup();
    });

    // Set up heartbeat
    this.setupHeartbeat();
  }

  private handlePayload(event: SocketEvent) {
    switch (event.type) {
      case SocketEventType.MESSAGE:
        console.log("Message received:", event.payload);
        this.receiveMessage(event.payload as SocketMessage);
        break;
      case SocketEventType.INITIATECALL:
        console.log("Call event received:", event.payload);
        this.receiveInitiateCall(event.payload as SocketInitiateCall);
        break;
      case SocketEventType.ANSWERCALL:
        console.log("Answer call event received:", event.payload);
        this.receiveAnswerCall(event.payload as SocketAnswerCall);
        break;
      case SocketEventType.LEAVECALL:
        console.log("Leave call event received:", event.payload);
        this.receiveLeaveCall(event.payload as SocketLeaveCall);
        break;
      case SocketEventType.ERROR:
        console.error("Error event received:", event.payload);
        break;
      case SocketEventType.JOINCHAT:
        console.log("Join chat event received:", event.payload);
        this.joinChat(event.payload as SocketJoinChat);
        break;
      case SocketEventType.LEAVECHAT:
        console.log("Leave chat event received:", event.payload);
        this.leaveChat();
        break;
      case SocketEventType.SDP:
        console.log("SDP event received:", event.payload);
        this.receiveSdpData(event.payload as SocketSdp);
        break;
      case SocketEventType.TYPING:
        console.log("Typing event received:", event.payload);
        // Handle typing event logic here
        break;
      default:
        console.warn("Unknown event type:", event.type);
    }
  }

  private async receiveInitiateCall(payload: SocketInitiateCall) {
    const validation = initiateCallSchema.safeParse(payload);
    if (!validation.success || !validation.data) {
      this.sendErrorResponseToSelf("Invalid initiate call payload", 400);
      return;
    }
    const { chatId, callerId } = validation.data;

    const chat = await prisma.chat.findUnique({
      where: { id: chatId },
      include: {
        call: {
          select: { id: true, callMember: { select: { socketId: true } } },
        },
        members: {
          select: {
            userId: true,
            user: { select: { name: true, image: true } },
          },
        },
      },
    });

    if (!this.client.socketId) this.client.socketId = crypto.randomUUID();

    if (!chat) {
      console.error("Chat not found for ID:", chatId);
      this.sendErrorResponseToSelf("Chat not found", 404);
      return;
    }

    if (!(await this.isMemberOfChat(chatId))) {
      console.error("User is not a member of the chat:", chatId);
      this.sendErrorResponseToSelf("You are not a member of this chat", 403);
      return;
    }

    // Improved: Only one call per chat, delete old call if orphaned
    if (chat.call) {
      const activeSockets = Array.from(this.server.clients).filter(
        (ws) =>
          ws.readyState === WebSocket.OPEN &&
          ws.chatId === chatId &&
          ws.callId === chat.call!.id
      );
      if (activeSockets.length > 1) {
        console.error("Call already exists for chat:", chatId);
        this.sendErrorResponseToSelf("Call already exists for this chat", 409);
        return;
      } else {
        console.log("Deleting orphaned call for chat:", chatId);
        await this.deleteCall(chat.call.id);
      }
    }

    const member = chat.members.find((m) => m.userId === callerId);
    const initiateCallData: SocketInitiateCall = {
      ...validation.data,
      callerName: member?.user.name || this.clientToken.name || "Unknown",
      callerImage: member?.user.image || this.clientToken.picture || undefined,
    };

    await prisma.call.create({
      data: {
        id: initiateCallData.callId,
        chatId,
        status: CallStatus.Pending,
        callerId,
      },
    });

    await this.createCallMember(initiateCallData.callId, callerId);

    // Notify all chat members except caller
    for (const ws of this.server.clients) {
      if (
        ws.readyState === WebSocket.OPEN &&
        chat.members.some((m) => m.userId === ws.userId) &&
        ws.userId !== callerId
      ) {
        ws.send(
          JSON.stringify({
            type: SocketEventType.INITIATECALL,
            payload: initiateCallData,
          } as SocketEvent<SocketInitiateCall>)
        );
      }
    }

    this.setupCallTimeout(initiateCallData.callId, chatId);
    this.client.callId = initiateCallData.callId;
    console.log(
      "Initiate call setup complete for callId:",
      initiateCallData.callId
    );
  }

  private async receiveAnswerCall(payload: SocketAnswerCall) {
    const validation = answerCallSchema.safeParse(payload);
    if (!validation.success || !validation.data) {
      this.sendErrorResponseToSelf("Invalid answer call payload", 400);
      return;
    }
    const { callId, chatId, answer } = validation.data;

    const call = await prisma.call.findUnique({
      where: { id: callId },
      include: {
        callMember: true,
        chat: {
          include: {
            members: {
              select: {
                userId: true,
                user: { select: { name: true, image: true } },
              },
            },
          },
        },
      },
    });

    if (!call) {
      console.error("Call not found for ID:", callId);
      this.sendErrorResponseToSelf("Call not found", 404);
      return;
    }
    if (!(await this.isMemberOfChat(chatId))) {
      console.error("User is not a member of the chat:", chatId);
      this.sendErrorResponseToSelf("You are not a member of this chat", 403);
      return;
    }
    if (call.chatId !== chatId) {
      console.error("Call does not belong to the specified chat:", chatId);
      this.sendErrorResponseToSelf("Call does not belong to this chat", 403);
      return;
    }
    if (call.callerId === this.clientToken.sub) {
      console.error("User cannot answer their own call:", this.clientToken.sub);
      this.sendErrorResponseToSelf("You cannot answer your own call", 403);
      return;
    }
    if (call.status !== CallStatus.Pending) {
      console.error("Call is not in pending status:", call.status);
      this.sendErrorResponseToSelf("Call is not in pending status", 400);
      return;
    }

    this.clearCallTimeout();
    if (
      answer === CallAnswerType.REJECT ||
      answer === CallAnswerType.DID_NOT_ANSWER
    ) {
      console.log("Call rejected by user:", this.clientToken.name);
      this.sendMessageToClient(
        SocketEventType.ANSWERCALL,
        { callId, chatId, answer: CallAnswerType.REJECT } as SocketAnswerCall,
        call.callerId
      );
      if (call.callMember.length < 2) {
        console.log(
          "Deleting call due to rejection and no members left:",
          call.id
        );
        await this.deleteCall(call.id);
      }
      return;
    }

    console.log("Call accepted by user:", this.clientToken.name);
    await prisma.call.update({
      where: { id: callId },
      data: { status: CallStatus.Accepted },
    });

    this.sendMessageToClient(
      SocketEventType.ANSWERCALL,
      {
        userId: this.clientToken.sub,
        userName: this.clientToken.name,
        callId,
        chatId,
        answer: CallAnswerType.ACCEPT,
      } as SocketAnswerCall,
      call.callerId
    );

    await this.createCallMember(callId, this.clientToken.sub!);
    this.client.callId = callId;
    console.log("Answer call setup complete for callId:", callId);
  }

  private async receiveLeaveCall(payload: SocketLeaveCall) {
    const validation = leaveCallSchema.safeParse(payload);
    if (!validation.success || !validation.data) {
      this.sendErrorResponseToSelf("Invalid leave call payload", 400);
      return;
    }
    const { callId, chatId } = validation.data;
    await this.leaveCall(callId, chatId);
  }

  private async receiveSdpData(payload: SocketSdp) {
    const validation = sdpSchema.safeParse(payload);
    if (!validation.success || !validation.data) {
      this.sendErrorResponseToSelf("Invalid SDP offer payload", 400);
      return;
    }
    const { to, callId, chatId, sdpData } = validation.data;

    const call = await prisma.call.findUnique({
      where: { id: callId },
      include: {
        callMember: { select: { userId: true } },
        chat: {
          include: {
            members: {
              select: {
                userId: true,
                user: { select: { name: true, image: true } },
              },
            },
          },
        },
      },
    });

    if (!call) {
      this.sendErrorResponseToSelf("Call not found", 404);
      return;
    }
    if (!(await this.isMemberOfChat(chatId))) {
      this.sendErrorResponseToSelf("You are not a member of this chat", 403);
      return;
    }
    if (!(await this.isMemberOfChat(chatId, to))) {
      this.sendErrorResponseToSelf("User is not a member of this chat", 403);
      return;
    }
    if (call.chatId !== chatId) {
      this.sendErrorResponseToSelf("Call does not belong to this chat", 403);
      return;
    }

    console.log(
      `Received SDP data from client: ${this.clientToken.name}, sending to peer: ${to}`
    );
    for (const ws of this.server.clients) {
      if (
        ws.readyState === WebSocket.OPEN &&
        ws.userId === to &&
        ws.callId === callId
      ) {
        ws.send(
          JSON.stringify({
            type: SocketEventType.SDP,
            payload: {
              from: this.clientToken.sub,
              to,
              callId,
              chatId,
              sdpData,
            } as SocketSdp,
          } as SocketEvent<SocketSdp>)
        );
      }
    }
  }

  private async leaveCall(callId: string, chatId: string) {
    const call = await prisma.call.findUnique({
      where: { id: callId },
      include: {
        callMember: true,
        chat: {
          include: {
            members: {
              select: {
                userId: true,
                user: { select: { name: true, image: true } },
              },
            },
          },
        },
      },
    });

    console.log("Leaving call with ID:", callId, "in chat:", chatId);

    if (!call) {
      console.error("Call not found for ID:", callId);
      this.sendErrorResponseToSelf("Call not found", 404);
      return;
    }
    if (call.chatId !== chatId) {
      console.error("Call does not belong to the specified chat:", chatId);
      this.sendErrorResponseToSelf("Call does not belong to this chat", 403);
      return;
    }
    if (callId !== this.client.callId) {
      console.error("User is not a member of the call:", callId);
      this.sendErrorResponseToSelf("You are not a member of this call", 403);
      return;
    }

    await prisma.callMember.delete({
      where: {
        callId_userId: { callId, userId: this.clientToken.sub! },
      },
    });

    // If no members are left, delete the call
    if (call.callMember.length - 1 < 2) {
      console.log("Deleting call as no members left:", call.id);
      await this.deleteCall(call.id);
    }

    // Notify other members
    for (const ws of this.server.clients) {
      if (
        ws.readyState === WebSocket.OPEN &&
        ws.chatId === chatId &&
        ws.userId !== this.clientToken.sub
      ) {
        ws.send(
          JSON.stringify({
            type: SocketEventType.LEAVECALL,
            payload: {
              userId: this.clientToken.sub,
              userName: this.clientToken.name || undefined,
              callId,
              chatId,
            },
          } as SocketEvent<SocketLeaveCall>)
        );
      }
    }

    console.log("User left call, callId cleared:", callId);
    this.client.callId = undefined;
  }

  private async createCallMember(callId: string, userId: string) {
    if (!this.client.socketId) this.client.socketId = crypto.randomUUID();
    console.log("Creating call member:", {
      callId,
      userId,
      socketId: this.client.socketId,
    });
    return await prisma.callMember.create({
      data: { socketId: this.client.socketId, callId, userId },
    });
  }

  public async joinChat(payload: SocketJoinChat) {
    const validation = joinChatSchema.safeParse(payload);
    if (!validation.success || !validation.data) {
      this.sendErrorResponseToSelf("Invalid join chat payload", 400);
      return;
    }
    const { chatId } = validation.data;
    console.log("Joining chat with ID:", chatId);
    if (!(await this.isMemberOfChat(chatId))) {
      console.error("User is not a member of the chat:", chatId);
      this.sendErrorResponseToSelf("You are not a member of this chat", 403);
      return;
    }
    this.client.chatId = chatId;
    console.log("User joined chat:", chatId);
  }

  public leaveChat() {
    console.log("Leaving chat with ID:", this.client.chatId);
    this.client.chatId = undefined;
  }

  public async isMemberOfChat(
    chatId: string,
    userId: string = this.clientToken.sub!
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

  private sendMessageToSelf(
    eventType: SocketEventType,
    payload:
      | SocketMessage
      | SocketInitiateCall
      | SocketAnswerCall
      | SocketCallEnded
      | SocketError
  ) {
    if (this.client.readyState !== WebSocket.OPEN) return;
    console.log(`Sending message to self: ${this.clientToken.name}`, {
      eventType,
      payload,
    });
    this.client.send(JSON.stringify({ type: eventType, payload }));
  }

  private sendMessageToClient(
    eventType: SocketEventType,
    payload:
      | SocketMessage
      | SocketInitiateCall
      | SocketAnswerCall
      | SocketCallEnded
      | SocketError,
    id: string
  ) {
    if (id === this.clientToken.sub) {
      this.sendMessageToSelf(eventType, payload);
      return;
    }
    for (const ws of this.server.clients) {
      if (ws.readyState === WebSocket.OPEN && ws.userId === id) {
        console.log(`Sending message to client: ${ws.userId}`, {
          eventType,
          payload,
        });
        ws.send(JSON.stringify({ type: eventType, payload }));
      }
    }
  }

  private async receiveMessage(payload: SocketMessage) {
    if (this.isRateLimited()) {
      console.warn(`Rate limit exceeded for user: ${this.clientToken.name}`);
      this.sendErrorResponseToSelf(
        "Rate limit exceeded. Please slow down.",
        429
      );
      return;
    }
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
    if (!chat.members.some((m) => m.userId === this.clientToken.sub)) {
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

  private isRateLimited(): boolean {
    const now = Date.now();
    if (now - this.lastMessageTime > this.MESSAGE_RATE_WINDOW) {
      this.messageCount = 0;
      this.lastMessageTime = now;
    }
    this.messageCount++;
    if (this.messageCount > this.MESSAGE_RATE_LIMIT) {
      console.warn(`Rate limit exceeded for user: ${this.clientToken.name}`);
      return true;
    }
    return false;
  }

  public sendErrorResponseToSelf(message: string, code?: number) {
    console.error("Sending error response to self:", message, code);
    this.sendMessageToSelf(SocketEventType.ERROR, {
      message,
      code,
    } as SocketError);
  }

  private async cleanup() {
    console.log(`Cleaning up resources for user: ${this.clientToken.name}`);
    this.client.chatId = undefined;
    this.client.userId = undefined;
    this.clearCallTimeout();
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = undefined;
    }
    if (this.client.callId && this.client.chatId) {
      await this.leaveCall(this.client.callId, this.client.chatId);
    }
    console.log(`Cleaned up resources for user: ${this.clientToken.name}`);
  }

  private clearCallTimeout() {
    if (this.callTimeout) {
      clearTimeout(this.callTimeout);
      this.callTimeout = undefined;
      console.log("Call timeout cleared");
    }
  }

  private async deleteCall(callId: string) {
    await prisma.call.delete({ where: { id: callId } });
    console.log(`Call with ID ${callId} deleted`);
    for (const ws of this.server.clients) {
      if (
        ws.readyState === WebSocket.OPEN &&
        ws.callId === callId &&
        ws.userId !== this.clientToken.sub
      ) {
        console.log(`Notifying client ${ws.userId} about call end`);
        this.sendMessageToClient(
          SocketEventType.CALLENDED,
          { callId, chatId: ws.chatId } as SocketCallEnded,
          ws.userId!
        );
      }
    }
    this.client.callId = undefined;
  }

  private async setupCallTimeout(callId: string, chatId: string) {
    this.callTimeout = setTimeout(async () => {
      console.log(`Call timeout reached for call ID: ${callId}`);
      const call = await prisma.call.findUnique({ where: { id: callId } });
      if (call?.status !== CallStatus.Pending) return;
      const answerData: SocketAnswerCall = {
        userId: this.clientToken.sub!,
        userName: this.clientToken.name!,
        callId,
        chatId,
        answer: CallAnswerType.DID_NOT_ANSWER,
      };
      await this.deleteCall(callId);
      this.sendMessageToSelf(SocketEventType.ANSWERCALL, answerData);
    }, 60000);
  }

  private setupHeartbeat() {
    this.heartbeatInterval = setInterval(() => {
      if (this.client.readyState === WebSocket.OPEN) {
        this.client.ping();
        console.log(`Sent heartbeat ping to user: ${this.clientToken.name}`);
      }
    }, 30000);
    this.client.on("pong", () => {
      console.log(`Heartbeat received from user: ${this.clientToken.name}`);
    });
  }

  public close() {
    console.log(`Closing WebSocket for user: ${this.clientToken.name}`);
    this.client.close();
  }
}

export default ClientSocketServer;
