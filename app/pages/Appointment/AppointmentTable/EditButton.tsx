"use client";
import { UserType } from "@/app/generated/prisma";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { MdEdit } from "react-icons/md";
import { AppointmentData } from "../AppointmentActions";
import RescheduleBooking from "./RescheduleBooking";

interface CancelButtonProps {
  appointment: AppointmentData;
  userType: UserType;
}

const EditButton = ({ appointment, userType }: CancelButtonProps) => {
  const router = useRouter();
  const [showReschedule, setShowReschedule] = useState(false);

  const handleEdit = () => {
    if (userType === UserType.Student) {
      router.push(`/user/appointments/${appointment.id}`);
    } else {
      setShowReschedule(true);
    }
  };

  return (
    <>
      <div
        className="flex flex-row h-8 btn btn-sm btn-ghost gap-1 justify-center items-center"
        onClick={handleEdit}
      >
        <MdEdit className="w-3 h-3" />
        Edit
      </div>
      {showReschedule && (
        <RescheduleBooking
          appointment={appointment}
          onClose={() => setShowReschedule(false)}
        />
      )}
    </>
  );
};

export default EditButton;
