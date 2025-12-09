import { UserType } from "@/app/generated/prisma/browser";
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
      ) : (
        redirect("/user/dashboard")
      )}
    </>
  );
};

export default CounselorsPage;
