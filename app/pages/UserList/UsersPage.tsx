"use client";
import SelectBoxOld from "@/app/components/Input/SelectBoxOld";
import { useState } from "react";
import { IoIosSearch } from "react-icons/io";
import UsersTable from "./UsersTable";

const RegisteredUsersTable = () => {
  const [name, setName] = useState<string | null>(null);

  return (
    <div className="flex flex-col flex-1 min-h-0 gap-4">
      {/* Main Content Card */}
      <div className="flex flex-col flex-1 bg-linear-to-br from-base-100 to-base-200/50 shadow-xl rounded-xl border border-base-content/5 overflow-hidden min-h-0">
        {/* Search and Filters */}
        <div className="p-3 md:p-5 border-b border-base-content/5 bg-base-100/50">
          <div className="flex flex-row gap-2 md:gap-3">
            <label className="input input-sm md:input-md input-bordered flex items-center gap-2 w-full bg-base-100 focus-within:ring-2 focus-within:ring-primary/20 transition-all">
              <IoIosSearch className="text-lg md:text-xl text-base-content/70" />
              <input
                type="text"
                className="grow text-base-content outline-none text-sm md:text-base"
                placeholder="Search by name..."
                onChange={(e) => {
                  setName(e.target.value.trim() || null);
                }}
              />
            </label>
            <div className="flex gap-2 md:gap-3 w-full">
              <SelectBoxOld
                items={["All", "Admin", "Counselor", "Student"]}
                placeholder="Role"
                queryKey="role"
                className="flex-1 md:w-[140px]"
                defaultValue="All"
              />
              <SelectBoxOld
                items={["All", "Online", "Offline"]}
                placeholder="Status"
                queryKey="status"
                defaultValue="All"
                className="flex-1 md:w-[140px]"
              />
            </div>
          </div>
        </div>

        {/* Table Content */}
        <div className="flex-1 overflow-auto min-h-0">
          <UsersTable name={name ?? undefined} />
        </div>
      </div>
    </div>
  );
};

export default RegisteredUsersTable;
