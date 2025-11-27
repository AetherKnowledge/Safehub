"use client";

import { ReactNode } from "react";

const AiManagementTab = ({
  title,
  icon,
  groupName,
  defaultChecked = false,
  children,
}: {
  title: string;
  icon: ReactNode;
  groupName: string;
  defaultChecked?: boolean;
  children: ReactNode;
}) => {
  return (
    <>
      <label className="tab gap-2">
        <input
          type="radio"
          name={groupName}
          className="tab"
          defaultChecked={defaultChecked}
        />
        {icon}
        {title}
      </label>
      <div className="tab-content bg-gradient-to-br from-base-100 to-base-200/50 border-base-300 p-0 shadow-xl h-full min-h-0 overflow-hidden">
        <div className="flex flex-col h-full min-h-0">{children}</div>
      </div>
    </>
  );
};

export default AiManagementTab;
