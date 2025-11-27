"use client";
import { formatTime } from "@/lib/utils";
import { useState } from "react";
import { AppointmentData } from "../AppointmentActions";
import ViewModal from "../Modals/ViewModal";
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
        className={`absolute left-1 right-1 rounded-lg p-1.5 cursor-pointer min-h-0 overflow-hidden hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 ${getBgStatusColor(
          appointment.status
        )} bg-opacity-10 border-l-4 shadow-md hover:shadow-lg ${getBorderStatusColor(
          appointment.status
        )}`}
        style={{
          top: `${topPosition}%`,
          height: `${clippedHeight}%`,
        }}
        onClick={() => setShowPopup(true)}
      >
        <div
          className={`text-[9px] font-bold uppercase tracking-wide mb-0.5 ${getStatusTextColor(
            appointment.status
          )}`}
        >
          {appointment.status}
        </div>
        <div className="text-[10px] font-semibold truncate text-base-content">
          {appointment.student.user.name || appointment.student.user.email}
        </div>
        <div className="text-[8px] truncate text-base-content/70 mt-0.5">
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
