"use client";
import { Appointment, AppointmentStatus } from "@/app/generated/prisma";
import React, { useEffect, useState } from "react";
import {
  getCounselorAppointments,
  updateAppointmentStatus,
} from "./AppointmentsActions";

// Type for appointment with related data
type AppointmentWithStudent = Appointment & {
  student: {
    user: {
      name: string | null;
      email: string;
    };
  };
};

interface WeeklyCalendarProps {
  appointments: AppointmentWithStudent[];
  setAppointments: React.Dispatch<
    React.SetStateAction<AppointmentWithStudent[]>
  >;
}

// Time slots from 8:00 AM to 12:00 PM (24-hour format)
const TIME_SLOTS = [
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

const DAYS = ["SUN", "MON", "TUES", "WED", "THURS", "FRI", "SAT"];

// Status color mapping
const getStatusColor = (status: AppointmentStatus) => {
  switch (status) {
    case "Approved":
      return "bg-blue-500";
    case "Pending":
      return "bg-yellow-500";
    case "Completed":
      return "bg-green-500";
    case "Rejected":
      return "bg-red-500";
    default:
      return "bg-gray-500";
  }
};

const getStatusTextColor = (status: AppointmentStatus) => {
  switch (status) {
    case "Approved":
      return "text-blue-600";
    case "Pending":
      return "text-yellow-600";
    case "Completed":
      return "text-green-600";
    case "Rejected":
      return "text-red-600";
    default:
      return "text-gray-600";
  }
};

const WeeklyCalendar: React.FC<WeeklyCalendarProps> = ({
  appointments,
  setAppointments,
}) => {
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [selectedAppointment, setSelectedAppointment] =
    useState<AppointmentWithStudent | null>(null);

  // Get the start of the week (Sunday)
  const getStartOfWeek = (date: Date) => {
    const start = new Date(date);
    const day = start.getDay();
    const diff = start.getDate() - day;
    return new Date(start.setDate(diff));
  };

  // Get dates for the current week
  const getWeekDates = () => {
    const startOfWeek = getStartOfWeek(currentWeek);
    return Array.from({ length: 7 }, (_, i) => {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      return date;
    });
  };

  // Navigate to previous/next week
  const navigateWeek = (direction: "prev" | "next") => {
    const newDate = new Date(currentWeek);
    newDate.setDate(currentWeek.getDate() + (direction === "next" ? 7 : -7));
    setCurrentWeek(newDate);
  };

  // Get appointments for a specific date
  const getAppointmentsForDate = (date: Date) => {
    return appointments.filter((appointment) => {
      const appointmentDate = new Date(appointment.startTime);
      return appointmentDate.toDateString() === date.toDateString();
    });
  };

  // Calculate the top position of an appointment based on its time
  const getAppointmentTopPosition = (appointmentTime: Date) => {
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
  const getAppointmentHeight = (appointment: AppointmentWithStudent) => {
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

  // Format date range for header
  const getDateRangeString = () => {
    const weekDates = getWeekDates();
    const start = weekDates[0];
    const end = weekDates[6];

    return `${start.toLocaleDateString("en-US", {
      month: "long",
    })} ${start.getDate()}-${end.getDate()}, ${end.getFullYear()}`;
  };

  // Handle appointment action (Mark as done, Cancel)
  const handleAppointmentAction = async (
    appointment: AppointmentWithStudent,
    action: "complete" | "cancel"
  ) => {
    try {
      const newStatus = action === "complete" ? "Completed" : "Rejected";
      await updateAppointmentStatus(
        appointment.id,
        newStatus as AppointmentStatus
      );

      // Update local state
      setAppointments((prev: AppointmentWithStudent[]) =>
        prev.map((apt: AppointmentWithStudent) =>
          apt.id === appointment.id
            ? { ...apt, status: newStatus as AppointmentStatus }
            : apt
        )
      );

      setSelectedAppointment(null);
    } catch (error) {
      console.error("Error updating appointment:", error);
      // You could show an error toast here
    }
  };

  const weekDates = getWeekDates();
  const todayAppointments = appointments.filter(
    (apt) =>
      new Date(apt.startTime).toDateString() === new Date().toDateString()
  );

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="flex bg-white rounded-lg shadow">
            <button className="px-4 py-2 bg-white rounded-l-lg border-r">
              📋 List
            </button>
            <button className="px-4 py-2 bg-blue-500 text-white rounded-r-lg">
              📅 Calendar
            </button>
          </div>
          <div className="text-lg font-semibold">
            {todayAppointments.length} Appointments Today
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center bg-white rounded-lg shadow">
            <button
              onClick={() => navigateWeek("prev")}
              className="px-3 py-2 hover:bg-gray-100 rounded-l-lg"
            >
              ←
            </button>
            <span className="px-4 py-2 text-sm">{getDateRangeString()}</span>
            <button
              onClick={() => navigateWeek("next")}
              className="px-3 py-2 hover:bg-gray-100 rounded-r-lg"
            >
              →
            </button>
          </div>
          <button className="px-4 py-2 bg-white rounded-lg shadow">
            🔽 Filter
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {/* Time zone indicator */}
        <div className="px-4 py-2 bg-gray-100 text-sm text-gray-600">
          UTC +8
        </div>

        {/* Calendar Header */}
        <div className="flex border-b">
          <div className="w-20 flex-shrink-0 p-3"></div>{" "}
          {/* Empty cell for time column - matches body */}
          <div className="flex-1 flex">
            {DAYS.map((day, index) => {
              const date = weekDates[index];
              const isToday = date.toDateString() === new Date().toDateString();

              return (
                <div
                  key={day}
                  className={`flex-1 p-3 text-center border-l ${
                    isToday ? "bg-green-50" : ""
                  }`}
                >
                  <div className="font-medium text-sm">{day}</div>
                  <div
                    className={`text-lg font-bold ${
                      isToday ? "text-green-600" : ""
                    }`}
                  >
                    {date.getDate()}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Calendar Body */}
        <div className="flex">
          {/* Time column */}
          <div className="w-20 flex-shrink-0">
            {TIME_SLOTS.map((timeSlot, timeIndex) => (
              <div
                key={timeSlot}
                className="h-[120px] p-3 text-sm text-gray-600 border-b flex items-start"
              >
                {timeSlot}
              </div>
            ))}
          </div>

          {/* Days container */}
          <div className="flex-1 flex">
            {weekDates.map((date, dayIndex) => {
              const dayAppointments = getAppointmentsForDate(date);
              const isToday = date.toDateString() === new Date().toDateString();

              return (
                <div
                  key={dayIndex}
                  className={`flex-1 relative border-l ${
                    isToday ? "bg-green-50" : ""
                  }`}
                  style={{ height: `${TIME_SLOTS.length * 120}px` }}
                >
                  {/* Hour lines */}
                  {TIME_SLOTS.map((_, timeIndex) => (
                    <div
                      key={timeIndex}
                      className="absolute w-full border-b border-gray-200"
                      style={{ top: `${timeIndex * 120}px`, height: "120px" }}
                    >
                      {/* Half-hour line */}
                      <div
                        className="absolute w-full border-b border-gray-100"
                        style={{ top: "60px" }}
                      />
                    </div>
                  ))}

                  {/* Appointments */}
                  {dayAppointments.map((appointment, appointmentIndex) => {
                    const appointmentDate = new Date(appointment.startTime);
                    const topPosition =
                      getAppointmentTopPosition(appointmentDate);
                    const height = getAppointmentHeight(appointment);

                    return (
                      <div
                        key={appointment.id}
                        className={`absolute left-1 right-1 rounded p-2 cursor-pointer ${getStatusColor(
                          appointment.status
                        )} bg-opacity-10 border-l-4 ${getStatusColor(
                          appointment.status
                        )} shadow-sm hover:shadow-md transition-shadow`}
                        style={{
                          top: `${topPosition}px`,
                          height: `${height}px`,
                        }}
                        onClick={() => setSelectedAppointment(appointment)}
                      >
                        <div
                          className={`text-xs font-medium ${getStatusTextColor(
                            appointment.status
                          )}`}
                        >
                          {appointment.status}
                        </div>
                        <div className="text-xs font-bold text-gray-800 truncate">
                          {appointment.student.user.name ||
                            appointment.student.user.email}
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Appointment Detail Modal */}
      {selectedAppointment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex justify-between items-start mb-4">
              <div>
                <div
                  className={`inline-block px-2 py-1 rounded text-xs font-medium ${getStatusColor(
                    selectedAppointment.status
                  )} bg-opacity-20 ${getStatusTextColor(
                    selectedAppointment.status
                  )}`}
                >
                  {selectedAppointment.status}
                </div>
                <h3 className="text-lg font-bold mt-2">
                  {selectedAppointment.student.user.name ||
                    selectedAppointment.student.user.email}
                </h3>
                <p className="text-sm text-gray-600">
                  {selectedAppointment.focus} -{" "}
                  {selectedAppointment.sessionPreference}
                </p>
                <p className="text-sm text-gray-500">
                  {new Date(selectedAppointment.startTime).toLocaleString()}
                  {selectedAppointment.endTime && (
                    <span>
                      {" "}
                      -{" "}
                      {new Date(selectedAppointment.endTime).toLocaleTimeString(
                        "en-US",
                        {
                          hour: "numeric",
                          minute: "2-digit",
                          hour12: true,
                        }
                      )}
                    </span>
                  )}
                </p>
              </div>
            </div>

            {selectedAppointment.notes && (
              <div className="mb-4">
                <h4 className="font-medium text-sm mb-1">Notes:</h4>
                <p className="text-sm text-gray-600">
                  {selectedAppointment.notes}
                </p>
              </div>
            )}

            <div className="flex gap-2">
              {selectedAppointment.status === "Approved" && (
                <button
                  onClick={() =>
                    handleAppointmentAction(selectedAppointment, "complete")
                  }
                  className="px-4 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                >
                  Mark as done
                </button>
              )}
              <button
                onClick={() =>
                  handleAppointmentAction(selectedAppointment, "cancel")
                }
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded text-sm hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={() => setSelectedAppointment(null)}
                className="px-4 py-2 bg-gray-500 text-white rounded text-sm hover:bg-gray-600 ml-auto"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Main component that fetches appointments
const AppointmentsPage = () => {
  const [appointments, setAppointments] = useState<AppointmentWithStudent[]>(
    []
  );
  const [loading, setLoading] = useState(true);

  // Fetch appointments from database
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const data = await getCounselorAppointments();
        setAppointments(data);
      } catch (error) {
        console.error("Error fetching appointments:", error);
        // You could show an error toast here
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading...
      </div>
    );
  }

  return (
    <WeeklyCalendar
      appointments={appointments}
      setAppointments={setAppointments}
    />
  );
};

export default AppointmentsPage;
