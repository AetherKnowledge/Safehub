import { formatDateDisplay, formatTime, imageGenerator } from "@/lib/utils";
import { AppointmentData } from "./AppointmentsTable";

interface UpcomingAppointmentsTableProps {
  appointments: AppointmentData[];
}

const UpcomingAppointmentsTable = async ({
  appointments,
}: UpcomingAppointmentsTableProps) => {
  return (
    <div className="group max-h-57 scrollbar-gutter:stable overflow-y-auto w-full">
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
        {imageGenerator(
          appointment.counselor.user.name,
          10,
          appointment.counselor.user.image || undefined
        )}
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
          {formatDateDisplay(appointment.schedule, false)}
        </p>
      </td>
      <td className="flex flex-col w-full">
        <p className="text-[10px]">Time:</p>
        <p className="font-semibold text-xs">
          {formatTime(appointment.schedule)}
        </p>
      </td>
      <td className="flex flex-col w-full">
        <p className="text-[10px]">Room:</p>
        <p className="font-semibold text-xs">MR 143</p>
      </td>
    </tr>
  );
}

export default UpcomingAppointmentsTable;
