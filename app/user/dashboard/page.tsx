import AdminDashboard from "@/app/components/Admin/Dashboard/Dashboard";
import StudentDashboard from "@/app/components/Student/Dashboard/Dashboard";
import { UserType } from "@/app/generated/prisma";
import authOptions from "@/lib/auth/authOptions";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

const UserDashboard = async () => {
  const session = await getServerSession(authOptions);
  if (!session) return;

  if (session.user.type === UserType.Student) return <StudentDashboard />;
  else if (session.user.type === UserType.Counselor)
    return <div>Not built</div>;
  else if (session.user.type === UserType.Admin) return <AdminDashboard />;
  else redirect("/login");
};

export default UserDashboard;
