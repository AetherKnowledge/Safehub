"use client";

import { useState } from "react";
import { IoIosSearch } from "react-icons/io";
import SelectBox from "../../components/SelectBox";
import CounselorsTable from "./CounselorsTable";

const CounselorList = () => {
  const [name, setName] = useState<string | null>(null);

  return (
    <div className="flex flex-col min-h-0 h-full pt-6 bg-base-100 shadow-br rounded-xl">
      <div className="flex flex-row items-center justify-center gap-3 pr-5 pl-5">
        <label className="input w-full outline-none ring-0 focus-within:outline-none focus-within:ring-0">
          <IoIosSearch className="text-xl text-base-content" />
          <input
            type="text"
            className="grow text-base-content outline-none ring-0 focus:outline-none focus:ring-0"
            placeholder="Search users..."
            onChange={(e) => {
              setName(e.target.value.trim() || null);
            }}
          />
        </label>
        <SelectBox
          items={["All", "Online", "Offline"]}
          placeholder="Status"
          queryKey="status"
          defaultValue="All"
          className="w-[12vw] min-w-30"
        />
      </div>
      <CounselorsTable name={name ?? undefined} />
    </div>
  );
};

export default CounselorList;
