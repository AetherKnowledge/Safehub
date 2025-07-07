import React from "react";
import StudentNewAppointmentPage from "@/app/components/Student/Appointments/NewAppointmentPage";
import { getServerSession } from "next-auth";
import AuthOptions from "@/app/components/AuthOptions";
import { UserType } from "@/app/generated/prisma";
import { redirect } from "next/navigation";

const AppointmentPage = async () => {
  const session = await getServerSession(AuthOptions);
  if (!session || session.user.type !== UserType.Student)
    return redirect("/user/dashboard");

  return <StudentNewAppointmentPage />;
};

export default AppointmentPage;
