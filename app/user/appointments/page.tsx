import AppointmentsPage, {
  ViewMode,
} from "@/app/components/Counselors/AppointmentsPage";
import StudentAppointmentPage from "@/app/components/Student/Appointments/AppointmentPage";
import { UserType } from "@/app/generated/prisma";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

type Props = {
  searchParams: Promise<{ date?: string; view?: string; showAll?: string }>;
};

const NewAppointmentsPage = async ({ searchParams }: Props) => {
  const session = await auth();
  if (!session) return redirect("/user/dashboard");

  const params = await searchParams;

  const dateParam = params.date;
  const today = new Date().toLocaleDateString();
  const date = dateParam && isValidDate(dateParam) ? dateParam : today;

  const viewParam = params.view;
  const view = viewParam === ViewMode.LIST ? ViewMode.LIST : ViewMode.CALENDAR;

  const showAll = params.showAll === "true";

  if (session.user.type === UserType.Student)
    return <StudentAppointmentPage date={date} />;
  else if (session.user.type === UserType.Counselor)
    return <AppointmentsPage date={date} viewMode={view} showAll={showAll} />;
};

function isValidDate(dateString: string): boolean {
  // Must match YYYY-MM-DD
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  if (!regex.test(dateString)) return false;

  const date = new Date(dateString);
  const timestamp = date.getTime();

  // Invalid date object
  if (isNaN(timestamp)) return false;

  // Ensure parsed date matches input (avoids things like 2025-02-31 → 2025-03-03)
  return date.toISOString().startsWith(dateString);
}

export default NewAppointmentsPage;
