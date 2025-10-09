import { UserType } from "@/app/generated/prisma";
import {
  getAppointments,
  getAppointmentsForDateRange,
} from "../Appointments/AppointmentTable/AppointmentsActions";
import AppointmentsTable from "../Appointments/AppointmentTable/AppointmentsTable";
import WeeklyCalendar from "../Appointments/WeeklyCalendar";
import { getWeekDates } from "../Appointments/WeeklyCalendar/WeeklyCalendarUtils";
import AppointmentHeader from "./AppointmentHeader";

export enum ViewMode {
  LIST = "list",
  CALENDAR = "calendar",
}

const AppointmentsPage = async ({
  date,
  viewMode,
  showAll,
}: {
  date: string;
  viewMode: ViewMode;
  showAll: boolean;
}) => {
  const weekDates = getWeekDates(new Date(date));
  const appointments = showAll
    ? await getAppointments()
    : await getAppointmentsForDateRange(
        weekDates[0],
        weekDates[weekDates.length - 1]
      );

  return (
    <div className="bg-base-100 shadow-br rounded-lg">
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
  );
};

export default AppointmentsPage;
