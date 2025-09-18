import StudentNewAppointmentPage from "@/app/components/Student/Appointments/NewAppointmentPage";
import { UserType } from "@/app/generated/prisma";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

const AppointmentPage = async () => {
  const session = await auth();
  if (!session || session.user.type !== UserType.Student)
    return redirect("/user/dashboard");

  return (
    <div className="flex-1">
      <div className="bg-base-100 shadow-br rounded-xl">
        <StudentNewAppointmentPage />
      </div>
    </div>
  );
};

export default AppointmentPage;
