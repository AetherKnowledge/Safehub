import { CallStatus } from "@/app/generated/prisma";

export enum CallAnswerType {
  ACCEPT = "accept",
  REJECT = "reject",
  DID_NOT_ANSWER = "didNotAnswer",
}

export enum SocketEventType {
  MESSAGE = "message",
  INITIATECALL = "initiateCall",
  ANSWERCALL = "answerCall",
  LEAVECALL = "leaveCall",
  CALLENDED = "callEnded",
  ERROR = "error",
  JOINCHAT = "joinChat",
  LEAVECHAT = "leaveChat",
  TYPING = "typing",
  SDP = "sdp",
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

export interface SocketInitiateCall {
  callId: string;
  callerId: string;
  callerName?: string;
  callerImage?: string;
  chatId: string;
  status: CallStatus;
}

export interface SocketAnswerCall {
  userId: string;
  userName: string;
  callId: string;
  chatId: string;
  answer: CallAnswerType;
}

export interface SocketLeaveCall {
  userId?: string;
  userName?: string;
  callId: string;
  chatId: string;
}

export interface SocketJoinChat {
  userName?: string;
  chatId: string;
}

export interface SocketCallEnded {
  callId: string;
  chatId: string;
}

export interface SocketSdp {
  from: string;
  to: string;
  callId: string;
  chatId: string;
  sdpData: string;
}

export interface SocketTyping {
  chatId: string;
  userId: string;
  userName?: string;
}
