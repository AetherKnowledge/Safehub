import Sidebar from "@/app/components/Sidebar";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import BottomBar from "../components/BottomBar/BottomBar";
import MoodTrackerPopup from "../components/MoodTracker";
import UserNavbar from "../components/Navbar/UserNavbar";
import { UserType } from "../generated/prisma";
import { hasOnboarded } from "../pages/Onboarding/OnboardingActions";

interface Props {
  children?: React.ReactNode;
}

const Layout = async ({ children }: Props) => {
  // move this to middleware later
  const session = await auth();
  if (!session) {
    redirect("/api/auth/signin");
  }
  if (
    session.user?.type === UserType.Student &&
    (await hasOnboarded()) === false
  ) {
    redirect("/onboarding");
  }

  return (
    <div className="flex bg-base-200 h-full w-full p-6 gap-3 overflow-y-hidden min-h-0">
      {/* Resizable Floating Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex flex-col flex-1 gap-3 h-full">
        <UserNavbar />
        {children}
        <BottomBar />
      </div>
      {!session.user.moodToday && session.user.type === UserType.Student && (
        <MoodTrackerPopup />
      )}
    </div>
  );
};

export default Layout;
