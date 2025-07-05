"use client";

import React, { useEffect, useState } from "react";
import { User } from "@/app/generated/prisma";
import { motion, AnimatePresence } from "framer-motion";
import { useSearchParams } from "next/navigation";

const statusColorMap = {
  Online: { bg: "#d1fae5", text: "#047857" }, // green
  Offline: { bg: "#fee2e2", text: "#b91c1c" }, // red
  Busy: { bg: "#fef9c3", text: "#92400e" }, // yellow
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
                    <td>{user.type}</td>
                    <td>{user.email}</td>
                    <td>
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
