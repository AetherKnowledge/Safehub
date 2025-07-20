"use client";
import { AppointmentStatus, UserType } from "@/app/generated/prisma";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { GoDotFill } from "react-icons/go";
import { AppointmentData } from "./AppointmentTable";

interface Props {
  appointment: AppointmentData;
  onCancel?: (appointmentId: string) => void;
}

const ApointmentRow = ({ appointment, onCancel }: Props) => {
  const user = useSession();

  const DateFormatter = new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const TimeFormatter = new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  const formattedDate = DateFormatter.format(new Date(appointment.schedule));
  const formattedTime = TimeFormatter.format(new Date(appointment.schedule));

  const tableName =
    user.data?.user.type === UserType.Student
      ? appointment.counselor.user.name
      : appointment.student.user.name;
  const tableImage =
    user.data?.user.type === UserType.Student
      ? appointment.counselor.user.image
      : appointment.student.user.image;

  return (
    <tr>
      <td>
        <div className="flex items-center gap-3 text-left">
          <div className="avatar">
            <div className="mask mask-circle h-12 w-12">
              {tableImage ? (
                <Image
                  width={80}
                  height={80}
                  src={tableImage}
                  alt="Avatar Tailwind CSS Component"
                />
              ) : (
                <div
                  role="button"
                  tabIndex={0}
                  className="w-12 h-12 rounded-full bg-gray-500 text-xl text-white flex items-center justify-center font-bold hover:brightness-90 active:brightness-75 transition duration-150 select-none cursor-pointer"
                >
                  {tableName.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
          </div>
          <div>
            <div className="font-semibold">{tableName}</div>
          </div>
        </div>
      </td>
      <td>{formattedDate}</td>
      <td>{formattedTime}</td>
      <td>
        <div className="flex items-center justify-center h-full w-full text-xl">
          {appointment.status === AppointmentStatus.Approved && (
            <GoDotFill className="text-green-500" />
          )}
        </div>
      </td>
      <td>
        <div className="flex items-center justify-center h-full w-full text-xl">
          {appointment.status === AppointmentStatus.Pending && (
            <GoDotFill className="text-yellow-500" />
          )}
        </div>
      </td>
      <td>
        <div className="flex items-center justify-center h-full w-full text-xl">
          {appointment.status === AppointmentStatus.Completed && (
            <GoDotFill className="text-blue-500" />
          )}
        </div>
      </td>
      <th>
        <button
          className="btn btn-outline btn-sm"
          onClick={onCancel && (() => onCancel(appointment.id))}
        >
          Cancel
        </button>
      </th>
    </tr>
  );
};

export default ApointmentRow;
