import React from "react";
import Sidebar from "../components/Sidebar";

interface Props {
  children?: React.ReactNode;
}

const UserLayout = ({ children }: Props) => {
  return (
    <div className="flex bg-base-200 min-h-screen p-10 gap-8">
      {/* Resizable Floating Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1">
        <div className="bg-base-100 shadow-br rounded-xl">{children}</div>
      </div>
    </div>
  );
};

export default UserLayout;
