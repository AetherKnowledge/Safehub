"use client";
import { AppointmentData } from "../AppointmentsActions";
import {
  getBorderStatusColor,
  getStatusTextColor,
} from "./WeeklyCalendarUtils";

export enum AppointmentPopupAction {
  COMPLETE = "complete",
  CANCEL = "cancel",
  CLOSE = "close",
}

type AppointmentPopupProps = {
  appointment: AppointmentData;
  onAction?: (
    appointment: AppointmentData,
    action: AppointmentPopupAction
  ) => void;
};

const AppointmentPopup = ({ appointment, onAction }: AppointmentPopupProps) => {
  return (
    <div className="fixed inset-0 bg-transparent bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 transition-opacity">
      <div
        className={`bg-base-100 rounded-lg p-6 max-w-md w-full mx-4 border-l-4 ${getBorderStatusColor(
          appointment.status
        )}`}
      >
        <div className="flex justify-between items-start mb-4">
          <div>
            <div
              className={`font-medium ${getStatusTextColor(
                appointment.status
              )}`}
            >
              {appointment.status}
            </div>
            <h3 className="text-lg font-bold mt-2">
              {appointment.student.user.name || appointment.student.user.email}
            </h3>
            <p className="text-sm text-gray-600">
              {appointment.focus} - {appointment.sessionPreference}
            </p>
            <p className="text-sm text-gray-500">
              {new Date(appointment.startTime).toLocaleString()}
              {appointment.endTime && (
                <span>
                  {" "}
                  -{" "}
                  {new Date(appointment.endTime).toLocaleTimeString("en-US", {
                    hour: "numeric",
                    minute: "2-digit",
                    hour12: true,
                  })}
                </span>
              )}
            </p>
          </div>
        </div>

        {appointment.notes && (
          <div className="mb-4">
            <h4 className="font-medium text-sm mb-1">Notes:</h4>
            <p className="text-sm text-gray-600">{appointment.notes}</p>
          </div>
        )}

        <div className="flex gap-2">
          {appointment.status === "Approved" && (
            <button
              onClick={() =>
                onAction?.(appointment, AppointmentPopupAction.COMPLETE)
              }
              className="px-4 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
            >
              Mark as done
            </button>
          )}
          <button
            onClick={() =>
              onAction?.(appointment, AppointmentPopupAction.CANCEL)
            }
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded text-sm hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={() =>
              onAction?.(appointment, AppointmentPopupAction.CLOSE)
            }
            className="px-4 py-2 bg-gray-500 text-white rounded text-sm hover:bg-gray-600 ml-auto"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default AppointmentPopup;
