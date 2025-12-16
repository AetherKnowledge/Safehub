"use client";

import { useState } from "react";
import { IoIosSearch } from "react-icons/io";
import SelectBoxOld from "../../components/Input/SelectBoxOld";
import CounselorsTable from "./CounselorsTable";

const CounselorList = () => {
  const [name, setName] = useState<string | null>(null);

  return (
    <div className="flex flex-col flex-1 gap-4 min-h-0">
      {/* Header Section */}
      <div className="bg-linear-to-r from-primary/10 via-primary/5 to-transparent p-6 rounded-xl shadow-md border border-base-content/5">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-1 h-8 bg-primary rounded-full"></div>
          <div>
            <h1 className="text-2xl font-bold">Counselor Directory</h1>
            <p className="text-sm text-base-content/70">
              Browse and connect with our professional counselors
            </p>
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mt-4">
          <div className="flex-1 relative">
            <label className="input input-bordered flex items-center gap-2 bg-base-100 border-base-content/10 focus-within:border-primary transition-colors shadow-sm hover:shadow-md">
              <IoIosSearch className="text-xl text-base-content/60" />
              <input
                type="text"
                className="grow text-base-content outline-none ring-0 focus:outline-none focus:ring-0"
                placeholder="Search counselors by name..."
                onChange={(e) => {
                  setName(e.target.value.trim() || null);
                }}
              />
            </label>
          </div>
          <SelectBoxOld
            items={["All", "Online", "Offline"]}
            placeholder="Status"
            queryKey="status"
            defaultValue="All"
            className="w-full sm:w-[200px] min-w-30"
          />
        </div>
      </div>

      {/* Table Container */}
      <div className="flex-1 bg-linear-to-br from-base-100 to-base-200/50 shadow-xl rounded-xl min-h-0 border border-base-content/5 overflow-hidden">
        <CounselorsTable name={name ?? undefined} />
      </div>
    </div>
  );
};

export default CounselorList;
