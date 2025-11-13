import { UserType } from "@/app/generated/prisma";
import Onboarding from "@/app/pages/Onboarding/Onboarding";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { hasOnboarded } from "../pages/Onboarding/OnboardingActions";

const page = async () => {
  const session = await auth();
  if (session?.user?.type !== UserType.Student) {
    redirect("/user/dashboard");
  }
  if (await hasOnboarded()) {
    redirect("/user/dashboard");
  }

  return (
    <div className="flex bg-base-200 h-full w-full gap-3 overflow-y-hidden">
      <Onboarding />
    </div>
  );
};

export default page;
