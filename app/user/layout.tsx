import Sidebar from "@/app/components/Sidebar";
import UserNavbar from "../components/Navbar/UserNavbar";

interface Props {
  children?: React.ReactNode;
}

const Layout = async ({ children }: Props) => {
  return (
    <div className="flex bg-base-200 min-h-screen p-6 pt-0 gap-6">
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
