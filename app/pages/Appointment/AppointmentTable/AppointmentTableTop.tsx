"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { CiCircleCheck, CiCircleRemove, CiRepeat } from "react-icons/ci";
import { FiFilter } from "react-icons/fi";
import { TiThumbsUp } from "react-icons/ti";

const STATUS_OPTIONS = [
  { key: "pending", label: "Pending", icon: <CiRepeat className="w-5 h-5" /> },
  {
    key: "Confirmed",
    label: "Confirmed",
    icon: <TiThumbsUp className="w-5 h-5" />,
  },
  {
    key: "Approved",
    label: "Approved",
    icon: <CiCircleCheck className="w-5 h-5" />,
  },
  {
    key: "Canceled",
    label: "Canceled",
    icon: <CiCircleRemove className="w-5 h-5" />,
  },
];

const AppointmentTableTop = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const status = searchParams.get("status") || "all";

  const updateStatus = (newStatus: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("status", newStatus);
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="flex flex-row gap-2 items-center">
      <div className="flex items-center gap-2 bg-base-200/50 rounded-lg px-3 py-2 border border-base-content/5">
        <FiFilter className="w-4 h-4 text-base-content/60" />
        <select
          value={status}
          className="select select-sm bg-transparent border-none ring-0 outline-none focus:ring-0 focus:outline-none text-sm font-medium"
          onChange={(e) => updateStatus(e.target.value)}
        >
          <option value="all">All Status</option>
          <option value="Pending">Pending</option>
          <option value="Completed">Counseled</option>
          <option value="Approved">Approved</option>
          <option value="Canceled">Canceled</option>
        </select>
      </div>
    </div>
  );
};

export default AppointmentTableTop;
