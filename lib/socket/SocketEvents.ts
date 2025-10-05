import { CallStatus, User } from "@/app/generated/prisma";
import { types } from "mediasoup";
import { TransportOptions } from "mediasoup-client/types";

export type SocketUser = Pick<User, "id" | "name" | "image" | "type" | "email">;

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
  GET_ROUTER_CAPABILITIES = "getRouterRtpCapabilities",
  CREATE_TRANSPORT = "createWebRtcTransport",
  CONNECT_TRANSPORT = "connectTransport",
  PRODUCE = "produce",
  CONSUME = "consume",
}

export enum SocketErrorCallType {
  NO_ANSWER = "noAnswer",
  CONFLICT = "conflict",
}

export enum SocketErrorRequestType {
  INVALID_DATA = "invalidData",
  TIMEOUT = "timeout",
  NOT_FOUND = "notFound",
  UNAUTHORIZED = "unauthorized",
  FORBIDDEN = "forbidden",
  RATE_LIMIT_EXCEEDED = "rateLimitExceeded",
  INTERNAL_SERVER_ERROR = "internalServerError",
}

export type SocketErrorType = SocketErrorCallType | SocketErrorRequestType;

export interface SocketEvent<
  T =
    | SocketMessage
    | SocketInitiateCall
    | SocketAnswerCall
    | SocketLeaveCall
    | SocketJoinChat
    | SocketCallEnded
    | SocketSdp
    | SocketTyping
    | SocketError,
> {
  type: SocketEventType;
  payload: T;
}

export interface SocketMessage {
  content: string | ImageData;
  chatId: string;
}

export interface SocketError {
  message: string;
  errorType: SocketErrorType;
}

export type Recipient = Pick<User, "id" | "name" | "image">;

export interface SocketInitiateCall {
  callId: string;
  callerId: string;
  callerName?: string;
  callerImage?: string;
  recipients?: Recipient[];
  chatId: string;
  chatName?: string;
  status: CallStatus;
}

export interface SocketAnswerCall {
  userId: string;
  userName: string;
  callId: string;
  chatId: string;
  answer: CallStatus;
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

export interface SocketGetRouterCapabilities {
  routerRtpCapabilities: types.RtpCapabilities;
}

export interface SocketCreateTransport {
  transportOptions: TransportOptions;
}

export interface SocketConnectTransport {
  transportId: string;
  dtlsParameters: types.DtlsParameters;
}

export interface SocketProduce {
  transportId: string;
  kind: "audio" | "video";
  rtpParameters: types.RtpParameters;
}

export interface SocketConsume {
  producerId: string;
  rtpCapabilities: types.RtpCapabilities;
  paused?: boolean;
}
