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
    <div className="flex flex-row items-center justify-center bg-neutral border border-transparent border-y-2 border-y-base-300/70 text-base-content text-center lg:text-lg">
      {children}
    </div>
  );
};

export default TableHeader;
