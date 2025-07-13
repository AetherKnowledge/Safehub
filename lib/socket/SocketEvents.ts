import { CallStatus } from "@/app/generated/prisma";
import { types } from "mediasoup";
import { TransportOptions } from "mediasoup-client/lib/Transport";

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
  GET_ROUTER_CAPABILITIES = "getRouterRtpCapabilities",
  CREATE_TRANSPORT = "createWebRtcTransport",
  CONNECT_TRANSPORT = "connectTransport",
  PRODUCE = "produce",
  CONSUME = "consume",
}

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

export interface SocketGetRouterCapabilities {
  routerRtpCapabilities: string;
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
  appData?: Record<string, any>;
}
