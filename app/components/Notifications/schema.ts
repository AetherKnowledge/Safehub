import { AppointmentStatus } from "@/app/generated/prisma";

export type AppointmentCreateNotification = {
  appointmentId: string;
};

export type AppointmentUpdateNotification = {
  appointmentId: string;
  from: AppointmentStatus;
  to: AppointmentStatus;
};

export type PostNotification = {
  postId: string;
};
