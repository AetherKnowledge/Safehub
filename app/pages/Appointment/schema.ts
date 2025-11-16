import { BuiltFormData } from "@/app/components/Forms/EditableFormBuilder";
import { SessionPreference } from "@/app/generated/prisma";
import z from "zod";

// export const newAppointmentSchema = z.object({
//   // counselorId: z.string(),

//   focus: z.string(),
//   hadCounselingBefore: z.boolean(),
//   sessionPreference: z.enum(SessionPreference),
//   urgencyLevel: z.number().min(1).max(5),
//   startTime: z.date(),
//   notes: z.string().max(500).optional(),
// });
// export type NewAppointmentData = z.infer<typeof newAppointmentSchema>;

// export const updateAppointmentSchema = z.object({
//   focus: z.string().optional(),
//   hadCounselingBefore: z.boolean().optional(),
//   sessionPreference: z.enum(SessionPreference).optional(),
//   urgencyLevel: z.number().min(1).max(5).optional(),
//   startTime: z.date().optional(),
//   notes: z.string().max(500).optional(),
//   endTime: z.date().optional(),
// });
// export type UpdateAppointmentData = z.infer<typeof updateAppointmentSchema>;

export type AppointmentFormData = {
  questions: BuiltFormData;
  answers: Record<string, any>;
};

export const newAppointmentSchema = z.object({
  // counselorId: z.string(),

  focus: z.string(),
  hadCounselingBefore: z.string(),
  sessionPreference: z.enum(SessionPreference),
  urgencyLevel: z
    .string()
    .transform((val) => Number(val))
    .pipe(z.number().min(1).max(5)),
  startTime: z.preprocess((arg) => {
    if (typeof arg === "string" || arg instanceof Date)
      return new Date(arg as any);
    return undefined;
  }, z.date()),
  notes: z.string().max(500).optional(),
});
export type NewAppointmentData = z.infer<typeof newAppointmentSchema>;

export const updateAppointmentSchema = z.object({
  focus: z.string().optional(),
  hadCounselingBefore: z.string().optional(),
  sessionPreference: z.enum(SessionPreference).optional(),
  urgencyLevel: z
    .string()
    .transform((val) => Number(val))
    .pipe(z.number().min(1).max(5))
    .optional(),
  startTime: z
    .preprocess((arg) => {
      if (typeof arg === "string" || arg instanceof Date)
        return new Date(arg as any);
      return undefined;
    }, z.date())
    .optional(),
  notes: z.string().max(500).optional(),
  endTime: z
    .preprocess((arg) => {
      if (typeof arg === "string" || arg instanceof Date)
        return new Date(arg as any);
      return undefined;
    }, z.date())
    .optional(),
});
export type UpdateAppointmentData = z.infer<typeof updateAppointmentSchema>;
