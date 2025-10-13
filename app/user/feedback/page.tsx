import { UserType } from "@/app/generated/prisma";
import FeedbackPage from "@/app/pages/Feedback";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

const page = async () => {
  const session = await auth();
  if (!(session?.user.type === UserType.Counselor)) redirect("/user/dashboard");

  return <FeedbackPage />;
};

export default page;
