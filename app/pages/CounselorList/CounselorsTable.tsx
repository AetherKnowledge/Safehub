"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import UserImage from "../../components/UserImage";
import { CounselorData, getCounselors } from "./CounselorsActions";

const statusColorMap = {
  Online: { bg: "#d1fae5", text: "#047857" }, // green
  Offline: { bg: "#fee2e2", text: "#b91c1c" }, // red
  Busy: { bg: "#fef9c3", text: "#92400e" }, // yellow
};

const CounselorList = ({ name }: { name?: string }) => {
  const searchParams = useSearchParams();
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
    const filtered = filterUsers(allCounselors, statusFilter, name);
    setCounselors(filtered);
  }, [statusFilter, allCounselors, name]);

  async function refreshCounselors() {
    const counselors = await getCounselors();
    setAllCounselors(counselors);
  }

  return (
    <div className="flex w-full h-full overflow-x-auto p-5 items-start justify-start">
      {loading ? (
        <div className="flex flex-col items-center justify-center space-y-4 w-full h-full">
          <div className="loading loading-spinner loading-lg text-primary"></div>
          <p className="text-base-content">Loading registered counselors...</p>
        </div>
      ) : counselors.length === 0 ? (
        <p className="flex text-center text-base-content/70 w-full h-full justify-center items-center">
          No registered counselors available.
        </p>
      ) : (
        <table className="table w-full">
          <thead className="text-center text-base-content">
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Rating</th>
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
                    <div className="flex flex-row items-center justify-center gap-4">
                      <UserImage
                        src={counselor.image}
                        name={counselor.name ?? "User"}
                        width={10}
                      />
                      <div className="font-medium">{counselor.name}</div>
                    </div>
                  </td>
                  <td>{counselor.email}</td>
                  <td>{counselor.rating.toFixed(1)} ★</td>
                  <td>
                    {
                      <motion.span
                        key={`${counselor.id}-${counselor.status}`}
                        initial={{ opacity: 0 }}
                        animate={{
                          opacity: 1,
                          backgroundColor: statusColorMap[counselor.status].bg,
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
      )}
    </div>
  );
};

function filterUsers(
  counselor: CounselorData[],
  status?: string,
  name?: string
) {
  return counselor.filter((user) => {
    const matchesStatus =
      !status ||
      status === "All" ||
      user.status.toString().toUpperCase() === status.toUpperCase();
    const matchesName =
      !name ||
      !user.name ||
      user.name.toLowerCase().startsWith(name.toLowerCase());

    return matchesStatus && matchesName;
  });
}

export default CounselorList;
