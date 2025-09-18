import Sidebar from "@/app/components/Sidebar";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import UserNavbar from "../components/Navbar/UserNavbar";

interface Props {
  children?: React.ReactNode;
}

const Layout = async ({ children }: Props) => {
  const session = await auth();

  if (!session || !session.user) {
    // Redirect to login page if not authenticated
    redirect(`/api/auth/signin`);
  }

  return (
    <div className="flex bg-base-200 min-h-screen p-6 gap-6">
      {/* Resizable Floating Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex flex-col flex-1 gap-6">
        <UserNavbar />
        {children}
      </div>
    </div>
  );
};

export default Layout;
