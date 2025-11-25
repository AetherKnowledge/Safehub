"use client";

import UserImage from "@/app/components/UserImage";
import { UserType } from "@/app/generated/prisma";
import { formatDateDisplay, formatTime } from "@/lib/utils";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { AppointmentData } from "../AppointmentActions";
import { ViewModal } from "./ViewAppointmentButton";

const UpcomingAppointmentRow = ({
  appointment,
}: {
  appointment: AppointmentData;
}) => {
  const session = useSession();
  const [showModal, setShowModal] = useState(false);

  const userData =
    session?.data?.user.type === UserType.Student
      ? appointment.counselor
      : appointment.student;

  return (
    <tr
      className={`flex flex-row border border-base-content/10 rounded p-2 mb-2 items-center gap-4 w-full ${
        session.data?.user.type === UserType.Counselor
          ? "cursor-pointer hover:bg-base-300/50 active:bg-base-300 transition-colors"
          : ""
      }`}
      onClick={() => {
        if (session.data?.user.type === UserType.Counselor) {
          setShowModal(true);
        }
      }}
    >
      <td>
        <UserImage
          name={
            userData.user.name ?? userData.user.email.split("@")[0] ?? "User"
          }
          width={10}
          src={userData.user.image || undefined}
        />
        {showModal && (
          <ViewModal
            appointment={appointment}
            onClose={() => {
              setShowModal(false);
            }}
          />
        )}
      </td>
      <td className="flex flex-col w-full">
        <p className="text-[10px]">
          {session.data?.user.type === UserType.Counselor
            ? "Student:"
            : "Counselor:"}
        </p>
        <p className="font-semibold text-xs">{userData.user.name}</p>
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
      {/* <td className="flex flex-col w-full">
        <p className="text-[10px]">Room:</p>
        <p className="font-semibold text-xs">MR 143</p>
      </td> */}
    </tr>
  );
};

export default UpcomingAppointmentRow;
