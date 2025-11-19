import { Appointment, AppointmentLog } from "@/app/generated/prisma";

export type ParsedAppointmentLog = AppointmentLog & {
  appointmentId: Appointment["id"];
  counselorName: string;
  studentName: string;
  startTime: Appointment["startTime"];
  endTime: Appointment["endTime"];
};

export type AppointmentLogsResult = {
  logs: ParsedAppointmentLog[];
  totalCount: number;
};
