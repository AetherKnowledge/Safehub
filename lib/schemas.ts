import {
  CallStatus,
  SessionPreference,
  UserType,
} from "@/app/generated/prisma";
import { z } from "zod";

export const IMAGE_SCHEMA = z
  .instanceof(File)
  .refine(
    (file) =>
      ["image/png", "image/jpeg", "image/jpg", "image/gif"].includes(file.type),
    { message: "Invalid image file type" }
  );

export const newPostSchema = z.object({
  title: z.string().min(1, "Title is required").max(100, "Title is too long"),
  content: z.string().max(500, "Content is too long").optional(),
  images: z.array(IMAGE_SCHEMA).max(5).optional(),
});

export const updateUserSchema = z.object({
  id: z.string(),
  type: z.enum(UserType),
});
export type UpdateUserTypeData = z.infer<typeof updateUserSchema>;

export const commentSchema = z.object({
  postId: z.string(),
  content: z.string().min(2).max(500),
});
export type CommentData = z.infer<typeof commentSchema>;

export const newAppointmentSchema = z.object({
  // counselorId: z.string(),

  focus: z.string(),
  hadCounselingBefore: z.boolean(),
  sessionPreference: z.enum(SessionPreference),
  urgencyLevel: z.number().min(1).max(5),
  startTime: z.date(),
  endTime: z.date().optional(),
  notes: z.string().max(500).optional(),
});
export type NewAppointmentData = z.infer<typeof newAppointmentSchema>;

export const messageSchema = z.object({
  chatId: z.string().min(1, "Chat ID is required"),
  content: z.string().trim().min(1).max(1000), // Increased for encrypted content
});

export const registerSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.email("Invalid email address"),
  password: z.string(),
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
  answer: z.enum(CallStatus), // Using CallStatus enum for answer
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
