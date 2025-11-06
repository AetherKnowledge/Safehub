"use client";
import { AppointmentStatus, UserType } from "@/app/generated/prisma";
import { useRouter } from "next/navigation";
import { IoCaretBackCircle } from "react-icons/io5";
import ModalBase from "../../../components/Popup/ModalBase";
import { usePopup } from "../../../components/Popup/PopupProvider";
import {
  AppointmentData,
  updateAppointmentStatus,
} from "../AppointmentActions";
import ApproveButton from "../AppointmentTable/ApproveButton";
import CancelButton from "../AppointmentTable/CancelButton";
import MarkDoneButton from "../AppointmentTable/MarkDoneButton";
import RescheduleButton from "../AppointmentTable/RescheduleButton";
import {
  getBorderStatusColor,
  getStatusTextColor,
} from "./WeeklyCalendarUtils";

type AppointmentPopupProps = {
  appointment: AppointmentData;
  onClose?: () => void;
};

const AppointmentPopup = ({ appointment, onClose }: AppointmentPopupProps) => {
  const router = useRouter();
  const statusPopup = usePopup();

  const handleUpdate = async (appointmentStatus: AppointmentStatus) => {
    onClose?.();
    statusPopup.showLoading("Updating appointment...");

    await updateAppointmentStatus(appointment.id, appointmentStatus)
      .then(() => {
        statusPopup.showSuccess(
          `Appointment ${appointmentStatus.toLowerCase()} successfully`
        );
        router.refresh();
      })
      .catch((error) => {
        statusPopup.showError(error.message || "Failed to update appointment.");
      });
  };

  return (
    <ModalBase>
      <div
        className={`bg-base-100 rounded-lg p-6 max-w-md w-full mx-4 border-l-6 ${getBorderStatusColor(
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
            <p className="text-sm text-base-content/70">
              {appointment.focus} - {appointment.sessionPreference}
            </p>
            <p className="text-sm text-base-content/60">
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
            <p className="text-sm text-base-content/70">{appointment.notes}</p>
          </div>
        )}

        <div className="flex gap-2">
          {(appointment.status === AppointmentStatus.Pending ||
            appointment.status === AppointmentStatus.Approved) && (
            <RescheduleButton
              appointment={appointment}
              userType={UserType.Counselor}
            />
          )}
          {appointment.status === AppointmentStatus.Pending && (
            <ApproveButton
              onClick={() => handleUpdate(AppointmentStatus.Approved)}
            />
          )}
          {appointment.status === AppointmentStatus.Approved && (
            <MarkDoneButton
              onClick={() => handleUpdate(AppointmentStatus.Completed)}
            />
          )}
          {(appointment.status === AppointmentStatus.Approved ||
            appointment.status === AppointmentStatus.Pending) && (
            <CancelButton
              onClick={() => handleUpdate(AppointmentStatus.Rejected)}
              appointmentStatus={appointment.status}
            />
          )}
          <button
            onClick={onClose}
            className="flex flex-row btn btn-ghost gap-1 justify-center items-center btn-sm h-8 ml-auto"
          >
            <IoCaretBackCircle className="w-3 h-3" />
            Close
          </button>
        </div>
      </div>
    </ModalBase>
  );
};

export default AppointmentPopup;
