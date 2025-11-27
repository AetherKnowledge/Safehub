"use client";

import { usePopup } from "@/app/components/Popup/PopupProvider";
import { AppointmentStatus, UserType } from "@/app/generated/prisma";
import { addMinutes } from "@/lib/utils";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FaCheckCircle } from "react-icons/fa";
import {
  AppointmentData,
  approveFollowUpAppointment,
  checkForConflictingDate,
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
    const confirm = await statusPopup.showYesNo(
      `Are you sure you want to approve this appointment?`
    );

    if (!confirm) {
      return;
    }

    if (session?.data?.user?.type === UserType.Counselor) {
      const conflicts = await checkForConflictingDate(
        appointment.startTime,
        appointment.endTime || addMinutes(appointment.startTime, 60),
        appointment.id
      );

      if (conflicts && conflicts.length > 0) {
        const confirm = await statusPopup.showWarning(
          `The selected appointment conflicts with ${conflicts.length} existing appointment(s). Do you still want to proceed?`
        );
        if (!confirm) return;
      }
    }

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
