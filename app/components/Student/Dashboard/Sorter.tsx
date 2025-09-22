"use client";

import { useRouter } from "next/navigation";
import {
  FaRegBookmark,
  FaRegCalendar,
  FaRegComment,
  FaRegHeart,
} from "react-icons/fa6";

import { HiSortAscending, HiSortDescending } from "react-icons/hi";
import { Order, SortBy } from "./Dashboard";

type SorterProps = {
  sortBy?: SortBy;
  order?: Order;
};

const Sorter = ({ sortBy, order }: SorterProps) => {
  const router = useRouter();

  const updateQuery = (newSortBy?: SortBy, newOrder?: Order) => {
    const params = new URLSearchParams(window.location.search);
    if (newSortBy) params.set("sortBy", newSortBy);
    if (newOrder) params.set("order", newOrder);
    router.push(`?${params.toString()}`);
  };

  return (
    <>
      <FaRegCalendar
        className={`w-4 h-4 cursor-pointer ${
          sortBy === SortBy.Date ? "text-primary" : "text-base-content"
        }`}
        onClick={() => updateQuery(SortBy.Date, order)}
      />
      <FaRegHeart
        className={`w-4 h-4 cursor-pointer ${
          sortBy === SortBy.Likes ? "text-primary" : "text-base-content"
        }`}
        onClick={() => updateQuery(SortBy.Likes, order)}
      />
      <FaRegBookmark className={`w-4 h-4 cursor-pointer text-base-content`} />
      <FaRegComment
        className={`w-4 h-4 cursor-pointer ${
          sortBy === SortBy.Comments ? "text-primary" : "text-base-content"
        }`}
        onClick={() => updateQuery(SortBy.Comments, order)}
      />

      <HiSortAscending
        className={`w-5 h-5 cursor-pointer ${
          order === Order.Asc ? "text-primary" : "text-base-content"
        }`}
        onClick={() => updateQuery(sortBy, Order.Asc)}
      />
      <HiSortDescending
        className={`w-5 h-5 cursor-pointer ${
          order === Order.Desc ? "text-primary" : "text-base-content"
        }`}
        onClick={() => updateQuery(sortBy, Order.Desc)}
      />
    </>
  );
};

export default Sorter;
