import { AppointmentStatus } from "@/app/generated/prisma";
import { AppointmentData } from "../AppointmentActions";

// Calendar configuration: 8:00 AM to 5:00 PM
export const START_HOUR = 8; // 8 AM
export const END_HOUR = 17; // 5 PM (24-hour format)
export const TOTAL_MINUTES = (END_HOUR - START_HOUR) * 60; // 540 minutes

// Generate 30-minute time slots from 8:00 AM to 5:00 PM (inclusive)
export const TIME_SLOTS = (() => {
  const labels: string[] = [];
  for (let m = 0; m <= TOTAL_MINUTES; m += 30) {
    const totalMinutes = START_HOUR * 60 + m;
    const hours24 = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    let period = "A.M.";
    let hour12 = hours24;
    if (hours24 === 0) {
      hour12 = 12;
      period = "A.M.";
    } else if (hours24 === 12) {
      hour12 = 12;
      period = minutes === 0 ? "N.N." : "P.M."; // 12:00 N.N. special label
    } else if (hours24 > 12) {
      hour12 = hours24 - 12;
      period = "P.M.";
    }

    const minuteStr = minutes.toString().padStart(2, "0");
    const label = `${hour12}:${minuteStr} ${period}`;
    labels.push(label);
  }
  return labels;
})();

// Status color mapping
export const getBgStatusColor = (status: AppointmentStatus) => {
  switch (status) {
    case AppointmentStatus.Completed:
      return "bg-info/20";
    case AppointmentStatus.Pending:
      return "bg-warning/20";
    case AppointmentStatus.Approved:
      return "bg-success/20";
    case AppointmentStatus.Cancelled:
    case AppointmentStatus.DidNotAttend:
      return "bg-error/20";
    default:
      return "bg-base-content/20";
  }
};

export const getStatusTextColor = (status: AppointmentStatus) => {
  switch (status) {
    case AppointmentStatus.Completed:
      return "text-info";
    case AppointmentStatus.Pending:
      return "text-warning";
    case AppointmentStatus.Approved:
      return "text-success";
    case AppointmentStatus.Cancelled:
    case AppointmentStatus.DidNotAttend:
      return "text-error";
    default:
      return "text-base-content";
  }
};

export const getBorderStatusColor = (status: AppointmentStatus) => {
  switch (status) {
    case AppointmentStatus.Completed:
      return "border-l-info";
    case AppointmentStatus.Pending:
      return "border-l-warning";
    case AppointmentStatus.Approved:
      return "border-l-success";
    case AppointmentStatus.Cancelled:
    case AppointmentStatus.DidNotAttend:
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
  // Returns percentage from top (0-100)
  const hours = appointmentTime.getHours();
  const minutes = appointmentTime.getMinutes();
  const minutesFromStart = hours * 60 + minutes - START_HOUR * 60;
  const clampedTotal = Math.min(Math.max(minutesFromStart, 0), TOTAL_MINUTES);
  return (clampedTotal / TOTAL_MINUTES) * 100;
};

// Calculate the height of an appointment based on duration
export const getAppointmentHeight = (appointment: AppointmentData) => {
  // Returns percentage height of the day column (0-100)
  const MIN_PERCENT = 4; // Ensure small appointments are clickable
  if (appointment.endTime) {
    const startTime = new Date(appointment.startTime);
    const endTime = new Date(appointment.endTime);
    const durationMinutes =
      (endTime.getTime() - startTime.getTime()) / (1000 * 60);
    return Math.max((durationMinutes / TOTAL_MINUTES) * 100, MIN_PERCENT);
  }
  // Default to 45 minutes if endTime not specified
  return Math.max((45 / TOTAL_MINUTES) * 100, MIN_PERCENT);
};
