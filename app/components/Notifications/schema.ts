import { AppointmentStatus } from "@/app/generated/prisma/browser";

export type AppointmentCreateNotification = {
  appointmentId: string;
};

export type AppointmentUpdateStatusNotification = {
  appointmentId: string;
  from: AppointmentStatus;
  to: AppointmentStatus;
};

export enum ReminderType {
  ONE_WEEK = "ONE_WEEK",
  ONE_DAY = "ONE_DAY",
  SIX_HOURS = "SIX_HOURS",
  ONE_HOUR = "ONE_HOUR",
}

export type AppointmentReminderNotification = {
  appointmentId: string;
  type: ReminderType;
};

export type AppointmentUpdateScheduleNotification = {
  appointmentId: string;
  from: Date;
  to: Date;
};

export type PostNotification = {
  postId: string;
};

export type AppointmentDidNotAttendNotification = {
  appointmentId: string;
  date: Date;
};
