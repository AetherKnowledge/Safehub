import React from "react";
import StudentDashboard from "@/app/components/Student/Dashboard/Dashboard";
import AdminDashboard from "@/app/components/Admin/Dashboard/Dashboard";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { UserType } from "@/app/generated/prisma";
import { redirect } from "next/navigation";

const UserDashboard = async () => {
  const session = await getServerSession(authOptions);
  if (!session) return;

  if (session.user.type === UserType.Student) return <StudentDashboard />;
  else if (session.user.type === UserType.Counselor)
    return <div>Not built</div>;
  else if (session.user.type === UserType.Admin) return <AdminDashboard />;
  else redirect("/user/dashboard");
};

export default UserDashboard;
