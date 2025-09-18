import CounselorList from "@/app/components/Student/Counselors/CounselorList";
import { UserType } from "@/app/generated/prisma";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

const CounselorsPage = async () => {
  const session = await auth();
  if (!session) return;

  return (
    <div className="flex-1">
      <div className="bg-base-100 shadow-br rounded-xl">
        {session.user.type === UserType.Student ? (
          <CounselorList />
        ) : session.user.type === UserType.Counselor ? (
          <div>Not built</div>
        ) : (
          redirect("/user/dashboard")
        )}
      </div>
    </div>
  );
};

export default CounselorsPage;
