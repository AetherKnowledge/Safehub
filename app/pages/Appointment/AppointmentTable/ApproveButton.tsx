"use client";

import { usePopup } from "@/app/components/Popup/PopupProvider";
import { AppointmentStatus, UserType } from "@/app/generated/prisma";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FaCheckCircle } from "react-icons/fa";
import {
  AppointmentData,
  approveFollowUpAppointment,
  updateAppointmentStatus,
} from "../AppointmentActions";

interface ApproveButton {
  appointment: AppointmentData;
}

const ApproveButton = ({ appointment }: ApproveButton) => {
  const router = useRouter();
  const statusPopup = usePopup();
  const session = useSession();

  const handleUpdate = async (appointmentStatus: AppointmentStatus) => {
    statusPopup.showLoading("Updating appointment...");

    const result =
      session?.data?.user?.type === UserType.Counselor
        ? await updateAppointmentStatus({
            appointmentId: appointment.id,
            status: appointmentStatus,
          })
        : await approveFollowUpAppointment(appointment.id);

    if (!result.success) {
      statusPopup.showError(result.message || "Failed to approve appointment.");
      return;
    }

    statusPopup.showSuccess(`Appointment approved successfully.`);
    router.refresh();
  };

  return (
    <button
      className="flex flex-row btn btn-primary gap-1 justify-center items-center btn-sm h-8"
      onClick={() => handleUpdate(AppointmentStatus.Approved)}
    >
      <FaCheckCircle className="w-3 h-3" />
      Approve
    </button>
  );
};

export default ApproveButton;
