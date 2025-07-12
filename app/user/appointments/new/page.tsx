import StudentNewAppointmentPage from "@/app/components/Student/Appointments/NewAppointmentPage";
import { UserType } from "@/app/generated/prisma";
import authOptions from "@/lib/auth/authOptions";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

const AppointmentPage = async () => {
  const session = await getServerSession(authOptions);
  if (!session || session.user.type !== UserType.Student)
    return redirect("/user/dashboard");

  return <StudentNewAppointmentPage />;
};

export default AppointmentPage;
