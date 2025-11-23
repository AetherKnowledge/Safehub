import { AppointmentStatus } from "@/app/generated/prisma";
import { AppointmentData } from "../AppointmentActions";
import UpcomingAppointmentRow from "./UpcomingAppointmentsRow";

interface UpcomingAppointmentsTableProps {
  appointments: AppointmentData[];
}

const UpcomingAppointmentsTable = async ({
  appointments,
}: UpcomingAppointmentsTableProps) => {
  const filteredAppointments = appointments.filter((appointment) => {
    return appointment.status === AppointmentStatus.Pending;
  });
  return (
    <>
      {filteredAppointments.length > 0 ? (
        <div className="group w-full max-h-57 scrollbar-gutter:stable overflow-y-auto">
          <table className="w-full">
            <tbody>
              {filteredAppointments.map((appointment) => (
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

export default UpcomingAppointmentsTable;
