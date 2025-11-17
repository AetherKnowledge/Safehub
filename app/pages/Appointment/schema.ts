import { BuiltFormData } from "@/app/components/Forms/EditableFormBuilder";
import { AppointmentStatus } from "@/app/generated/prisma";
import z from "zod";

export type AppointmentFormData = {
  questions: BuiltFormData;
  answers: Record<string, any>;
};

export const cancelAppointmentSchema = z.object({
  appointmentId: z.uuid(),
  reason: z.string().min(2, "Please provide a valid reason for cancellation."),
});

export const updateAppointmentStatusSchema = z.object({
  appointmentId: z.uuid(),
  status: z.enum(AppointmentStatus),
});
export type UpdateAppointmentStatusData = z.infer<
  typeof updateAppointmentStatusSchema
>;
