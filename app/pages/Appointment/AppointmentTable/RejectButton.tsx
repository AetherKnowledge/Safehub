"use client";

import { usePopup } from "@/app/components/Popup/PopupProvider";
import { AppointmentStatus } from "@/app/generated/prisma";
import { useRouter } from "next/navigation";
import { MdCancel } from "react-icons/md";
import {
  AppointmentData,
  updateAppointmentStatus,
} from "../AppointmentActions";

const RejectButton = ({ appointment }: { appointment: AppointmentData }) => {
  const router = useRouter();
  const statusPopup = usePopup();

  const handleUpdate = async (appointmentStatus: AppointmentStatus) => {
    statusPopup.showLoading("Updating appointment...");

    const result = await updateAppointmentStatus({
      appointmentId: appointment.id,
      status: appointmentStatus,
    });

    if (!result.success) {
      statusPopup.showError(result.message || "Failed to update appointment.");
      return;
    }

    statusPopup.showSuccess(
      `Appointment ${appointmentStatus.toLowerCase()} successfully`
    );
    router.refresh();
  };

  return (
    <button
      className="flex flex-row btn btn-error gap-1 justify-center items-center btn-sm h-8"
      onClick={() => handleUpdate(AppointmentStatus.Rejected)}
    >
      <MdCancel className="w-3 h-3" />
      {appointment.parentId ? "Cancel" : "Reject"}
    </button>
  );
};

export default RejectButton;
