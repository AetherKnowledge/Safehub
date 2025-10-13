"use client";

import { AppointmentStatus } from "@/app/generated/prisma";
import { useSession } from "next-auth/react";
import { MdCancel } from "react-icons/md";

interface CancelButtonProps {
  appointmentStatus: AppointmentStatus;
  onClick: () => void;
}

const CancelButton = ({ appointmentStatus, onClick }: CancelButtonProps) => {
  const session = useSession();

  return (
    <button
      className="flex flex-row btn btn-error gap-1 justify-center items-center btn-sm h-8"
      onClick={onClick}
    >
      <MdCancel className="w-3 h-3" />
      {session.data?.user.type === "Student" ||
      appointmentStatus === AppointmentStatus.Approved
        ? "Cancel"
        : "Reject"}
    </button>
  );
};

export default CancelButton;
