import StudentDashboard from "@/app/pages/Dashboard/Student";
import { Order, SortBy } from "@/app/pages/Dashboard/Student/Dashboard";
import { auth } from "@/auth";

type Props = { searchParams: Promise<{ sortBy?: SortBy; order?: Order }> };

const UserDashboard = async ({ searchParams }: Props) => {
  const session = await auth();
  if (!session) return;
  return <StudentDashboard searchParams={await searchParams} />;

  // if (session.user.type === UserType.Student) return <StudentDashboard />;
  // else if (session.user.type === UserType.Counselor)
  //   return <div>Not built</div>;
  // else if (session.user.type === UserType.Admin) return <AdminDashboard />;
  // else redirect("/login");
};

export default UserDashboard;
