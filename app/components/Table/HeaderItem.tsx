"use client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { FaChevronDown } from "react-icons/fa";

import { Order } from "@/app/pages/Dashboard/Student/Dashboard";
import React from "react";
import { FaChevronUp } from "react-icons/fa6";

const HeaderItem = ({
  sortKey,
  children,
}: {
  sortKey?: string;
  children: React.ReactNode;
}) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathName = usePathname();

  const [currentSort, setCurrentSort] = React.useState<string | null>(null);
  const [currentOrder, setCurrentOrder] = React.useState<string | null>(null);

  React.useEffect(() => {
    setCurrentSort(searchParams.get("sortBy"));
    setCurrentOrder(searchParams.get("order"));
    console.log("Updated sort params:", {
      sortBy: searchParams.get("sortBy"),
      order: searchParams.get("order"),
    });
  }, [searchParams]);

  return (
    <div className="flex flex-row items-center justify-center w-full p-4 text-sm font-semibold">
      {children}
      {sortKey && (
        <span
          className="ml-2 cursor-pointer text-base-content/70 hover:text-base-content"
          onClick={() => {
            if (!sortKey) return;
            const newOrder =
              currentSort === sortKey && currentOrder === Order.Asc
                ? Order.Desc
                : Order.Asc;
            const params = new URLSearchParams(searchParams.toString());
            params.set("sortBy", sortKey);
            params.set("order", newOrder);
            router.push(`${pathName}?${params.toString()}`);
          }}
        >
          <button className="btn btn-ghost p-1 h-6">
            {sortKey ? (
              currentOrder === Order.Asc ? (
                <FaChevronUp />
              ) : (
                <FaChevronDown />
              )
            ) : null}
          </button>
        </span>
      )}
    </div>
  );
};

export default HeaderItem;
