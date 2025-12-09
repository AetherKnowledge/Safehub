import { UserType } from "@/app/generated/prisma/browser";
import Evaluation from "@/app/pages/Appointment/Evaluation";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

const page = async () => {
  const session = await auth();
  if (!(session?.user.type === UserType.Counselor)) redirect("/user/dashboard");

  return <Evaluation />;
};

export default page;
