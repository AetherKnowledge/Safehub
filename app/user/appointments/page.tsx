import StudentAppointmentPage from "@/app/components/Student/Appointments/AppointmentPage";
import { UserType } from "@/app/generated/prisma";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

type Props = {
  searchParams: Promise<{ date?: string }>;
};

const NewAppointmentsPage = async ({ searchParams }: Props) => {
  const session = await auth();
  if (!session || session.user.type !== UserType.Student)
    return redirect("/user/dashboard");

  const dateParam = (await searchParams).date;
  const today = new Date().toISOString().split("T")[0];
  const date = dateParam && isValidDate(dateParam) ? dateParam : today;

  return <StudentAppointmentPage date={date} />;
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
