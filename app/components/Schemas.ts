import { CallStatus, UserType } from "@/app/generated/prisma";
import { z } from "zod";
import { CallAnswerType } from "./Socket/SocketEvents";

export const messageSchema = z.object({
  chatId: z.string().min(1, "Chat ID is required"),
  content: z.string().trim().min(1).max(1000), // Increased for encrypted content
});

export const registerSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string(),
});

export const updateUserSchema = z.object({
  id: z.string(),
  type: z.nativeEnum(UserType),
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
  receiverId: z.string().min(1, "Receiver ID is required"),
  callerId: z.string().min(1, "Caller ID is required"),
  callerName: z.string().optional(),
  callerImage: z.string().optional(),
  status: z.nativeEnum(CallStatus),
});

export const answerCallSchema = z.object({
  callId: z.string().min(1, "Call ID is required"),
  chatId: z.string().min(1, "Chat ID is required"),
  answer: z.nativeEnum(CallAnswerType), // Using CallAnswerType enum for answer
});

export const leaveCallSchema = z.object({
  callId: z.string().min(1, "Call ID is required"),
  chatId: z.string().min(1, "Chat ID is required"),
});
