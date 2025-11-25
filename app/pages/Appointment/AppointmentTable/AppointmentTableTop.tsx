"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { CiCircleCheck, CiCircleRemove, CiRepeat } from "react-icons/ci";
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
    <div className="flex flex-row gap-2 pt-2">
      <select
        defaultValue={status}
        className="select  ring-0 outline-none focus:ring-0 focus:outline-none"
        onChange={(e) => updateStatus(e.target.value)}
      >
        <option disabled={true}>Status</option>
        <option value="all">All</option>
        <option value="Pending">Pending</option>
        <option value="Confirmed">Confirmed</option>
        <option value="Approved">Approved</option>
        <option value="Canceled">Canceled</option>
      </select>
    </div>
  );
};

export default AppointmentTableTop;
