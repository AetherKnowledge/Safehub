import AdminDashboard from "@/app/components/Admin/Dashboard/Dashboard";
import StudentDashboard from "@/app/components/Student/Dashboard/Dashboard";
import { UserType } from "@/app/generated/prisma";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

const UserDashboard = async () => {
  const session = await auth();
  if (!session) return;

  if (session.user.type === UserType.Student) return <StudentDashboard />;
  else if (session.user.type === UserType.Counselor)
    return <div>Not built</div>;
  else if (session.user.type === UserType.Admin) return <AdminDashboard />;
  else redirect("/login");
};

export default UserDashboard;
