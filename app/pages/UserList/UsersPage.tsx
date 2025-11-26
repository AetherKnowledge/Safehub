"use client";
import SelectBoxOld from "@/app/components/Input/SelectBoxOld";
import { useState } from "react";
import { HiUsers } from "react-icons/hi2";
import { IoIosSearch } from "react-icons/io";
import UsersTable from "./UsersTable";

const RegisteredUsersTable = () => {
  const [name, setName] = useState<string | null>(null);

  return (
    <div className="flex flex-col flex-1 min-h-0 gap-4">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent p-6 rounded-xl shadow-md border border-base-content/5">
        <div className="flex items-center gap-3">
          <div className="w-1 h-8 bg-primary rounded-full"></div>
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <HiUsers className="text-primary" />
              User Management
            </h1>
            <p className="text-sm text-base-content/70">
              Manage user accounts, roles, and permissions
            </p>
          </div>
        </div>
      </div>

      {/* Main Content Card */}
      <div className="flex flex-col flex-1 bg-gradient-to-br from-base-100 to-base-200/50 shadow-xl rounded-xl border border-base-content/5 overflow-hidden min-h-0">
        {/* Search and Filters */}
        <div className="p-5 border-b border-base-content/5 bg-base-100/50">
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <label className="input input-bordered flex items-center gap-2 w-full sm:flex-1 bg-base-100 focus-within:ring-2 focus-within:ring-primary/20 transition-all">
              <IoIosSearch className="text-xl text-base-content/70" />
              <input
                type="text"
                className="grow text-base-content outline-none"
                placeholder="Search by name..."
                onChange={(e) => {
                  setName(e.target.value.trim() || null);
                }}
              />
            </label>
            <div className="flex gap-3 w-full sm:w-auto">
              <SelectBoxOld
                items={["All", "Admin", "Counselor", "Student"]}
                placeholder="Role"
                queryKey="role"
                className="w-full sm:w-[140px]"
                defaultValue="All"
              />
              <SelectBoxOld
                items={["All", "Online", "Offline"]}
                placeholder="Status"
                queryKey="status"
                defaultValue="All"
                className="w-full sm:w-[140px]"
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
