import { AppointmentStatus } from "@/app/generated/prisma";
import { AppointmentData } from "../AppointmentTable/AppointmentsActions";

// Time slots from 8:00 AM to 12:00 PM (24-hour format)
export const TIME_SLOTS = [
  "8:00 A.M.",
  "8:30 A.M.",
  "9:00 A.M.",
  "9:30 A.M.",
  "10:00 A.M.",
  "10:30 A.M.",
  "11:00 A.M.",
  "11:30 A.M.",
  "12:00 N.N.",
];

// Status color mapping
export const getBgStatusColor = (status: AppointmentStatus) => {
  switch (status) {
    case "Approved":
      return "bg-info/20";
    case "Pending":
      return "bg-warning/20";
    case "Completed":
      return "bg-success/20";
    case "Rejected":
      return "bg-error/20";
    default:
      return "bg-base-content/20";
  }
};

export const getStatusTextColor = (status: AppointmentStatus) => {
  switch (status) {
    case "Approved":
      return "text-info";
    case "Pending":
      return "text-warning";
    case "Completed":
      return "text-success";
    case "Rejected":
      return "text-error";
    default:
      return "text-base-content";
  }
};

export const getBorderStatusColor = (status: AppointmentStatus) => {
  switch (status) {
    case "Approved":
      return "border-l-info";
    case "Pending":
      return "border-l-warning";
    case "Completed":
      return "border-l-success";
    case "Rejected":
      return "border-l-error";
    default:
      return "border-l-base-content";
  }
};

export const DAYS = ["SUN", "MON", "TUES", "WED", "THURS", "FRI", "SAT"];

// Get the start of the week (Sunday)
export const getStartOfWeek = (date: Date) => {
  const start = new Date(date);
  const day = start.getDay();
  const diff = start.getDate() - day;
  return new Date(start.setDate(diff));
};

// Get dates for the current week
export const getWeekDates = (date: Date) => {
  const startOfWeek = getStartOfWeek(date);
  return Array.from({ length: 7 }, (_, i) => {
    const date = new Date(startOfWeek);
    date.setDate(startOfWeek.getDate() + i);
    return date;
  });
};

// Calculate the top position of an appointment based on its time
export const getAppointmentTopPosition = (appointmentTime: Date) => {
  const hour = appointmentTime.getHours();
  const minute = appointmentTime.getMinutes();

  // Calendar starts at 8 AM, each hour slot is 120px (60px for the main slot + 60px for half-hour)
  const baseHour = 8;
  const hourSlotHeight = 120; // Total height for one hour (includes 30-min intervals)

  if (hour < baseHour || hour > 12) {
    return 0; // Outside our time range
  }

  const hoursFromStart = hour - baseHour;
  const minuteOffset = (minute / 60) * hourSlotHeight;

  return hoursFromStart * hourSlotHeight + minuteOffset;
};

// Calculate the height of an appointment based on duration
export const getAppointmentHeight = (appointment: AppointmentData) => {
  if (appointment.endTime) {
    const startTime = new Date(appointment.startTime);
    const endTime = new Date(appointment.endTime);
    const durationMinutes =
      (endTime.getTime() - startTime.getTime()) / (1000 * 60);
    // Convert minutes to pixels (120px per hour)
    return Math.max((durationMinutes / 60) * 120, 30); // Minimum 30px height
  }
  // Default to 45 minutes if endTime not specified
  return 54; // 45 minutes = 54px (45/60 * 120px * 0.6 to not overlap)
};
