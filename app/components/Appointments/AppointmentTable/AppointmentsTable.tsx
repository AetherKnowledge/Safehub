import { AppointmentStatus, UserType } from "@/app/generated/prisma";
import { formatDateDisplay, formatTime, imageGenerator } from "@/lib/utils";
import {
  FaRegCalendar,
  FaRegQuestionCircle,
  FaRegUserCircle,
} from "react-icons/fa";
import { IoMdTime } from "react-icons/io";
import { MdMeetingRoom } from "react-icons/md";
import ActionBox from "./ActionBox";
import { AppointmentData } from "./AppointmentsActions";

const AppointmentsTable = async ({
  userType,
  appointments,
}: {
  userType: UserType;
  appointments: AppointmentData[];
}) => {
  return (
    <div className="group h-[39vh] xl:h-[60.2vh] scrollbar-gutter:stable overflow-y-auto w-full">
      <table className="w-full">
        <thead>
          <tr className="flex flex-row border border-transparent border-b-base-content/30 p-2 mb-2 items-center gap-4 w-full font-semibold text-sm">
            <th className="flex flex-row items-center justify-center gap-2 w-full">
              <FaRegUserCircle />
              <p>{userType === UserType.Student ? "Counselor" : "Student"}</p>
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
    <tr className="flex flex-row border border-transparent border-b-base-content/30 p-2 mb-2 items-center gap-4 w-full text-center">
      <td className="flex flex-wrap w-full items-center justify-center gap-2">
        <UserColumn userType={userType} appointment={appointment} />
      </td>
      <td className="flex flex-col items-center justify-center w-full">
        <p className="text-sm">
          {formatDateDisplay(appointment.startTime, false)}
        </p>
      </td>
      <td className="flex flex-col items-center justify-center w-full">
        <p className="text-sm">{formatTime(appointment.startTime)}</p>
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
      <td className="flex flex-wrap items-center justify-center w-full gap-2">
        {userType === UserType.Student ? (
          <StudentActionButton appointment={appointment} />
        ) : (
          <CounselorActionButton appointment={appointment} />
        )}
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
      {imageGenerator(
        userType === UserType.Student
          ? appointment.counselor.user.name ??
              appointment.counselor.user.email.split("@")[0] ??
              "Counselor"
          : appointment.student.user.name ??
              appointment.student.user.email.split("@")[0] ??
              "Student",
        10,
        userType === UserType.Student
          ? appointment.counselor.user.image || undefined
          : appointment.student.user.image || undefined
      )}
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

export enum Actions {
  APPROVE = "approve",
  CANCEL = "cancel",
  EDIT = "edit",
  FEEDBACK = "feedback",
}

function StudentActionButton({
  appointment,
}: {
  appointment: AppointmentData;
}) {
  switch (appointment.status) {
    case AppointmentStatus.Rejected:
      return null;
    case AppointmentStatus.Pending:
      <ActionBox
        actions={[Actions.EDIT, Actions.CANCEL]}
        appointment={appointment}
      />;
    case AppointmentStatus.Approved:
      return (
        <ActionBox
          actions={[Actions.EDIT, Actions.CANCEL]}
          appointment={appointment}
        />
      );
    case AppointmentStatus.Completed:
      return (
        <ActionBox actions={[Actions.FEEDBACK]} appointment={appointment} />
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
    case AppointmentStatus.Rejected:
      return null;
    case AppointmentStatus.Pending:
      return (
        <ActionBox
          actions={[Actions.APPROVE, Actions.EDIT, Actions.CANCEL]}
          appointment={appointment}
        />
      );
    case AppointmentStatus.Approved:
      return <ActionBox actions={[Actions.EDIT]} appointment={appointment} />;
    default:
      return null;
  }
}

export default AppointmentsTable;
