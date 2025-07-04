import React from "react";
import Sidebar from "@/app/components/Sidebar";

interface Props {
  children?: React.ReactNode;
}

const StudentLayout = ({ children }: Props) => {
  return (
    <div className="flex bg-base-200 min-h-screen p-10 gap-8">
      {/* Resizable Floating Sidebar */}
      <div className="pt-25">
        <Sidebar />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 pt-25">
        <div className="bg-base-100 shadow-br rounded-xl">{children}</div>
      </div>
    </div>
  );
};

export default StudentLayout;
