import { AppointmentStatus } from "@/app/generated/prisma";
import { formatDateDisplay, imageGenerator } from "@/lib/utils";
import {
  FaRegCalendar,
  FaRegQuestionCircle,
  FaRegUserCircle,
} from "react-icons/fa";
import { IoMdTime } from "react-icons/io";
import { MdMeetingRoom } from "react-icons/md";
import { getAppointments } from "../AppointmentActions";
import CancelButton from "./CancelButton";

export type AppointmentData = {
  id: string;
  startTime: Date;
  endTime: Date;
  status: AppointmentStatus;
  student: {
    studentId: string;
    user: {
      name: string;
      image?: string | null;
    };
  };
  counselor: {
    counselorId: string;
    user: {
      name: string;
      image?: string | null;
    };
  };
};

const AppointmentsTable = async () => {
  const appointments = await getAppointments();

  return (
    <div className="group h-[39vh] xl:h-[60.2vh] scrollbar-gutter:stable overflow-y-auto w-full">
      <table className="w-full">
        <thead>
          <tr className="flex flex-row border border-transparent border-b-base-content/30 p-2 mb-2 items-center gap-4 w-full font-semibold text-sm">
            <th className="flex flex-row items-center justify-center gap-2 w-full">
              <FaRegUserCircle />
              <p>Counselor</p>
            </th>
            <th className="w-full flex flex-row items-center justify-center gap-2">
              <FaRegCalendar />
              <p>Date</p>
            </th>
            <th className="w-full flex flex-row items-center justify-center gap-2">
              <IoMdTime />
              <p>Time</p>
            </th>
            <th className="w-full flex flex-row items-center justify-center gap-2">
              <MdMeetingRoom />
              <p>Room</p>
            </th>
            <th className="w-full flex flex-row items-center justify-center gap-2">
              <FaRegQuestionCircle />
              <p>Status</p>
            </th>
            <th className="w-full flex flex-row items-center justify-center gap-2">
              <FaRegQuestionCircle />
              <p>Action</p>
            </th>
          </tr>
        </thead>
        <tbody>
          {appointments.map((appointment) => (
            <AppointmentRow key={appointment.id} appointment={appointment} />
          ))}
        </tbody>
      </table>
    </div>
  );
};

function AppointmentRow({ appointment }: { appointment: AppointmentData }) {
  return (
    <tr className="flex flex-row border border-transparent border-b-base-content/30 p-2 mb-2 items-center gap-4 w-full text-center">
      <td className="flex flex-row w-full items-center justify-center gap-2">
        {imageGenerator(
          appointment.counselor.user.name,
          10,
          appointment.counselor.user.image || undefined
        )}
        <p className="font-semibold text-sm">
          {appointment.counselor.user.name}
        </p>
      </td>
      <td className="flex flex-col items-center justify-center w-full">
        <p className="text-sm">
          {formatDateDisplay(appointment.startTime, false)}
        </p>
      </td>
      <td className="flex flex-col items-center justify-center w-full">
        <p className="text-sm">
          {appointment.status === AppointmentStatus.Approved ||
          appointment.status === AppointmentStatus.Completed
            ? formatDateDisplay(appointment.startTime, false)
            : "N/A"}
        </p>
      </td>
      <td className="flex flex-col items-center justify-center w-full">
        <p className="text-sm">
          {appointment.status === AppointmentStatus.Approved ||
          appointment.status === AppointmentStatus.Completed
            ? "MR 143"
            : "N/A"}
        </p>
      </td>
      <td className="flex flex-col items-center justify-center w-full">
        <StatusBadge status={appointment.status} />
      </td>
      <td className="flex flex-col items-center justify-center w-full">
        <ActionButton appointment={appointment} />
      </td>
    </tr>
  );
}

function StatusBadge({ status }: { status: AppointmentStatus }) {
  switch (status) {
    case AppointmentStatus.Rejected:
      return <div className="badge badge-error">Cancelled</div>;
    case AppointmentStatus.Pending:
      return <div className="badge badge-warning">Pending</div>;
    case AppointmentStatus.Approved:
      return <div className="badge badge-success">Approved</div>;
    case AppointmentStatus.Completed:
      return <div className="badge badge-info">Confirmed</div>;
    default:
      return null;
  }
}

function ActionButton({ appointment }: { appointment: AppointmentData }) {
  switch (appointment.status) {
    case AppointmentStatus.Rejected:
      return null;
    case AppointmentStatus.Pending:
      return <CancelButton appointmentId={appointment.id} />;
    case AppointmentStatus.Approved:
      return <CancelButton appointmentId={appointment.id} />;
    case AppointmentStatus.Completed:
      return <button className="btn btn-info">Feedback</button>;
    default:
      return null;
  }
}

export default AppointmentsTable;
