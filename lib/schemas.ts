import { CallStatus, UserType } from "@/app/generated/prisma";
import { CallAnswerType } from "@/lib/socket/SocketEvents";
import { z } from "zod";

export const messageSchema = z.object({
  chatId: z.string().min(1, "Chat ID is required"),
  content: z.string().trim().min(1).max(1000), // Increased for encrypted content
});

export const registerSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.email("Invalid email address"),
  password: z.string(),
});

export const updateUserSchema = z.object({
  id: z.string(),
  type: z.enum(UserType),
});

export const newAppointmentSchema = z.object({
  counselorId: z.string(),
  schedule: z.string(),
  concerns: z.array(z.string()),
});

export const deleteAppointmentSchema = z.object({
  appointmentId: z.number(),
});

export const joinChatSchema = z.object({
  chatId: z.string().min(1, "Chat ID is required"),
});

export const initiateCallSchema = z.object({
  callId: z.string().min(1, "Call ID is required"),
  chatId: z.string().min(1, "Chat ID is required"),
  callerId: z.string().min(1, "Caller ID is required"),
  callerName: z.string().optional(),
  callerImage: z.string().optional(),
  status: z.enum(CallStatus),
});

export const answerCallSchema = z.object({
  callId: z.string().min(1, "Call ID is required"),
  chatId: z.string().min(1, "Chat ID is required"),
  answer: z.enum(CallAnswerType), // Using CallAnswerType enum for answer
});

export const leaveCallSchema = z.object({
  callId: z.string().min(1, "Call ID is required"),
  chatId: z.string().min(1, "Chat ID is required"),
});

export const sdpSchema = z.object({
  from: z.string().optional(),
  to: z.string().min(1, "To user ID is required"),
  callId: z.string().min(1, "Call ID is required"),
  chatId: z.string().min(1, "Chat ID is required"),
  sdpData: z.string().min(1, "SDP offer is required"),
});

// Zod schemas for each SignalData variant
const TransceiverRequestSchema = z.object({
  type: z.literal("transceiverRequest"),
  transceiverRequest: z.object({
    kind: z.string(),
    init: z
      .object({
        direction: z.string().optional(),
        sendEncodings: z.array(z.any()).optional(), // You can refine this
        streams: z.array(z.any()).optional(), // You can refine this too
      })
      .optional(),
  }),
});

const RenegotiateSchema = z.object({
  type: z.literal("renegotiate"),
  renegotiate: z.literal(true),
});

const CandidateSchema = z.object({
  type: z.literal("candidate"),
  candidate: z.object({
    candidate: z.string(),
    sdpMid: z.string().nullable(),
    sdpMLineIndex: z.number().nullable(),
    usernameFragment: z.string().optional(),
  }),
});

const RTCSessionDescriptionSchema = z.object({
  type: z.union([
    z.literal("offer"),
    z.literal("answer"),
    z.literal("pranswer"),
    z.literal("rollback"),
  ]),
  sdp: z.string().optional(),
});

// Union schema for all possible SignalData variants
const SignalDataSchema = z.union([
  TransceiverRequestSchema,
  RenegotiateSchema,
  CandidateSchema,
  RTCSessionDescriptionSchema,
]);
