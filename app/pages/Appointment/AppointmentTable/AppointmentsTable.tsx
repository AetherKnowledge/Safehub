import StatusBadge, { FollowUpBadge } from "@/app/components/Table/StatusBadge";
import { AppointmentStatus, UserType } from "@/app/generated/prisma";
import { formatDateDisplay, formatTime } from "@/lib/utils";
import {
  FaRegCalendar,
  FaRegQuestionCircle,
  FaRegUserCircle,
} from "react-icons/fa";
import { IoMdTime } from "react-icons/io";
import { AppointmentData } from "../AppointmentActions";
import ApproveButton from "./ApproveButton";
import CancelButton from "./CancelButton";
import EditButton from "./EditButton";
import EvaluationButton from "./EvaluationButton";
import SessionSummaryButton from "./SessionSummaryButton";
import UserCell from "./UserCell";
import ViewAppointmentButton from "./ViewAppointmentButton";

const AppointmentsTable = async ({
  userType,
  appointments,
}: {
  userType: UserType;
  appointments: AppointmentData[];
}) => {
  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-base-content/30 text-sm font-semibold">
            <th className="px-3 py-2">
              <div className="flex items-center justify-center gap-2">
                <FaRegUserCircle />
                <p>{userType === UserType.Student ? "Counselor" : "Student"}</p>
              </div>
            </th>
            <th className="px-3 py-2">
              <div className="flex items-center justify-center gap-2">
                <FaRegCalendar />
                <p>Date</p>
              </div>
            </th>
            <th className="px-3 py-2">
              <div className="flex items-center justify-center gap-2">
                <IoMdTime />
                <p>Time</p>
              </div>
            </th>
            <th className="px-3 py-2">
              <div className="flex items-center justify-center gap-2">
                <FaRegQuestionCircle />
                <p>Status</p>
              </div>
            </th>
            <th className="px-3 py-2">
              <div className="flex items-center justify-center gap-2">
                <FaRegQuestionCircle />
                <p>Action</p>
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          {appointments.map((appointment) => (
            <AppointmentRow
              key={appointment.id}
              appointment={appointment}
              userType={userType}
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
}: {
  appointment: AppointmentData;
  userType: UserType;
}) {
  return (
    <tr className="border-b border-base-content/30 text-center">
      <td className="px-3 py-4">
        <div className="flex flex-wrap items-center justify-center gap-2">
          <UserCell userType={userType} appointment={appointment} />
        </div>
      </td>
      <td className="px-3 py-4">
        <p className="text-sm">
          {formatDateDisplay(appointment.startTime, false)}
        </p>
      </td>
      <td className="px-3 py-4">
        <p className="text-sm">{`${formatTime(appointment.startTime)} ${
          appointment.endTime ? " - " + formatTime(appointment.endTime) : ""
        }`}</p>
      </td>
      <td className="px-3 py-4">
        <div className="flex flex-col items-center justify-center gap-2">
          <StatusBadge status={appointment.status} />
          {appointment.parentId && <FollowUpBadge />}
        </div>
      </td>
      <td className="px-3 py-4">
        <div className="flex flex-wrap items-center justify-center gap-2">
          {userType === UserType.Student ? (
            <StudentActionButton appointment={appointment} />
          ) : (
            <>
              <ViewAppointmentButton appointment={appointment} />
              {appointment.evaluationData && (
                <EvaluationButton
                  appointment={appointment}
                  userType={userType}
                />
              )}
            </>
          )}
        </div>
      </td>
    </tr>
  );
}

function StudentActionButton({
  appointment,
}: {
  appointment: AppointmentData;
}) {
  switch (appointment.status) {
    case AppointmentStatus.Pending:
      return (
        <>
          {appointment.parentId ? (
            <ApproveButton appointment={appointment} />
          ) : (
            <EditButton appointment={appointment} />
          )}
          <CancelButton appointment={appointment} />
        </>
      );
    case AppointmentStatus.Approved:
      return (
        <>
          {!appointment.parentId && <EditButton appointment={appointment} />}
          <CancelButton appointment={appointment} />
        </>
      );
    case AppointmentStatus.Completed:
      return (
        <>
          <EvaluationButton
            appointment={appointment}
            userType={UserType.Student}
          />
          <SessionSummaryButton appointment={appointment} />
        </>
      );
    default:
      return null;
  }
}

export default AppointmentsTable;
