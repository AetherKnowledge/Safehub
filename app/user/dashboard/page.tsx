import React from "react";
import StudentDashboard from "@/app/components/Student/Dashboard/Dashboard";
import AdminDashboard from "@/app/components/Admin/Dashboard/Dashboard";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { UserType } from "@/app/generated/prisma";

const UserDashboard = async () => {
  const session = await getServerSession(authOptions);
  if (!session) return;

  if (session.user.type === UserType.student) return <StudentDashboard />;
  else if (session.user.type === UserType.counselor)
    return <div>Not built</div>;
  else if (session.user.type === UserType.admin) return <AdminDashboard />;
  else return <div>Unknown user type</div>;
};

export default UserDashboard;
