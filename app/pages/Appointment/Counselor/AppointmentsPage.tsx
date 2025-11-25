import { UserType } from "@/app/generated/prisma";
import {
  getAppointments,
  getAppointmentsForDateRange,
} from "../AppointmentActions";
import AppointmentsTable from "../AppointmentTable";
import { ViewModalPopup } from "../AppointmentTable/ViewModal";
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
  showAll,
  appointmentId,
}: {
  date: string;
  viewMode: ViewMode;
  showAll: boolean;
  appointmentId?: string;
}) => {
  const weekDates = getWeekDates(new Date(date));
  const appointments = showAll
    ? await getAppointments()
    : await getAppointmentsForDateRange(
        weekDates[0],
        weekDates[weekDates.length - 1]
      );

  const selectedAppointment = appointmentId
    ? appointments.find((appt) => appt.id === appointmentId)
    : null;

  return (
    <>
      <div className="flex flex-col bg-base-100 shadow-br rounded-lg gap-3 flex-1 min-h-0">
        <AppointmentHeader />
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
      {selectedAppointment && (
        <ViewModalPopup appointment={selectedAppointment} />
      )}
    </>
  );
};

export default AppointmentsPage;
