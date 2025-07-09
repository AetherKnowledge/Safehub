import AuthOptions from "@/app/components/AuthOptions";
import CounselorList from "@/app/components/Student/Counselors/CounselorList";
import { UserType } from "@/app/generated/prisma";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

const CounselorsPage = async () => {
  const session = await getServerSession(AuthOptions);
  if (!session) return;

  if (session.user.type === UserType.Student) return <CounselorList />;
  else if (session.user.type === UserType.Counselor)
    return <div>Not built</div>;
  else redirect("/user/dashboard");
};

export default CounselorsPage;
