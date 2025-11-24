"use client";
import { formatTime } from "@/lib/utils";
import { useState } from "react";
import { AppointmentData } from "../AppointmentActions";
import { ViewModal } from "../AppointmentTable/ViewAppointmentButton";
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
  const clippedHeight = Math.max(0, Math.min(height, 100 - topPosition));

  const handleClose = async () => {
    setShowPopup(false);
  };

  return (
    <>
      <div
        className={`absolute left-1 right-1 rounded p-2 cursor-pointer min-h-0 overflow-y-auto ${getBgStatusColor(
          appointment.status
        )} bg-opacity-10 border-l-4 shadow-br hover:shadow-md transition-shadow ${getBorderStatusColor(
          appointment.status
        )}`}
        style={{
          top: `${topPosition}%`,
          height: `${clippedHeight}%`,
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
        <ViewModal appointment={appointment} onClose={handleClose} />
      )}
    </>
  );
};

export default AppointmentBox;
