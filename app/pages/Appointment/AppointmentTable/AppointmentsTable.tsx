import { AppointmentStatus, UserType } from "@/app/generated/prisma";
import { formatDateDisplay, formatTime } from "@/lib/utils";
import {
  FaRegCalendar,
  FaRegQuestionCircle,
  FaRegUserCircle,
} from "react-icons/fa";
import { IoMdTime } from "react-icons/io";
import UserImage from "../../../components/UserImage";
import { AppointmentData } from "../AppointmentActions";
import ActionBox from "./ActionBox";
import StatusBadge from "@/app/components/Table/StatusBadge";

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
            {/* <th className="px-3 py-2">
              <div className="flex items-center justify-center gap-2">
                <MdMeetingRoom />
                <p>Room</p>
              </div>
            </th> */}
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
          <UserColumn userType={userType} appointment={appointment} />
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
      {/* <td className="px-3 py-4">
        <p className="text-sm">
          {appointment.status === AppointmentStatus.Approved ||
          appointment.status === AppointmentStatus.Completed
            ? "MR 143"
            : "N/A"}
        </p>
      </td> */}
      <td className="px-3 py-4">
        <StatusBadge status={appointment.status} />
      </td>
      <td className="px-3 py-4">
        <div className="flex flex-wrap items-center justify-center gap-2">
          {userType === UserType.Student ? (
            <StudentActionButton appointment={appointment} />
          ) : (
            <CounselorActionButton appointment={appointment} />
          )}
        </div>
      </td>
    </tr>
  );
}

function UserColumn({
  userType,
  appointment,
}: {
  userType: UserType;
  appointment: AppointmentData;
}) {
  return (
    <>
      <UserImage
        name={
          userType === UserType.Student
            ? appointment.counselor.user.name ??
              appointment.counselor.user.email.split("@")[0] ??
              "Counselor"
            : appointment.student.user.name ??
              appointment.student.user.email.split("@")[0] ??
              "Student"
        }
        width={10}
        src={
          userType === UserType.Student
            ? appointment.counselor.user.image || undefined
            : appointment.student.user.image || undefined
        }
      />
      <p className="font-semibold text-sm">
        {userType === UserType.Student
          ? appointment.counselor.user.name ??
            appointment.counselor.user.email.split("@")[0] ??
            "Counselor"
          : appointment.student.user.name ??
            appointment.student.user.email.split("@")[0] ??
            "Student"}
      </p>
    </>
  );
}

export enum Actions {
  APPROVE = "approve",
  REJECT = "reject",
  CANCEL = "cancel",
  EDIT = "edit",
  FEEDBACK = "feedback",
  MARK_DONE = "mark_done",
}

function StudentActionButton({
  appointment,
}: {
  appointment: AppointmentData;
}) {
  switch (appointment.status) {
    case AppointmentStatus.Pending:
      return (
        <ActionBox
          actions={[Actions.EDIT, Actions.CANCEL]}
          appointment={appointment}
          userType={UserType.Student}
        />
      );
    case AppointmentStatus.Approved:
      return (
        <ActionBox
          actions={[Actions.EDIT, Actions.CANCEL]}
          appointment={appointment}
          userType={UserType.Student}
        />
      );
    case AppointmentStatus.Completed:
      return (
        <ActionBox
          actions={[Actions.FEEDBACK]}
          appointment={appointment}
          userType={UserType.Student}
        />
      );
    default:
      return null;
  }
}

function CounselorActionButton({
  appointment,
}: {
  appointment: AppointmentData;
}) {
  switch (appointment.status) {
    case AppointmentStatus.Pending:
      return (
        <ActionBox
          actions={[Actions.APPROVE, Actions.EDIT, Actions.REJECT]}
          appointment={appointment}
          userType={UserType.Counselor}
        />
      );
    case AppointmentStatus.Approved:
      return (
        <ActionBox
          actions={[Actions.EDIT, Actions.REJECT, Actions.MARK_DONE]}
          appointment={appointment}
          userType={UserType.Counselor}
        />
      );
    default:
      return null;
  }
}

export default AppointmentsTable;
