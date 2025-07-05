import React from "react";
import StudentAppointmentPage from "@/app/components/Student/Appointments/AppointmentPage";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { UserType } from "@/app/generated/prisma";
import { redirect } from "next/navigation";

const NewAppointmentsPage = async () => {
  const session = await getServerSession(authOptions);
  if (!session || session.user.type !== UserType.Student)
    return redirect("/user/dashboard");

  return <StudentAppointmentPage />;
};

export default NewAppointmentsPage;
