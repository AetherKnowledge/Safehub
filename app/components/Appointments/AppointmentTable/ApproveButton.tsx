"use client";

import { AppointmentStatus } from "@/app/generated/prisma";
import { useRouter } from "next/navigation";
import { FaCheckCircle } from "react-icons/fa";
import { usePopup } from "../../Popup/PopupProvider";
import { updateAppointmentStatus } from "../AppointmentActions";

interface ApproveButton {
  appointmentId: string;
  setLoading: (loading: boolean) => void;
}

const ApproveButton = ({ appointmentId, setLoading }: ApproveButton) => {
  const router = useRouter();
  const popup = usePopup();

  const handleApprove = async (appointmentId: string) => {
    await updateAppointmentStatus(appointmentId, AppointmentStatus.Approved)
      .then(() => {
        setLoading(false);
        router.refresh();
      })
      .catch((error) => {
        setLoading(false);
        popup.showError(error.message || "Failed to approve appointment");
      });
  };

  return (
    <button
      className="flex flex-row btn btn-primary gap-1 justify-center items-center btn-sm h-8"
      onClick={() => handleApprove(appointmentId)}
    >
      <FaCheckCircle className="w-3 h-3" />
      Approve
    </button>
  );
};

export default ApproveButton;
