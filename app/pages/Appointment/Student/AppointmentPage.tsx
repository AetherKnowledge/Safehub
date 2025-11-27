import DatePicker from "@/app/components/Input/Date/DatePicker";
import { AppointmentStatus, UserType } from "@/app/generated/prisma";
import { formatDate } from "@/lib/utils";
import Link from "next/link";
import { FaCalendar, FaClock } from "react-icons/fa6";
import { HiSparkles } from "react-icons/hi2";
import { IoCalendarOutline } from "react-icons/io5";
import { AppointmentData, getAppointments } from "../AppointmentActions";
import AppointmentsTable from "../AppointmentTable";
import AppointmentTableTop from "../AppointmentTable/AppointmentTableTop";
import UpcomingAppointmentRow from "../AppointmentTable/UpcomingAppointmentsRow";
import UpcomingAppointmentsTable from "../AppointmentTable/UpcomingAppointmentsTable";
import { ViewModalPopup } from "../Modals/ViewModal";

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
      <div className="flex flex-col gap-4 flex-1 min-h-0 p-1">
        {/* Top Cards Section */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          {/* Today's Appointments Card */}
          <div className="relative overflow-hidden bg-gradient-to-br from-base-100 to-base-200 shadow-xl rounded-xl border border-base-content/5">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16"></div>
            <div className="relative p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2.5 bg-primary/10 rounded-lg">
                  <IoCalendarOutline className="w-5 h-5 text-primary" />
                </div>
                <h2 className="font-bold text-lg">{`Today's Appointments`}</h2>
              </div>
              <TodayAppointments appointments={appointments} />
            </div>
          </div>

          {/* Book Appointment Card */}
          <div className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-base-100 to-secondary/5 shadow-xl rounded-xl border border-primary/10">
            <div className="absolute bottom-0 right-0 w-40 h-40 bg-secondary/5 rounded-full -mr-20 -mb-20"></div>
            <div className="relative p-5 flex flex-col justify-between h-full">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2.5 bg-primary/15 rounded-lg">
                    <HiSparkles className="w-5 h-5 text-primary" />
                  </div>
                  <h2 className="font-bold text-lg">Book New Session</h2>
                </div>
                <p className="text-sm text-base-content/70 mb-4">
                  Schedule a counseling session with our professional counselors
                </p>
              </div>
              <Link
                href="/user/appointments/new"
                className="btn btn-primary rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] group"
              >
                <FaCalendar className="group-hover:rotate-12 transition-transform duration-300" />
                Book Appointment
              </Link>
            </div>
          </div>
        </div>

        {/* Booking History Section */}
        <div className="flex flex-col bg-gradient-to-br from-base-100 to-base-200 rounded-xl shadow-xl border border-base-content/5 flex-1 min-h-0">
          <div className="p-5 border-b border-base-content/5">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <h2 className="font-bold text-xl mb-1">Appointment History</h2>
                <p className="text-sm text-base-content/60">
                  View and manage all your appointments
                </p>
              </div>
              <AppointmentTableTop />
            </div>
          </div>
          <div className="overflow-auto flex-1 min-h-0">
            <AppointmentsTable
              userType={UserType.Student}
              appointments={appointments}
            />
          </div>
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
      <div className="flex flex-col items-center justify-center text-center py-8 px-4">
        <div className="p-4 bg-base-300/30 rounded-full mb-3">
          <IoCalendarOutline className="w-8 h-8 text-base-content/30" />
        </div>
        <p className="text-base-content/60 font-medium">
          No appointments scheduled for today
        </p>
        <p className="text-base-content/40 text-sm mt-1">
          You&apos;re all free today!
        </p>
      </div>
    );

  const appointment = filteredAppointments[0];
  const counselor = appointment.counselor;

  return (
    <div className="space-y-3">
      <div className="bg-base-100 rounded-lg p-4 border border-base-content/10 hover:border-primary/30 transition-colors">
        <div className="flex items-start gap-4">
          {/* Avatar */}
          <div className="avatar">
            <div className="w-12 h-12 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
              <img
                src={
                  counselor.user.image ||
                  `https://ui-avatars.com/api/?name=${encodeURIComponent(
                    counselor.user.name || counselor.user.email
                  )}&background=random`
                }
                alt={counselor.user.name || "Counselor"}
              />
            </div>
          </div>

          {/* Details */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-2">
              <div>
                <p className="font-semibold text-base truncate">
                  {counselor.user.name || counselor.user.email.split("@")[0]}
                </p>
                <p className="text-xs text-base-content/60">Counselor</p>
              </div>
              <div
                className={`badge ${
                  appointment.status === AppointmentStatus.Approved
                    ? "badge-success"
                    : "badge-warning"
                } badge-sm`}
              >
                {appointment.status}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-2 text-sm">
              <div className="flex items-center gap-2 text-base-content/70">
                <FaClock className="w-3.5 h-3.5 text-primary" />
                <span>
                  {new Date(appointment.startTime).toLocaleTimeString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
                {appointment.endTime && (
                  <>
                    <span>-</span>
                    <span>
                      {new Date(appointment.endTime).toLocaleTimeString(
                        "en-US",
                        { hour: "2-digit", minute: "2-digit" }
                      )}
                    </span>
                  </>
                )}
              </div>
              {appointment.sessionPreference && (
                <div className="flex items-center gap-2 text-base-content/60 text-xs">
                  <span className="badge badge-sm badge-ghost">
                    {appointment.sessionPreference}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {filteredAppointments.length > 1 && (
        <div className="text-center">
          <p className="text-xs text-base-content/60">
            +{filteredAppointments.length - 1} more appointment
            {filteredAppointments.length - 1 > 1 ? "s" : ""} today
          </p>
        </div>
      )}
    </div>
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
