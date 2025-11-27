import StatusBadge, { FollowUpBadge } from "@/app/components/Table/StatusBadge";
import { UserType } from "@/app/generated/prisma";
import { formatDateDisplay, formatTime } from "@/lib/utils";
import {
  FaRegCalendar,
  FaRegQuestionCircle,
  FaRegUserCircle,
} from "react-icons/fa";
import { IoMdTime } from "react-icons/io";
import { AppointmentData } from "../AppointmentActions";
import ViewAppointmentButton from "../Modals/ViewAppointmentButton";
import UserCell from "./UserCell";

const AppointmentsTable = async ({
  userType,
  appointments,
}: {
  userType: UserType;
  appointments: AppointmentData[];
}) => {
  if (appointments.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4">
        <div className="p-5 bg-base-300/20 rounded-full mb-4">
          <FaRegCalendar className="w-12 h-12 text-base-content/30" />
        </div>
        <h3 className="text-lg font-semibold text-base-content/70 mb-2">
          No appointments found
        </h3>
        <p className="text-sm text-base-content/50">
          Your appointment history will appear here
        </p>
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto rounded-lg">
      <table className="w-full border-separate border-spacing-0">
        <thead>
          <tr className="bg-base-200/50">
            <th className="px-4 py-3.5 text-left rounded-tl-lg">
              <div className="flex items-center gap-2 text-sm font-semibold text-base-content/80">
                <FaRegUserCircle className="w-4 h-4" />
                <p>{userType === UserType.Student ? "Counselor" : "Student"}</p>
              </div>
            </th>
            <th className="px-4 py-3.5 text-center">
              <div className="flex items-center justify-center gap-2 text-sm font-semibold text-base-content/80">
                <FaRegCalendar className="w-4 h-4" />
                <p>Date</p>
              </div>
            </th>
            <th className="px-4 py-3.5 text-center">
              <div className="flex items-center justify-center gap-2 text-sm font-semibold text-base-content/80">
                <IoMdTime className="w-4 h-4" />
                <p>Time</p>
              </div>
            </th>
            <th className="px-4 py-3.5 text-center">
              <div className="flex items-center justify-center gap-2 text-sm font-semibold text-base-content/80">
                <FaRegQuestionCircle className="w-4 h-4" />
                <p>Status</p>
              </div>
            </th>
            <th className="px-4 py-3.5 text-center rounded-tr-lg">
              <div className="flex items-center justify-center gap-2 text-sm font-semibold text-base-content/80">
                <FaRegQuestionCircle className="w-4 h-4" />
                <p>Action</p>
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          {appointments.map((appointment, index) => (
            <AppointmentRow
              key={appointment.id}
              appointment={appointment}
              userType={userType}
              isLast={index === appointments.length - 1}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

function AppointmentRow({
  appointment,
  userType,
  isLast = false,
}: {
  appointment: AppointmentData;
  userType: UserType;
  isLast?: boolean;
}) {
  return (
    <tr
      className={`group bg-base-100 hover:bg-base-200/50 transition-colors ${
        !isLast ? "border-b border-base-content/5" : ""
      }`}
    >
      <td className="px-4 py-4">
        <div className="flex flex-wrap items-center justify-start gap-2">
          <UserCell userType={userType} appointment={appointment} />
        </div>
      </td>
      <td className="px-4 py-4">
        <p className="text-sm text-center font-medium text-base-content/90">
          {formatDateDisplay(appointment.startTime, false)}
        </p>
      </td>
      <td className="px-4 py-4">
        <p className="text-sm text-center text-base-content/80">{`${formatTime(
          appointment.startTime
        )} ${
          appointment.endTime ? " - " + formatTime(appointment.endTime) : ""
        }`}</p>
      </td>
      <td className="px-4 py-4">
        <div className="flex flex-col items-center justify-center gap-2">
          <StatusBadge status={appointment.status} />
          {appointment.parentId && <FollowUpBadge />}
        </div>
      </td>
      <td className="px-4 py-4">
        <div className="flex flex-col items-center justify-center gap-2">
          <ViewAppointmentButton appointment={appointment} />
        </div>
      </td>
    </tr>
  );
}

export default AppointmentsTable;
