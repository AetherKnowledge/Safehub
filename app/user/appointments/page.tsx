import { UserType } from "@/app/generated/prisma/browser";
import AppointmentsPage, {
  ViewMode,
} from "@/app/pages/Appointment/Counselor/AppointmentsPage";
import StudentAppointmentPage from "@/app/pages/Appointment/Student";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

type Props = {
  searchParams: Promise<{
    date?: string;
    view?: string;
    showAll?: string;
    appointmentId?: string;
    status?: string;
  }>;
};

const NewAppointmentsPage = async ({ searchParams }: Props) => {
  const session = await auth();
  if (!session) return redirect("/user/dashboard");

  const params = await searchParams;

  const dateParam = params.date;
  const today = new Date().toLocaleDateString();
  const date = dateParam && isValidDate(dateParam) ? dateParam : today;

  const viewParam = params.view;
  const view =
    viewParam === ViewMode.CALENDAR ? ViewMode.CALENDAR : ViewMode.LIST;

  const status = params.status;

  const showAll = params.showAll ? params.showAll === "true" : true;

  const appointmentId = params.appointmentId;

  console.log("Show All:", showAll);

  if (session.user.type === UserType.Student)
    return (
      <StudentAppointmentPage appointmentId={appointmentId} status={status} />
    );
  else if (session.user.type === UserType.Counselor)
    return (
      <AppointmentsPage
        date={date}
        viewMode={view}
        appointmentId={appointmentId}
        status={status}
      />
    );
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
