"use client";
import { usePopup } from "@/app/components/Popup/PopupProvider";
import { formatDate } from "@/lib/utils";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { FaAngleLeft, FaRegCalendar } from "react-icons/fa";
import { FaAngleRight } from "react-icons/fa6";
import { RxHamburgerMenu } from "react-icons/rx";
import { getTodayAppointmentsCount } from "../AppointmentActions";
import { getWeekDates } from "../WeeklyCalendar/WeeklyCalendarUtils";
import { ViewMode } from "./AppointmentsPage";

const AppointmentHeader: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathName = usePathname();
  const [todayAppointmentsCount, setTodayAppointmentsCount] = useState(0);
  const popup = usePopup();

  // Search params are also stored here for immediate UI updates
  const [viewMode, setViewMode] = useState<ViewMode>(ViewMode.CALENDAR);
  const [date, setDate] = useState<Date>(new Date());
  const [showAll, setShowAll] = useState<boolean>(false);

  // Sync state with URL parameters
  useEffect(() => {
    const currentViewMode =
      (searchParams.get("view") as ViewMode) || ViewMode.CALENDAR;
    const currentDate = searchParams.get("date")
      ? new Date(searchParams.get("date") as string)
      : new Date();
    const currentShowAll = searchParams.get("showAll") === "true";

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
    <div className="flex items-center justify-between p-6">
      <div className="flex items-center gap-4">
        <div className="p-1 bg-base-200 rounded-lg">
          <div className="flex bg-base-100 rounded-lg">
            <button
              className={`flex flex-row px-4 py-2 text-base-content rounded-l-lg gap-1 items-center transition-colors duration-200 ${
                viewMode === ViewMode.LIST
                  ? "bg-base-100"
                  : "bg-base-200 cursor-pointer"
              }`}
              onClick={() => changeViewMode(ViewMode.LIST)}
            >
              <RxHamburgerMenu /> <p>List</p>
            </button>
            <button
              className={`flex flex-row px-4 py-2 text-base-content rounded-r-lg gap-1 items-center transition-colors duration-200 ${
                viewMode === ViewMode.CALENDAR
                  ? "bg-base-100"
                  : "bg-base-200 cursor-pointer"
              }`}
              onClick={() => changeViewMode(ViewMode.CALENDAR)}
            >
              <FaRegCalendar /> <p>Calendar</p>
            </button>
          </div>
        </div>
        <div className="text-lg font-semibold">
          {todayAppointmentsCount} Appointments Today
        </div>
      </div>

      {viewMode === ViewMode.CALENDAR ? (
        <CalendarFilter
          navigateWeek={navigateWeek}
          getDateRangeString={getDateRangeString}
        />
      ) : (
        <ListFilter
          navigateWeek={navigateWeek}
          getDateRangeString={getDateRangeString}
          showAll={showAll}
          setShowAll={changeShowAll}
        />
      )}
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
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2">
        <div
          className="px-3 h-[38px] border rounded items-center flex hover:bg-base-200 cursor-pointer transition-colors duration-200"
          onClick={() => navigateWeek("prev")}
        >
          <FaAngleLeft className="w-4 h-4" />
        </div>
        <span className="border rounded px-2 py-2 whitespace-nowrap w-50 text-center flex items-center justify-center text-sm">
          {getDateRangeString()}
        </span>
        <div
          className="px-3 h-[38px] border rounded items-center flex hover:bg-base-200 cursor-pointer transition-colors duration-200"
          onClick={() => navigateWeek("next")}
        >
          <FaAngleRight className="w-4 h-4" />
        </div>
      </div>
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
          className="select select-md rounded border border-base-content whitespace-nowrap w-50 text-center outline-none ring-0 focus:outline-none focus:ring-0 cursor-pointer"
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
