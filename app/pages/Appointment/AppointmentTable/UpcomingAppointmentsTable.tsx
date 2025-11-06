import { formatDateDisplay, formatTime } from "@/lib/utils";
import UserImage from "../../../components/UserImage";
import { AppointmentData } from "../AppointmentActions";

interface UpcomingAppointmentsTableProps {
  appointments: AppointmentData[];
}

const UpcomingAppointmentsTable = async ({
  appointments,
}: UpcomingAppointmentsTableProps) => {
  return (
    <>
      {appointments.length > 0 ? (
        <div className="group w-full max-h-57 scrollbar-gutter:stable overflow-y-auto">
          <table className="w-full">
            <tbody>
              {appointments.map((appointment) => (
                <UpcomingAppointmentRow
                  key={appointment.id}
                  appointment={appointment}
                />
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="grid w-full h-57 items-center text-center text-sm mt-4">
          No upcoming appointments.
        </div>
      )}
    </>
  );
};

function UpcomingAppointmentRow({
  appointment,
}: {
  appointment: AppointmentData;
}) {
  return (
    <tr className="flex flex-row border border-base-content/10 rounded p-2 mb-2 items-center gap-4 w-full">
      <td>
        <UserImage
          name={
            appointment.counselor.user.name ??
            appointment.counselor.user.email.split("@")[0] ??
            "Counselor"
          }
          width={10}
          src={appointment.counselor.user.image || undefined}
        />
      </td>
      <td className="flex flex-col w-full">
        <p className="text-[10px]">Counselor:</p>
        <p className="font-semibold text-xs">
          {appointment.counselor.user.name}
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
      {/* <td className="flex flex-col w-full">
        <p className="text-[10px]">Room:</p>
        <p className="font-semibold text-xs">MR 143</p>
      </td> */}
    </tr>
  );
}

export default UpcomingAppointmentsTable;
