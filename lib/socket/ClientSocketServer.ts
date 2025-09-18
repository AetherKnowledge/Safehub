import { CallStatus } from "@/app/generated/prisma";
import { isUserOnline, setUserOnline } from "@/lib/redis";
import { prisma } from "@/prisma/client";
import { User } from "next-auth";
import { WebSocket, WebSocketServer } from "ws";
import {
  deleteCall,
  receiveAnswerCall,
  receiveInitiateCall,
  receiveLeaveCall,
  receiveSdpData,
} from "./handlers/calling";
import { joinChat, leaveChat } from "./handlers/chat";
import {
  receiveMessage,
  sendErrorResponseToSelf,
  sendMessageToSelf,
} from "./handlers/messaging";
import {
  SocketAnswerCall,
  SocketErrorRequestType,
  SocketEvent,
  SocketEventType,
  SocketInitiateCall,
  SocketJoinChat,
  SocketLeaveCall,
  SocketMessage,
  SocketSdp,
} from "./SocketEvents";

//TODO: when user connects, check if they have an active call

class ClientSocketServer {
  public clientSocket: WebSocket;
  public socketUser: User;
  public server: WebSocketServer;
  private lastMessageTime: number = 0;
  private messageCount: number = 0;
  private readonly MESSAGE_RATE_LIMIT = 100; // messages per minute
  private readonly MESSAGE_RATE_WINDOW = 60000; // 1 minute in ms
  private heartbeatInterval?: NodeJS.Timeout;
  private callTimeout?: NodeJS.Timeout;

  constructor(client: WebSocket, server: WebSocketServer, socketUser: User) {
    this.clientSocket = client;
    this.server = server;
    this.socketUser = socketUser;
    this.clientSocket.userId = socketUser.id;
    this.clientSocket.socketId = crypto.randomUUID(); // Assign a unique socket ID
    setUserOnline(this.clientSocket.userId);

    console.log(this.socketUser.id);

    this.clientSocket.on("open", () => {
      console.log(
        `WebSocket connection established for user: ${this.socketUser.name}`
      );
    });

    this.clientSocket.on("message", (data: JSON) => {
      try {
        const event = JSON.parse(data.toString()) as SocketEvent;
        this.handlePayload(event);
      } catch (error) {
        console.error("Error parsing message:", error);
        this.clientSocket.send(
          JSON.stringify({
            type: SocketEventType.ERROR,
            payload: "Invalid data format",
          })
        );
      }
    });

    this.clientSocket.on("error", (error: Error) => {
      console.error("WebSocket error:", error);
      sendErrorResponseToSelf(
        this,
        `WebSocket error: ${error.message}`,
        SocketErrorRequestType.INTERNAL_SERVER_ERROR
      );
    });

    this.clientSocket.on("close", (code, reason) => {
      console.log(
        `WebSocket connection closed for user: ${this.socketUser.name}, code: ${code}, reason: ${reason}`
      );
      this.cleanup();
    });

    // Set up heartbeat
    this.setupHeartbeat();
  }

  private handlePayload(event: SocketEvent) {
    switch (event.type) {
      case SocketEventType.MESSAGE:
        console.log("Message received from client:" + this.socketUser.name);
        receiveMessage(this, event.payload as SocketMessage);
        break;
      case SocketEventType.INITIATECALL:
        console.log("Call event received from client:" + this.socketUser.name);
        receiveInitiateCall(this, event.payload as SocketInitiateCall);
        break;
      case SocketEventType.ANSWERCALL:
        console.log(
          "Answer call event received from client:" + this.socketUser.name
        );
        receiveAnswerCall(this, event.payload as SocketAnswerCall);
        break;
      case SocketEventType.LEAVECALL:
        console.log(
          "Leave call event received from client:" + this.socketUser.name
        );
        receiveLeaveCall(this, event.payload as SocketLeaveCall);
        break;
      case SocketEventType.ERROR:
        console.error(
          "Error event received from client:" + this.socketUser.name + ":",
          event.payload
        );
        break;
      case SocketEventType.JOINCHAT:
        console.log(
          "Join chat event received from client:" + this.socketUser.name
        );
        joinChat(this, event.payload as SocketJoinChat);
        break;
      case SocketEventType.LEAVECHAT:
        console.log(
          "Leave chat event received from client:" + this.socketUser.name
        );
        leaveChat(this);
        break;
      case SocketEventType.SDP:
        console.log("SDP event received from client:" + this.socketUser.name);
        receiveSdpData(this, event.payload as SocketSdp);
        break;
      case SocketEventType.TYPING:
        console.log(
          "Typing event received from client:" + this.socketUser.name
        );
        // Handle typing event logic here
        break;
      default:
        console.warn("Unknown event type:", event.type, "payload:", event);
    }
  }

  public isRateLimited(): boolean {
    const now = Date.now();
    if (now - this.lastMessageTime > this.MESSAGE_RATE_WINDOW) {
      this.messageCount = 0;
      this.lastMessageTime = now;
    }
    this.messageCount++;
    if (this.messageCount > this.MESSAGE_RATE_LIMIT) {
      console.warn(`Rate limit exceeded for user: ${this.socketUser.name}`);
      return true;
    }
    return false;
  }

  private async cleanup() {
    console.log(`Cleaning up resources for user: ${this.socketUser.name}`);

    this.clientSocket.chatId = undefined;
    this.clientSocket.userId = undefined;
    this.clearCallTimeout();
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = undefined;
    }
    if (this.clientSocket.callId && this.clientSocket.chatId) {
      await deleteCall(this, this.clientSocket.callId);
    }

    console.log(`Cleaned up resources for user: ${this.socketUser.name}`);
  }

  public clearCallTimeout() {
    if (this.callTimeout) {
      clearTimeout(this.callTimeout);
      this.callTimeout = undefined;
      console.log("Call timeout cleared");
    }
  }

  public async setupCallTimeout(callId: string, chatId: string) {
    this.callTimeout = setTimeout(async () => {
      console.log(`Call timeout reached for call ID: ${callId}`);
      const call = await prisma.call.findUnique({ where: { id: callId } });
      if (call?.status !== CallStatus.Pending) return;
      const answerData: SocketAnswerCall = {
        userId: this.socketUser.id!,
        userName: this.socketUser.name!,
        callId,
        chatId,
        answer: CallStatus.No_Answer,
      };
      await deleteCall(this, callId);
      sendMessageToSelf(this, SocketEventType.ANSWERCALL, answerData);
    }, 60000);
  }

  private setupHeartbeat() {
    this.heartbeatInterval = setInterval(() => {
      if (this.clientSocket.readyState === WebSocket.OPEN) {
        this.clientSocket.ping();
        console.log(`Sent heartbeat ping to user: ${this.socketUser.name}`);
      }
    }, 30000);
    this.clientSocket.on("pong", async () => {
      console.log(`Heartbeat received from user: ${this.socketUser.name}`);
      await setUserOnline(this.clientSocket.userId);
    });
  }

  private static async isUserOnline(userId: string): Promise<boolean> {
    return await isUserOnline(userId);
  }

  private close() {
    console.log(`Closing WebSocket for user: ${this.socketUser.name}`);
    this.clientSocket.close();
  }
}

export default ClientSocketServer;
