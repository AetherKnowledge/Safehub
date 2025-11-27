"use client";

import UserImage from "@/app/components/UserImage";
import { UserType } from "@/app/generated/prisma";
import { formatDateDisplay, formatTime } from "@/lib/utils";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { AppointmentData } from "../AppointmentActions";
import ViewModal from "../Modals/ViewModal";

const UpcomingAppointmentRow = ({
  appointment,
}: {
  appointment: AppointmentData;
}) => {
  const [showModal, setShowModal] = useState(false);
  const session = useSession();
  const userType = session?.data?.user.type || UserType.Student;
  const studentData = appointment.student;
  const counselorData = appointment.counselor;

  return (
    <>
      <tr
        className={`flex flex-row border border-base-content/10 rounded p-2 mb-2 items-center gap-4 w-full cursor-pointer hover:bg-base-300/50 active:bg-base-300 transition-colors`}
        onClick={() => setShowModal(true)}
      >
        <td>
          <UserImage
            name={
              userType === UserType.Counselor
                ? studentData.user.name ??
                  studentData.user.email.split("@")[0] ??
                  "User"
                : counselorData.user.name ??
                  counselorData.user.email.split("@")[0] ??
                  "User"
            }
            width={10}
            src={
              userType === UserType.Counselor
                ? studentData.user.image
                : counselorData.user.image || undefined
            }
          />
        </td>
        <td className="flex flex-col w-full">
          <p className="text-[10px]">
            {session.data?.user.type === UserType.Counselor
              ? "Student:"
              : "Counselor:"}
          </p>
          <p className="font-semibold text-xs">
            {userType === UserType.Counselor
              ? studentData.user.name
              : counselorData.user.name}
          </p>
        </td>
        <td className="flex flex-col w-full">
          <p className="text-[10px]">Date:</p>
          <p className="font-semibold text-xs">
            {formatDateDisplay(appointment.startTime, false)}
          </p>
        </td>
        <td className="flex flex-col w-full">
          <p className="text-[10px]">Time:</p>
          <p className="font-semibold text-xs">
            {formatTime(appointment.startTime)}
          </p>
        </td>
      </tr>
      {showModal && (
        <ViewModal
          appointment={appointment}
          onClose={() => {
            setShowModal(false);
          }}
        />
      )}
    </>
  );
};

export default UpcomingAppointmentRow;
