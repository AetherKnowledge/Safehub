import StudentAppointmentPage from "@/app/components/Student/Appointments/AppointmentPage";
import { UserType } from "@/app/generated/prisma";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

const NewAppointmentsPage = async () => {
  const session = await auth();
  if (!session || session.user.type !== UserType.Student)
    return redirect("/user/dashboard");

  return (
    <div className="flex-1">
      <div className="bg-base-100 shadow-br rounded-xl">
        <StudentAppointmentPage />
      </div>
    </div>
  );
};

export default NewAppointmentsPage;
