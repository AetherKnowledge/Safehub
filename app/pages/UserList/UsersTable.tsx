"use client";

import SelectBoxOld from "@/app/components/Input/SelectBoxOld";
import { usePopup } from "@/app/components/Popup/PopupProvider";
import UserImage from "@/app/components/UserImage";
import { UserType } from "@/app/generated/prisma";
import { UpdateUserTypeData } from "@/lib/schemas";
import { AnimatePresence, motion } from "framer-motion";
import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
  changeUserDeactivationStatus,
  deleteUser,
  getUsers,
  updateUserType,
  UserWithStatus,
} from "./UsersActions";

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
  const session = useSession();
  const statusPopup = usePopup();
  const searchParams = useSearchParams();
  const roleFilter = searchParams.get("role") ?? undefined;
  const statusFilter = searchParams.get("status") ?? undefined;

  const [allUsers, setAllUsers] = useState<UserWithStatus[]>([]);
  const [users, setUsers] = useState<UserWithStatus[]>([]);
  const [loading, setLoading] = useState(true);

  async function handleDeleteUser(userId: string) {
    const confirmed = await statusPopup.showYesNo(
      "Are you sure you want to delete this user?"
    );
    if (!confirmed) return;

    statusPopup.showLoading("Deleting user...");
    const result = await deleteUser(userId);
    if (!result.success) {
      statusPopup.showError(
        `Failed to delete user. ${result.message ?? ""}`.trim()
      );
      return;
    }

    statusPopup.showSuccess("User deleted successfully!");

    await refreshUsers();
  }

  async function handleChangeActivation(userId: string, deactivate: boolean) {
    const confirmed = await statusPopup.showYesNo(
      `Are you sure you want to ${
        deactivate ? "deactivate" : "activate"
      } this user?`
    );
    if (!confirmed) return;

    statusPopup.showLoading(
      `${deactivate ? "Deactivating" : "Activating"} user...`
    );
    const result = await changeUserDeactivationStatus(userId, deactivate);
    if (!result.success) {
      statusPopup.showError(
        `Failed to ${deactivate ? "deactivate" : "activate"} user. ${
          result.message ?? ""
        }`.trim()
      );
      return;
    }

    statusPopup.showSuccess(
      `User ${deactivate ? "deactivated" : "activated"} successfully!`
    );
    await refreshUsers();
  }

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
    statusPopup.showLoading("Updating user role...");
    const result = await updateUserType({
      id: userId,
      type: newRole,
    } as UpdateUserTypeData);
    if (!result.success) {
      statusPopup.showError(
        `Failed to update user role. ${result.message ?? ""}`.trim()
      );
    } else statusPopup.showSuccess("User role updated successfully!");

    await refreshUsers();
  }

  return (
    <div className="flex w-full h-full items-start justify-start">
      {loading ? (
        <div className="flex flex-col items-center justify-center space-y-4 w-full h-full min-h-[400px]">
          <div className="loading loading-spinner loading-lg text-primary"></div>
          <p className="text-base-content/70">Loading registered users...</p>
        </div>
      ) : users.length === 0 ? (
        <div className="flex flex-col items-center justify-center w-full h-full min-h-[400px] gap-3">
          <div className="text-6xl text-base-content/20">👥</div>
          <p className="text-center text-base-content/70 text-lg font-medium">
            No registered users found
          </p>
          <p className="text-center text-base-content/50 text-sm">
            Try adjusting your search filters
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto w-full">
          <table className="table w-full">
            <thead className="sticky top-0 z-10 bg-base-200/80 backdrop-blur-sm">
              <tr className="text-base-content border-b border-base-content/10">
                <th className="font-semibold text-left">User</th>
                <th className="font-semibold text-center">Role</th>
                <th className="font-semibold text-left">Email</th>
                <th className="font-semibold text-center">Status</th>
                <th className="font-semibold text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="text-base-content">
              <AnimatePresence mode="sync">
                {users.map((user) => (
                  <motion.tr
                    key={user.id}
                    layout
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{
                      opacity: 0,
                      x: -10,
                      transition: { duration: 0.2 },
                    }}
                    transition={{ duration: 0.3 }}
                    className="hover:bg-base-200/50 transition-colors border-b border-base-content/5"
                  >
                    <td className="py-4">
                      <div className="flex items-center gap-4">
                        <div className="relative">
                          <UserImage
                            name={user.name || user.email.split("@")[0]}
                            src={user.image}
                            width={12}
                          />
                          {user.status === "Online" && (
                            <div className="absolute bottom-0 right-0 w-3 h-3 bg-success rounded-full border-2 border-base-100"></div>
                          )}
                        </div>
                        <div>
                          <div className="font-semibold text-base">
                            {user.name || user.email.split("@")[0]}
                          </div>
                          {user.deactivated && (
                            <span className="text-xs text-warning font-medium">
                              Deactivated
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="py-4">
                      <div className="flex justify-center">
                        <SelectBoxOld
                          items={Object.keys(UserType).sort()}
                          placeholder={user.type}
                          className="w-32 font-medium"
                          defaultValue={user.type}
                          colorMap={roleColorMap}
                          borderColor="border-transparent"
                          padding="pl-2 pr-2 py-1.5 w-full"
                          onSelect={(item) => {
                            changeRole(user.id, item as UserType);
                          }}
                          disabled={user.id === session.data?.user?.id}
                        />
                      </div>
                    </td>
                    <td className="py-4">
                      <span className="text-base-content/80">{user.email}</span>
                    </td>
                    <td className="py-4">
                      <div className="flex justify-center">
                        <motion.span
                          key={`${user.id}-${user.status}`}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{
                            opacity: 1,
                            scale: 1,
                            backgroundColor: statusColorMap[user.status].bg,
                            color: statusColorMap[user.status].text,
                          }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          transition={{ duration: 0.3 }}
                          className="px-3 py-1.5 rounded-full text-xs font-semibold inline-block"
                        >
                          {user.status}
                        </motion.span>
                      </div>
                    </td>
                    <td className="py-4">
                      <div className="flex gap-2 items-center justify-center">
                        <button
                          className={`btn btn-sm ${
                            user.deactivated
                              ? "btn-primary btn-outline"
                              : "btn-warning btn-outline"
                          }
                          ${
                            user.id === session.data?.user?.id
                              ? "btn-disabled opacity-50"
                              : ""
                          }`}
                          onClick={() => {
                            if (user.id === session.data?.user?.id) return;
                            handleChangeActivation(user.id, !user.deactivated);
                          }}
                          disabled={user.id === session.data?.user?.id}
                        >
                          {user.deactivated ? "Activate" : "Deactivate"}
                        </button>
                        <button
                          className={`btn btn-sm btn-error btn-outline
                          ${
                            user.id === session.data?.user?.id
                              ? "btn-disabled opacity-50"
                              : ""
                          }`}
                          onClick={() => {
                            if (user.id === session.data?.user?.id) return;
                            handleDeleteUser(user.id);
                          }}
                          disabled={user.id === session.data?.user?.id}
                        >
                          Delete
                        </button>
                      </div>
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
      user.name.toLowerCase().includes(name.toLowerCase());

    return matchesRole && matchesStatus && matchesName;
  });
}

export default UsersTable;
