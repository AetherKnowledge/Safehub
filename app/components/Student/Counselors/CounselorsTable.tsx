"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { CounselorData, getCounselors } from "./CounselorsActions";

const statusColorMap = {
  Online: { bg: "#d1fae5", text: "#047857" }, // green
  Offline: { bg: "#fee2e2", text: "#b91c1c" }, // red
  Busy: { bg: "#fef9c3", text: "#92400e" }, // yellow
};

const CounselorList = ({ name }: { name?: string }) => {
  const searchParams = useSearchParams();
  const roleFilter = searchParams.get("role") ?? undefined;
  const statusFilter = searchParams.get("status") ?? undefined;

  const [allCounselors, setAllCounselors] = useState<CounselorData[]>([]);
  const [counselors, setCounselors] = useState<CounselorData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    refreshCounselors().then(() => setLoading(false));

    const interval = setInterval(() => {
      if (navigator.onLine && document.visibilityState === "visible") {
        refreshCounselors();
      }
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const filtered = filterUsers(allCounselors, roleFilter, statusFilter, name);
    setCounselors(filtered);
  }, [roleFilter, statusFilter, allCounselors, name]);

  async function refreshCounselors() {
    const counselors = await getCounselors();
    setAllCounselors(counselors);
  }

  return (
    <div className="w-full flex-1 overflow-y-auto p-5 pt-0">
      {loading ? (
        <div className="flex flex-col items-center justify-center h-full space-y-4">
          <div className="loading loading-spinner loading-lg text-primary"></div>
          <p className="text-base-content">Loading registered counselors...</p>
        </div>
      ) : counselors.length === 0 ? (
        <p className="text-center text-gray-500">
          No registered counselors available.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="table table-fixed w-full">
            <thead className="text-center text-base-content">
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody className="text-base-content text-center">
              <AnimatePresence mode="sync">
                {counselors.map((counselor) => (
                  <motion.tr
                    key={counselor.id}
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
                      {counselor.image ? (
                        <div className="flex items-center justify-between gap-4">
                          <Image
                            src={counselor.image}
                            alt={counselor.name ?? "counselor Avatar"}
                            className="w-10 h-10 rounded-full"
                            width={20}
                            height={20}
                          />
                          <div className="text-left font-medium w-full">
                            {counselor.name}
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center gap-4">
                          <div className="w-10">
                            <div
                              role="button"
                              tabIndex={0}
                              className="w-10 h-10 rounded-full bg-gray-500 text-white flex items-center justify-center font-bold hover:brightness-90 active:brightness-75 transition duration-150 select-none cursor-pointer"
                            >
                              {counselor.name?.charAt(0).toUpperCase() ||
                                counselor.email.charAt(0).toUpperCase() ||
                                "?"}
                            </div>
                          </div>
                          <div className="text-left font-medium w-full">
                            {counselor.name}
                          </div>
                        </div>
                      )}
                    </td>
                    <td>{counselor.email}</td>
                    <td>
                      {
                        <motion.span
                          key={`${counselor.id}-${counselor.status}`}
                          initial={{ opacity: 0 }}
                          animate={{
                            opacity: 1,
                            backgroundColor:
                              statusColorMap[counselor.status].bg,
                            color: statusColorMap[counselor.status].text,
                          }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="px-3 py-1 rounded-full text-sm font-medium"
                        >
                          {counselor.status}
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
  counselor: CounselorData[],
  role?: string,
  status?: string,
  name?: string
) {
  if (!role && !status) return counselor;

  return counselor.filter((user) => {
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

export default CounselorList;
