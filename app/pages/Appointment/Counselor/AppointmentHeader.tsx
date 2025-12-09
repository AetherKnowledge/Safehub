"use client";
import { usePopup } from "@/app/components/Popup/PopupProvider";
import { formatDate } from "@/lib/client-utils";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { FaAngleLeft, FaRegCalendar } from "react-icons/fa";
import { FaAngleRight } from "react-icons/fa6";
import { RxHamburgerMenu } from "react-icons/rx";
import { getTodayAppointmentsCount } from "../AppointmentActions";
import { getWeekDates } from "../WeeklyCalendar/WeeklyCalendarUtils";
import { ViewMode } from "./AppointmentsPage";

const AppointmentHeader = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathName = usePathname();
  const [todayAppointmentsCount, setTodayAppointmentsCount] = useState(0);
  const popup = usePopup();

  const pathname = usePathname();

  const status = searchParams.get("status") || "all";

  const updateStatus = (newStatus: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("status", newStatus);
    router.push(`${pathname}?${params.toString()}`);
  };

  // Search params are also stored here for immediate UI updates
  const [viewMode, setViewMode] = useState<ViewMode>(ViewMode.LIST);
  const [date, setDate] = useState<Date>(new Date());
  const [showAll, setShowAll] = useState<boolean>(true);

  // Sync state with URL parameters
  useEffect(() => {
    const currentViewMode =
      (searchParams.get("view") as ViewMode) || ViewMode.LIST;
    const currentDate = searchParams.get("date")
      ? new Date(searchParams.get("date") as string)
      : new Date();
    const currentShowAll = searchParams.get("showAll")
      ? searchParams.get("showAll") === "true"
      : true;

    setViewMode(currentViewMode);
    setDate(currentDate);
    setShowAll(currentShowAll);
  }, [searchParams]);

  useEffect(() => {
    const fetchTodayAppointmentsCount = async () => {
      await getTodayAppointmentsCount(new Date())
        .then((count) => {
          setTodayAppointmentsCount(count);
        })
        .catch((err) => {
          popup.showError("Failed to load today's appointments count.", err);
        });
    };

    fetchTodayAppointmentsCount();
  }, []);
  const weekDates = getWeekDates(date);

  const changeShowAll = (show: boolean) => {
    console.log("Changing showAll to:", show);
    setShowAll(show);
    updateSearchParam("showAll", show ? "true" : "false");
  };

  const navigateWeek = (direction: "prev" | "next") => {
    const newDate = new Date(date);
    newDate.setDate(date.getDate() + (direction === "next" ? 7 : -7));
    setDate(newDate);
    updateSearchParam("date", formatDate(newDate));
  };

  const changeViewMode = (mode: ViewMode) => {
    setViewMode(mode);
    updateSearchParam("view", mode);
  };

  const updateSearchParam = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set(key, value);
    router.push(`${pathName}?${params.toString()}`);
  };

  const getDateRangeString = () => {
    if (!weekDates || weekDates.length !== 7) return "";

    const start = weekDates[0];
    const end = weekDates[6];

    return `${start.toLocaleDateString("en-US", {
      month: "long",
    })} ${start.getDate()}-${end.getDate()}, ${end.getFullYear()}`;
  };

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-5 sm:p-6 border-b border-base-content/5 gap-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 flex-1">
        {/* View Mode Toggle */}
        <div className="inline-flex bg-base-200/50 rounded-xl p-1 shadow-sm border border-base-content/5">
          <button
            className={`flex flex-row px-4 py-2.5 rounded-lg gap-2 items-center transition-all duration-200 font-medium text-sm ${
              viewMode === ViewMode.LIST
                ? "bg-primary text-primary-content shadow-md"
                : "text-base-content/70 hover:text-base-content hover:bg-base-100/50"
            }`}
            onClick={() => changeViewMode(ViewMode.LIST)}
          >
            <RxHamburgerMenu className="w-4 h-4" /> <span>List</span>
          </button>
          <button
            className={`flex flex-row px-4 py-2.5 rounded-lg gap-2 items-center transition-all duration-200 font-medium text-sm ${
              viewMode === ViewMode.CALENDAR
                ? "bg-primary text-primary-content shadow-md"
                : "text-base-content/70 hover:text-base-content hover:bg-base-100/50"
            }`}
            onClick={() => changeViewMode(ViewMode.CALENDAR)}
          >
            <FaRegCalendar className="w-4 h-4" /> <span>Calendar</span>
          </button>
        </div>

        {/* Today's Count Badge */}
        <div className="flex items-center gap-2 bg-primary/10 px-4 py-2.5 rounded-lg border border-primary/20">
          <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
          <span className="text-sm font-semibold text-base-content">
            {todayAppointmentsCount}{" "}
            {todayAppointmentsCount === 1 ? "Appointment" : "Appointments"}{" "}
            Today
          </span>
        </div>
      </div>

      {/* Filters */}
      <div className="w-full sm:w-auto">
        {viewMode === ViewMode.CALENDAR ? (
          <CalendarFilter
            navigateWeek={navigateWeek}
            getDateRangeString={getDateRangeString}
          />
        ) : (
          <div className="flex items-center gap-2 bg-base-200/50 rounded-lg px-3 py-2 border border-base-content/5">
            <svg
              className="w-4 h-4 text-base-content/60"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
              />
            </svg>
            <select
              value={status}
              className="select select-sm bg-transparent border-none outline-none ring-0 focus:outline-none focus:ring-0 cursor-pointer text-sm font-medium pr-8"
              onChange={(e) => updateStatus(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="Pending">Pending</option>
              <option value="Confirmed">Confirmed</option>
              <option value="Approved">Approved</option>
              <option value="Canceled">Canceled</option>
              <option value="DidNotAttend">Did Not Attend</option>
            </select>
          </div>
        )}
      </div>
    </div>
  );
};

