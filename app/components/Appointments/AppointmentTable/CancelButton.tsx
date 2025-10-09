"use client";

import { AppointmentStatus } from "@/app/generated/prisma";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { MdCancel } from "react-icons/md";
import { usePopup } from "../../Popup/PopupProvider";
import { updateAppointmentStatus } from "../AppointmentActions";

interface CancelButtonProps {
  appointmentId: string;
  setLoading: (loading: boolean) => void;
}

const CancelButton = ({ appointmentId, setLoading }: CancelButtonProps) => {
  const session = useSession();
  const router = useRouter();
  const popup = usePopup();

  const handleCancel = async (appointmentId: string) => {
    await updateAppointmentStatus(appointmentId, AppointmentStatus.Rejected)
      .then(() => {
        setLoading(false);
        router.refresh();
      })
      .catch((error) => {
        setLoading(false);
        popup.showError(error.message || "Failed to cancel appointment");
      });
  };

  return (
    <button
      className="flex flex-row btn btn-error gap-1 justify-center items-center btn-sm h-8"
      onClick={() => handleCancel(appointmentId)}
    >
      <MdCancel className="w-3 h-3" />
      {session.data?.user.type === "Student" ? "Cancel" : "Reject"}
    </button>
  );
};

export default CancelButton;
