"use client";

import SelectBox from "@/app/components/Input/SelectBox";
import UserImage from "@/app/components/UserImage";
import { UserType } from "@/app/generated/prisma";
import { UpdateUserTypeData } from "@/lib/schemas";
import { AnimatePresence, motion } from "framer-motion";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { getUsers, updateUserType, UserWithStatus } from "./UsersActions";

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

  const [allUsers, setAllUsers] = useState<UserWithStatus[]>([]);
  const [users, setUsers] = useState<UserWithStatus[]>([]);
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
    const users = await getUsers();
    setAllUsers(users);
  }

  async function changeRole(userId: string, newRole: UserType) {
    try {
      await updateUserType({ id: userId, type: newRole } as UpdateUserTypeData);
    } catch (error) {
      console.error("Failed to update user role:", error);
      return;
    }

    await refreshUsers();
  }

  return (
    <div className="flex w-full h-full overflow-x-auto items-start justify-start">
      {loading ? (
        <div className="flex flex-col items-center justify-center space-y-4 w-full h-full">
          <div className="loading loading-spinner loading-lg text-primary"></div>
          <p className="text-base-content">Loading registered counselors...</p>
        </div>
      ) : users.length === 0 ? (
        <p className="flex text-center text-base-content/70 w-full h-full justify-center items-center">
          No registered users available.
        </p>
      ) : (
        <table className="table w-full">
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
                  <td>
                    <div className="flex items-center gap-4">
                      <UserImage name={user.name} src={user.image} width={10} />
                      <div className="font-medium">{user.name}</div>
                    </div>
                  </td>
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
      )}
    </div>
  );
};

function filterUsers(
  users: UserWithStatus[],
  role?: string,
  status?: string,
  name?: string
) {
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