export function CalendarFilter({
  navigateWeek,
  getDateRangeString,
}: {
  navigateWeek: (direction: "prev" | "next") => void;
  getDateRangeString: () => string;
}) {
  return (
    <div className="flex items-center gap-2">
      <button
        className="p-2.5 rounded-lg border border-base-content/10 bg-base-100 hover:bg-base-200 hover:border-primary/30 transition-all duration-200 group"
        onClick={() => navigateWeek("prev")}
        aria-label="Previous week"
      >
        <FaAngleLeft className="w-4 h-4 group-hover:text-primary transition-colors" />
      </button>
      <div className="bg-base-200/50 rounded-lg px-4 py-2.5 border border-base-content/5 min-w-[200px] text-center">
        <span className="text-sm font-semibold text-base-content">
          {getDateRangeString()}
        </span>
      </div>
      <button
        className="p-2.5 rounded-lg border border-base-content/10 bg-base-100 hover:bg-base-200 hover:border-primary/30 transition-all duration-200 group"
        onClick={() => navigateWeek("next")}
        aria-label="Next week"
      >
        <FaAngleRight className="w-4 h-4 group-hover:text-primary transition-colors" />
      </button>
    </div>
  );
}

export function ListFilter({
  navigateWeek,
  getDateRangeString,
  showAll,
  setShowAll,
}: {
  navigateWeek: (direction: "prev" | "next") => void;
  getDateRangeString: () => string;
  showAll: boolean;
  setShowAll: (show: boolean) => void;
}) {
  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2">
        {!showAll && (
          <div
            className="px-3 h-[38px] border rounded items-center flex hover:bg-base-200 cursor-pointer transition-colors duration-200"
            onClick={() => navigateWeek("prev")}
          >
            <FaAngleLeft className="w-4 h-4" />
          </div>
        )}
        <select
          className="select select-md rounded border border-base-300 whitespace-nowrapoutline-none ring-0 focus:outline-none focus:ring-0 cursor-pointer max-w-30"
          onChange={(e) => setShowAll(e.target.value === "all")}
          defaultValue={showAll ? "all" : "week"}
        >
          <option disabled={true}>Date Filter</option>
          <option value="week">
            {showAll ? "Week" : getDateRangeString()}
          </option>
          <option value="all">All</option>
        </select>

        {!showAll && (
          <div
            className="px-3 h-[38px] border rounded items-center flex hover:bg-base-200 cursor-pointer transition-colors duration-200"
            onClick={() => navigateWeek("next")}
          >
            <FaAngleRight className="w-4 h-4" />
          </div>
        )}
      </div>
    </div>
  );
}

export default AppointmentHeader;
