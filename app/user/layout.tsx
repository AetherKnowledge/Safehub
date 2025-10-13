import Sidebar from "@/app/components/Sidebar";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import UserNavbar from "../components/Navbar/UserNavbar";

interface Props {
  children?: React.ReactNode;
}

const Layout = async ({ children }: Props) => {
  // move this to middleware later
  const session = await auth();
  if (!session) {
    redirect("/api/auth/signin");
  }

  return (
    <div className="flex bg-base-200 h-full w-full p-6 gap-3 overflow-y-hidden">
      {/* Resizable Floating Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex flex-col flex-1 gap-3 h-full">
        <UserNavbar />
        {children}
      </div>
    </div>
  );
};

export default Layout;
