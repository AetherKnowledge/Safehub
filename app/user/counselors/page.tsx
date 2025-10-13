import { UserType } from "@/app/generated/prisma";
import CounselorList from "@/app/pages/CounselorList/CounselorList";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

const CounselorsPage = async () => {
  const session = await auth();
  if (!session) return;

  return (
    <>
      {session.user.type === UserType.Student ? (
        <CounselorList />
      ) : session.user.type === UserType.Counselor ? (
        <div>Not built</div>
      ) : (
        redirect("/user/dashboard")
      )}
    </>
  );
};

export default CounselorsPage;
