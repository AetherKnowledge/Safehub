import { UserType } from "@/app/generated/prisma/browser";
import Forms from "@/app/pages/Forms";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

const page = async () => {
  const session = await auth();
  if (!session?.user?.type || session.user.type !== UserType.Admin) {
    redirect("/user/dashboard");
  }

  return <Forms />;
};

export default page;
