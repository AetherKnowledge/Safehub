"use client";
import SelectBox from "@/app/components/Input/SelectBox";
import { useState } from "react";
import { IoIosSearch } from "react-icons/io";
import UsersTable from "./UsersTable";

const RegisteredUsersTable = () => {
  const [name, setName] = useState<string | null>(null);

  return (
    <div className="flex flex-col flex-1 p-5 bg-base-100 shadow-br rounded-xl">
      <div className="flex flex-row items-center justify-center gap-3">
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
          items={["All", "Admin", "Counselor", "Student"]}
          placeholder="Role"
          queryKey="role"
          className="w-[12vw] min-w-30"
          defaultValue="All"
        />
        <SelectBox
          items={["All", "Online", "Offline"]}
          placeholder="Status"
          queryKey="status"
          defaultValue="All"
          className="w-[12vw] min-w-30"
        />
      </div>
      <UsersTable name={name ?? undefined} />
    </div>
  );
};

export default RegisteredUsersTable;
