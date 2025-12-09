import { UserType } from "@/app/generated/prisma/browser";
import AdminDashboard from "@/app/pages/Dashboard/Admin/Dashboard";
import CounselorDashboard from "@/app/pages/Dashboard/Counselor/Dashboard";
import StudentDashboard from "@/app/pages/Dashboard/Student";
import { Order, SortBy } from "@/app/pages/Dashboard/Student/Dashboard";
import { auth } from "@/auth";

type Props = { searchParams: Promise<{ sortBy?: SortBy; order?: Order }> };

const UserDashboard = async ({ searchParams }: Props) => {
  const session = await auth();
  if (!session) return;
  return (
    <>
      {session?.user.type === UserType.Admin ? (
        <AdminDashboard />
      ) : session?.user.type === UserType.Counselor ? (
        <CounselorDashboard searchParams={await searchParams} />
      ) : (
        <StudentDashboard searchParams={await searchParams} />
      )}
    </>
  );
};

export default UserDashboard;
