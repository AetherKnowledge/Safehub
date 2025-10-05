import Booking from "@/app/components/Appointments/Booking/Booking";
import { UserType } from "@/app/generated/prisma";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

const AppointmentPage = async () => {
  const session = await auth();
  if (!session || session.user.type !== UserType.Student)
    return redirect("/user/dashboard");

  return <Booking />;
};

export default AppointmentPage;
