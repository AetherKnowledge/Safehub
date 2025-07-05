"use client";

import React, { useEffect, useState } from "react";
import { User, UserType } from "@/app/generated/prisma";
import { motion, AnimatePresence } from "framer-motion";
import { useSearchParams } from "next/navigation";
import { IoIosArrowDropdown } from "react-icons/io";
import SelectBox from "../../SelectBox";

const statusColorMap = {
  Online: { bg: "#d1fae5", text: "#047857" }, // green
  Offline: { bg: "#fee2e2", text: "#b91c1c" }, // red
  Busy: { bg: "#fef9c3", text: "#92400e" }, // yellow
};

const roleColorMap = {
  Admin: { bg: "bg-blue-100", text: "text-blue-900" }, // Tailwind equivalent of #dbeafe / #1e40af
  Counselor: { bg: "bg-sky-100", text: "text-sky-600" }, // Tailwind equivalent of #e0f2fe / #0284c7
  Student: { bg: "bg-purple-100", text: "text-purple-700" }, // Tailwind equivalent of #f3e8ff / #7c3aed
};

const UsersTable = ({ name }: { name?: string }) => {
  const searchParams = useSearchParams();
  const roleFilter = searchParams.get("role") ?? undefined;
  const statusFilter = searchParams.get("status") ?? undefined;

  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    refreshUsers().then(() => setLoading(false));

    const interval = setInterval(() => {
      if (navigator.onLine && document.visibilityState === "visible") {
        refreshUsers();
      }
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const filtered = filterUsers(allUsers, roleFilter, statusFilter, name);
    setUsers(filtered);
  }, [roleFilter, statusFilter, allUsers, name]);

  async function refreshUsers() {
    const res = await fetch("/api/user/admin/users");
    const data = await res.json();

    if (!res.ok) {
      console.error("Failed to fetch users:", data);
      return;
    }

    setAllUsers(data);
  }

  async function changeRole(userId: string, newRole: UserType) {
    const res = await fetch("/api/user/admin/users", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: userId,
        type: newRole,
      }),
    });

    const result = await res.json();
    if (!res.ok) {
      console.error("Failed to update user role:", result);
      return;
    }
  }

  return (
    <div className="w-full flex-1 overflow-y-auto p-5 pt-0">
      {loading ? (
        <div className="flex flex-col items-center justify-center h-full space-y-4">
          <div className="loading loading-spinner loading-lg text-primary"></div>
          <p className="text-base-content">Loading registered users...</p>
        </div>
      ) : users.length === 0 ? (
        <p className="text-center text-gray-500">
          No registered users available.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="table table-fixed w-full">
            <thead className="text-center text-base-content">
              <tr>
                <th>Name</th>
                <th>Role</th>
                <th>Email</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody className="text-base-content text-center">
              <AnimatePresence mode="sync">
                {users.map((user) => (
                  <motion.tr
                    key={user.id}
                    layout
                    initial={{ opacity: 0, scaleY: 0 }}
                    animate={{ opacity: 1, scaleY: 1 }}
                    exit={{
                      opacity: 0,
                      scaleY: 0,
                      transition: { duration: 0.3 },
                    }}
                    transition={{ duration: 0.3 }}
                    className="origin-top"
                  >
                    <td>{user.name}</td>
                    <td>
                      <div className="flex justify-center">
                        <SelectBox
                          items={Object.keys(UserType).sort()}
                          placeholder={user.type}
                          className="w-30 font-medium"
                          defaultValue={user.type}
                          colorMap={roleColorMap}
                          borderColor="border-transparent"
                          padding="pl-1 pr-2 py-1 w-full"
                          onSelect={(item) => {
                            changeRole(user.id, item as UserType);
                          }}
                        />
                      </div>
                    </td>
                    <td>{user.email}</td>
                    <td>
                      {
                        <motion.span
                          key={`${user.id}-${user.status}`}
                          initial={{ opacity: 0 }}
                          animate={{
                            opacity: 1,
                            backgroundColor: statusColorMap[user.status].bg,
                            color: statusColorMap[user.status].text,
                          }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="px-3 py-1 rounded-full text-sm font-medium"
                        >
                          {user.status}
                        </motion.span>
                      }
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

function filterUsers(
  users: User[],
  role?: string,
  status?: string,
  name?: string
) {
  if (!role && !status) return users;

  return users.filter((user) => {
    const matchesRole =
      !role ||
      role === "All" ||
      user.type.toString().toUpperCase() === role.toUpperCase();
    const matchesStatus =
      !status ||
      status === "All" ||
      user.status.toString().toUpperCase() === status.toUpperCase();
    const matchesName =
      !name ||
      !user.name ||
      user.name.toLowerCase().startsWith(name.toLowerCase());

    return matchesRole && matchesStatus && matchesName;
  });
}

export default UsersTable;
