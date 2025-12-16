import { UserType } from "@/app/generated/prisma/browser";
import {
  getAppointments,
  getAppointmentsForDateRange,
} from "../AppointmentActions";
import AppointmentsTable from "../AppointmentTable";
import { ViewModalPopup } from "../Modals/ViewModal";
import { filterAppointments } from "../Student/AppointmentPage";
import WeeklyCalendar from "../WeeklyCalendar";
import { getWeekDates } from "../WeeklyCalendar/WeeklyCalendarUtils";
import AppointmentHeader from "./AppointmentHeader";

export enum ViewMode {
  LIST = "list",
  CALENDAR = "calendar",
}

const AppointmentsPage = async ({
  date,
  viewMode,
  appointmentId,
  status,
}: {
  date: string;
  viewMode: ViewMode;
  appointmentId?: string;
  status?: string;
}) => {
  const weekDates = getWeekDates(new Date(date));
  const appointments =
    viewMode === ViewMode.LIST
      ? filterAppointments(await getAppointments(), status)
      : await getAppointmentsForDateRange(
          weekDates[0],
          weekDates[weekDates.length - 1]
        );

  const selectedAppointment = appointmentId
    ? appointments.find((appt) => appt.id === appointmentId)
    : null;

  return (
    <>
      <div className="flex flex-col gap-4 flex-1 min-h-0 p-1">
        {/* Main Content Card */}
        <div className="flex flex-col bg-linear-to-br from-base-100 to-base-200 shadow-xl rounded-xl border border-base-content/5 flex-1 min-h-0 overflow-hidden">
          <AppointmentHeader />
          <div className="flex-1 min-h-0 overflow-auto flex flex-col">
            {viewMode === ViewMode.CALENDAR && (
              <WeeklyCalendar date={new Date(date)} />
            )}
            {viewMode === ViewMode.LIST && (
              <AppointmentsTable
                userType={UserType.Counselor}
                appointments={appointments}
              />
            )}
          </div>
        </div>
      </div>
      {selectedAppointment && (
        <ViewModalPopup appointment={selectedAppointment} />
      )}
    </>
  );
};

export default AppointmentsPage;
