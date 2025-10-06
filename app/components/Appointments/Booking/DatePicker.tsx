"use client";

import { convertLocalToUTC, formatDate } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa6";

interface DatePickerProps {
  value?: Date;
  highlightedDates?: Date[];
  /** Returns utc date not local date */
  onChange?: (date: Date) => void;

  /** If true, the date picker will push the selected date to the router */
  pushToRouter?: boolean;

  /** If true, the date picker will push local date to the router */
  local?: boolean;
}

const DAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

/** Date Picker Component */
export default function DatePicker({
  value = new Date(),
  onChange,
  highlightedDates,
  pushToRouter = false,
  local = false,
}: DatePickerProps) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(value || null);
  const router = useRouter();
  const [currentMonth, setCurrentMonth] = useState(
    value ? new Date(value) : new Date()
  );
  const startOfMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth(),
    1
  );
  const daysInMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth() + 1,
    0
  ).getDate();

  const handleSelect = (day: number) => {
    const localDate = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      day
    );

    const utcDate = convertLocalToUTC(localDate, false);
    setSelectedDate(utcDate);
    console.log("Selected date:", utcDate);

    if (onChange) {
      onChange?.(utcDate);
    }

    if (pushToRouter) {
      const date = local ? localDate : utcDate;
      router.push(`?date=${formatDate(date)}`);
    }
  };

  const isHighlighted = (day: number) => {
    if (!highlightedDates) return false;

    return highlightedDates.some(
      (date) =>
        date &&
        date.getDate() === day &&
        date.getMonth() === currentMonth.getMonth() &&
        date.getFullYear() === currentMonth.getFullYear()
    );
  };

  return (
    <div className="bg-base-100 border border-base-content/10 rounded p-3 w-80">
      <div className="flex justify-between items-center mb-2">
        <FaAngleLeft
          className="btn btn-ghost h-5 p-0 rounded cursor-pointer"
          onClick={() =>
            setCurrentMonth(
              new Date(
                currentMonth.getFullYear(),
                currentMonth.getMonth() - 1,
                1
              )
            )
          }
        />
        <span className="font-semibold text-sm">
          {currentMonth.toLocaleString("default", { month: "long" })}{" "}
          {currentMonth.getFullYear()}
        </span>
        <FaAngleRight
          className="btn btn-ghost h-5 p-0 rounded cursor-pointer"
          onClick={() =>
            setCurrentMonth(
              new Date(
                currentMonth.getFullYear(),
                currentMonth.getMonth() + 1,
                1
              )
            )
          }
        />
      </div>

      <div className="grid grid-cols-7 text-center text-sm font-medium">
        {DAYS.map((d) => (
          <div className="text-base-content/40 font-light text-[12px]" key={d}>
            {d}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 text-center mt-1">
        {Array.from({ length: startOfMonth.getDay() }).map((_, idx) => (
          <div key={`empty-${idx}`} />
        ))}

        {Array.from({ length: daysInMonth }).map((_, dayIdx) => {
          const day = dayIdx + 1;
          const isSelected =
            selectedDate &&
            selectedDate.getDate() === day &&
            selectedDate.getMonth() === currentMonth.getMonth() &&
            selectedDate.getFullYear() === currentMonth.getFullYear();

          return (
            <button
              key={day}
              className={`btn btn-ghost h-7 p-2 border border-transparent cursor-pointer font-light text-[12px] rounded ${
                isSelected
                  ? "bg-primary text-primary-content hover:text-primary-content border-transparent"
                  : "hover:bg-black/10"
              } ${
                isHighlighted(day)
                  ? "underline decoration-primary underline-offset-2"
                  : ""
              }`}
              onClick={() => handleSelect(day)}
            >
              {day}
            </button>
          );
        })}
      </div>
    </div>
  );
}
