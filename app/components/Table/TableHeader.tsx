"use client";
import { ReactNode } from "react";

export type HeaderItem = {
  content: ReactNode;
  hasSort?: boolean;
  sortKey?: string;
};

export type TableHeaderItem = HeaderItem | ReactNode;

const TableHeader = ({ children }: { children: ReactNode }) => {
  return (
    <div className="flex flex-row items-center justify-center bg-gradient-to-r from-base-200 to-base-300/50 border-b-2 border-base-content/10 text-base-content text-center lg:text-lg font-semibold">
      {children}
    </div>
  );
};

export default TableHeader;
