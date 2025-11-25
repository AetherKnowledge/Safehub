import DatePicker from "@/app/components/Input/Date/DatePicker";
import { AppointmentStatus, UserType } from "@/app/generated/prisma";
import { formatDate } from "@/lib/utils";
import Link from "next/link";
import { FaCalendar } from "react-icons/fa6";
import { AppointmentData, getAppointments } from "../AppointmentActions";
import AppointmentsTable from "../AppointmentTable";
import AppointmentTableTop from "../AppointmentTable/AppointmentTableTop";
import UpcomingAppointmentRow from "../AppointmentTable/UpcomingAppointmentsRow";
import UpcomingAppointmentsTable from "../AppointmentTable/UpcomingAppointmentsTable";
import { ViewModalPopup } from "../AppointmentTable/ViewModal";

type Props = {
  appointmentId?: string;
  status?: string;
};

const AppointmentPage = async ({ appointmentId, status = "all" }: Props) => {
  const appointments = filterAppointments(await getAppointments(), status);

  const selectedAppointment = appointmentId
    ? appointments.find((appt) => appt.id === appointmentId)
    : null;

  return (
    <>
      <div className="flex flex-col gap-3 flex-1 min-h-0">
        <div className="flex flex-col xl:flex-row gap-3">
          <div className="flex flex-col bg-base-100 shadow-br rounded p-3 gap-1 w-full xl:w-1/2">
            <h2 className="font-bold">Todays Appointments</h2>
            <div className="flex flex-row gap-5 flex-1">
              <TodayAppointments appointments={appointments} />
            </div>
          </div>
          <div className="flex flex-col bg-base-100 shadow-br rounded p-3 gap-1 w-full xl:w-1/2">
            <h2 className="font-bold">Book an Appointment</h2>
            <div className="flex flex-col items-center justify-center w-full">
              <Link
                href="/user/appointments/new"
                className="btn btn-primary rounded-lg p-3 w-full max-w-100 h-12"
              >
                <FaCalendar className="mr-2" />
                BOOK NOW
              </Link>
            </div>
          </div>
        </div>
        <div className="flex flex-col bg-base-100 rounded p-3 shadow-br gap-1 flex-1 min-h-0">
          <div className="flex flex-row items-center justify-between pr-4">
            <h2 className="font-bold text-xl">Booking History</h2>
            <AppointmentTableTop />
          </div>
          <AppointmentsTable
            userType={UserType.Student}
            appointments={appointments}
          />
        </div>
      </div>
      {selectedAppointment && (
        <ViewModalPopup appointment={selectedAppointment} />
      )}
    </>
  );
};

export async function TodayAppointments({
  appointments: initialAppointments,
}: {
  appointments?: AppointmentData[];
}) {
  const appointments = initialAppointments || (await getAppointments());

  const today = new Date();
  const tommorrow = new Date(new Date().setDate(today.getDate() + 1));

  const filteredAppointments = appointments.filter((appointment) => {
    if (
      appointment.status !== AppointmentStatus.Approved &&
      appointment.status !== AppointmentStatus.Pending
    )
      return false;

    return appointment.startTime >= today && appointment.startTime < tommorrow;
  });

  if (filteredAppointments.length === 0)
    return (
      <div className="flex items-center justify-center text-center h-[66px] w-full">
        No appointments today.
      </div>
    );

  return (
    <table className="w-full">
      <tbody>
        <UpcomingAppointmentRow appointment={filteredAppointments[0]} />
      </tbody>
    </table>
  );
}

export async function ThisWeeksAppointments({
  appointments: initialAppointments,
}: {
  appointments?: AppointmentData[];
}) {
  const appointments = initialAppointments || (await getAppointments());

  const today = new Date();
  const filteredAppointments = appointments.filter((appointment) => {
    const appointmentDate = new Date(appointment.startTime);
    appointmentDate.setHours(0, 0, 0, 0);
    const diffTime = appointmentDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (
      appointment.status !== AppointmentStatus.Approved &&
      appointment.status !== AppointmentStatus.Pending
    )
      return false;

    return diffDays >= 0 && diffDays < 7;
  });

  if (filteredAppointments.length === 0)
    return (
      <div className="flex items-center justify-center text-center h-full w-full">
        No appointments this week.
      </div>
    );

  return (
    <div className="scrollbar-gutter:stable overflow-y-auto w-full">
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
  );
}

async function DatePickerWithAppointments({ date }: { date?: string }) {
  const appointments = await getAppointments();
  const highlightedDates = appointments.map(
    (appointment) => new Date(appointment.startTime)
  );
  const filteredAppointments = date
    ? appointments.filter(
        (appointment) => formatDate(appointment.startTime) === date
      )
    : appointments;

  return (
    <>
      <UpcomingAppointmentsTable appointments={filteredAppointments} />
      <DatePicker
        value={date ? new Date(date) : undefined}
        highlightedDates={highlightedDates}
        pushToRouter={true}
        local={true}
      />
    </>
  );
}

export function filterAppointments(
  appointments: AppointmentData[],
  status?: string
) {
  if (!status || status === "all") return appointments;

  return appointments.filter(
    (appointment) => appointment.status.toLowerCase() === status.toLowerCase()
  );
}

export default AppointmentPage;
