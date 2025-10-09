"use client";
import { AppointmentStatus } from "@/app/generated/prisma";
import { formatTime } from "@/lib/utils";
import { useState } from "react";
import {
  AppointmentData,
  updateAppointmentStatus,
} from "../AppointmentTable/AppointmentsActions";
import AppointmentPopup, { AppointmentPopupAction } from "./AppointmentPopup";
import {
  getAppointmentHeight,
  getAppointmentTopPosition,
  getBgStatusColor,
  getBorderStatusColor,
  getStatusTextColor,
} from "./WeeklyCalendarUtils";

export interface AppointmentBoxProps {
  appointment: AppointmentData;
  onUpdate?: (appointment: AppointmentData) => void;
}

const AppointmentBox = ({ appointment, onUpdate }: AppointmentBoxProps) => {
  const [showPopup, setShowPopup] = useState(false);
  const appointmentDate = new Date(appointment.startTime);
  const topPosition = getAppointmentTopPosition(appointmentDate);
  const height = getAppointmentHeight(appointment);

  // Handle appointment action (Mark as done, Cancel)
  const handleAppointmentAction = async (
    appointment: AppointmentData,
    action: AppointmentPopupAction
  ) => {
    if (action === AppointmentPopupAction.CLOSE) {
      setShowPopup(false);
      return;
    }

    try {
      const newStatus =
        action === AppointmentPopupAction.COMPLETE ? "Completed" : "Rejected";
      await updateAppointmentStatus(
        appointment.id,
        newStatus as AppointmentStatus
      );

      // Update local state
      onUpdate?.({ ...appointment, status: newStatus });

      setShowPopup(false);
    } catch (error) {
      console.error("Error updating appointment:", error);
      // You could show an error toast here
    }
  };

  return (
    <>
      <div
        key={`appointment-${appointment.id}`}
        className={`absolute left-1 right-1 rounded p-2 cursor-pointer ${getBgStatusColor(
          appointment.status
        )} bg-opacity-10 border-l-4 shadow-br hover:shadow-md transition-shadow ${getBorderStatusColor(
          appointment.status
        )}`}
        style={{
          top: `${topPosition}px`,
          height: `${height}px`,
        }}
        onClick={() => setShowPopup(true)}
      >
        <div
          className={`text-xs font-medium ${getStatusTextColor(
            appointment.status
          )}`}
        >
          {appointment.status}
        </div>
        <div className="text-xs truncate">
          {appointment.student.user.name || appointment.student.user.email}
        </div>
        <div className="text-[10px] truncate pb-">
          {formatTime(appointment.startTime)} -{" "}
          {formatTime(appointment.endTime!)}
        </div>
      </div>

      {/* Appointment Detail Modal */}
      {showPopup && (
        <AppointmentPopup
          key={`appointment-modal-${appointment.id}`}
          appointment={appointment}
          onAction={handleAppointmentAction}
        />
      )}
    </>
  );
};

export default AppointmentBox;
