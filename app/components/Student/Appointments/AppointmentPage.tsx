import { UserType } from "@/app/generated/prisma";
import { formatDate } from "@/lib/utils";
import Link from "next/link";
import { Suspense } from "react";
import { FaCalendar } from "react-icons/fa6";
import { getAppointments } from "../../Appointments/AppointmentActions";
import AppointmentsTable from "../../Appointments/AppointmentTable";
import UpcomingAppointmentsTable from "../../Appointments/AppointmentTable/UpcomingAppointmentsTable";
import DatePicker from "../../Appointments/Booking/DatePicker";
import Contact from "../../Appointments/Images/Contact";
import Meeting from "../../Appointments/Images/Meeting";

type Props = {
  date?: string;
};

const AppointmentPage = async ({ date }: Props) => {
  const appointments = await getAppointments();

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col xl:flex-row gap-3">
        <div className="flex flex-col w-full bg-base-100 shadow-br rounded p-3 gap-1">
          <h2 className="font-bold">Upcoming Appointments</h2>
          <div className="flex flex-row gap-5 w-full">
            <Suspense>
              <DatePickerWithAppointments date={date} />
            </Suspense>
          </div>
        </div>
        <div className="flex flex-col bg-base-100 rounded p-3 shadow-br gap-1 w-full">
          <h2 className="font-bold">Book an Appointment</h2>
          <div className="flex flex-row gap-10 px-5 items-center justify-between w-full">
            <div className="flex flex-col gap-5 items-center justify-center pt-5">
              <p className="w-96 text-center italic font-light">
                LCUP’s Social Welfare Services are available from Mondays to
                Fridays
              </p>
              <div className="flex flex-row gap-5">
                <div className="w-40 h-35 overflow-y-hidden">
                  <Contact />
                </div>
                <div className="w-40 h-35 overflow-y-hidden">
                  <Meeting />
                </div>
              </div>
            </div>
            <div className="flex flex-col items-center justify-center w-full">
              <Link
                href="/user/appointments/new"
                className="btn btn-primary p-4 w-40 h-12"
              >
                <FaCalendar className="mr-2" />
                BOOK NOW
              </Link>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col bg-base-100 rounded p-3 shadow-br gap-1">
        <h2 className="font-bold">Booking History</h2>
        <Suspense>
          <AppointmentsTable
            userType={UserType.Student}
            appointments={appointments}
          />
        </Suspense>
      </div>
    </div>
  );
};

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

export default AppointmentPage;
