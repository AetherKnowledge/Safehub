export enum SocketEventType {
  MESSAGE = "message",
  CALL = "call",
  ERROR = "error",
  JOINCHAT = "joinChat",
  LEAVECHAT = "leaveChat",
  TYPING = "typing",
}

export interface SocketEvent<T = any> {
  type: SocketEventType;
  payload: T;
}

export interface SocketMessage {
  content: any;
  chatId: string;
}

export interface SocketError {
  message: string;
  code?: number;
}

export interface SocketCall {
  callId: string;
  callerId: string;
  receiverId: string;
  status: "pending" | "accepted" | "rejected" | "ended";
}

export interface SocketJoinChat {
  chatId: string;
}
