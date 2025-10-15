"use client";

import { useRouter } from "next/navigation";
import {
  FaRegBookmark,
  FaRegCalendar,
  FaRegComment,
  FaRegHeart,
} from "react-icons/fa6";

import { HiSortAscending, HiSortDescending } from "react-icons/hi";
import { Order, SortBy } from "../../pages/Dashboard/Student/Dashboard";

type SorterProps = {
  sortBy?: SortBy;
  order?: Order;
};

const Sorter = ({ sortBy = SortBy.Date, order = Order.Desc }: SorterProps) => {
  const router = useRouter();

  const updateQuery = (newSortBy?: SortBy, newOrder?: Order) => {
    const params = new URLSearchParams(window.location.search);
    if (newSortBy) params.set("sortBy", newSortBy);
    if (newOrder) params.set("order", newOrder);
    router.push(`?${params.toString()}`);
  };

  const size = "w-5 h-5";
  const ascendingSize = "w-6 h-6";

  return (
    <div className="flex flex-row gap-2 bg-base-200 px-2 py-1 rounded my-1 items-center">
      <FaRegCalendar
        className={`${size} cursor-pointer ${
          sortBy === SortBy.Date ? "text-primary" : "text-base-content"
        }`}
        onClick={() => updateQuery(SortBy.Date, order)}
      />
      <FaRegHeart
        className={`${size} cursor-pointer ${
          sortBy === SortBy.Likes ? "text-primary" : "text-base-content"
        }`}
        onClick={() => updateQuery(SortBy.Likes, order)}
      />
      <FaRegBookmark className={`${size} cursor-pointer text-base-content`} />
      <FaRegComment
        className={`${size} cursor-pointer ${
          sortBy === SortBy.Comments ? "text-primary" : "text-base-content"
        }`}
        onClick={() => updateQuery(SortBy.Comments, order)}
      />

      <HiSortAscending
        className={`${ascendingSize} cursor-pointer ${
          order === Order.Asc ? "text-primary" : "text-base-content"
        }`}
        onClick={() => updateQuery(sortBy, Order.Asc)}
      />
      <HiSortDescending
        className={`${ascendingSize} cursor-pointer ${
          order === Order.Desc ? "text-primary" : "text-base-content"
        }`}
        onClick={() => updateQuery(sortBy, Order.Desc)}
      />
    </div>
  );
};

export default Sorter;
