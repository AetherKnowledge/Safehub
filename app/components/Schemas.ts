import { z } from "zod";
import { UserType } from "@/app/generated/prisma";

export const messageSchema = z.object({
  content: z.string().trim().min(1).max(255),
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
