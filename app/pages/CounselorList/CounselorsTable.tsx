"use client";

import StarRating from "@/app/components/StarRating";
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
    <div className="flex w-full h-full overflow-x-auto items-start justify-start">
      {loading ? (
        <div className="flex flex-col items-center justify-center space-y-4 w-full h-full">
          <div className="loading loading-spinner loading-lg text-primary"></div>
          <p className="text-base-content/70 font-medium">
            Loading registered counselors...
          </p>
        </div>
      ) : counselors.length === 0 ? (
        <div className="flex flex-col items-center justify-center w-full h-full text-center p-8">
          <svg
            className="w-24 h-24 text-base-content/30 mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
          <p className="text-lg font-semibold text-base-content/70 mb-2">
            No counselors found
          </p>
          <p className="text-sm text-base-content/50">
            Try adjusting your search or filter criteria
          </p>
        </div>
      ) : (
        <table className="table w-full">
          <thead className="text-center text-base-content bg-base-300/50 border-b-2 border-base-content/10">
            <tr>
              <th className="font-semibold">Name</th>
              <th className="font-semibold">Email</th>
              <th className="font-semibold">Rating</th>
              <th className="font-semibold">Status</th>
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
                  className="origin-top hover:bg-primary/5 transition-colors border-b border-base-content/5"
                >
                  <td>
                    <div className="flex items-center gap-4">
                      <div className="ring-2 ring-primary/20 ring-offset-2 ring-offset-base-100 rounded-full">
                        <UserImage
                          src={counselor.image}
                          name={counselor.name ?? "User"}
                          width={10}
                        />
                      </div>
                      <div className="font-semibold text-sm">
                        {counselor.name}
                      </div>
                    </div>
                  </td>
                  <td className="text-sm text-base-content/80">
                    {counselor.email}
                  </td>
                  <td>
                    <div className="flex items-center justify-center gap-2">
                      <StarRating rating={counselor.rating} />
                      {counselor.rating > 0 && (
                        <span className="text-xs font-semibold text-primary">
                          {counselor.rating.toFixed(1)}
                        </span>
                      )}
                    </div>
                  </td>
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
      user.name.toLowerCase().includes(name.toLowerCase());

    return matchesStatus && matchesName;
  });
}

export default CounselorList;
