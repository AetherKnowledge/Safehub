"use client";

import { convertLocalToUTC, formatDate } from "@/lib/client-utils";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FaAngleDoubleLeft, FaAngleDoubleRight } from "react-icons/fa";
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

  minDate?: Date | "now"; // inclusive lower bound
  maxDate?: Date; // inclusive upper bound
  defaultValue?: Date;
  readonly?: boolean;
  disableSunday?: boolean;
}

const DAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

/** Date Picker Component */
export default function DatePicker({
  value,
  onChange,
  highlightedDates,
  pushToRouter = false,
  local = false,
  minDate: min,
  maxDate: max,
  disableSunday = false,
}: DatePickerProps) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(value || null);
  const router = useRouter();
  const [currentMonthAndYear, setCurrentMonthAndYear] = useState(
    value ? new Date(value) : new Date()
  );
  const startOfMonth = new Date(
    currentMonthAndYear.getFullYear(),
    currentMonthAndYear.getMonth(),
    1
  );
  const daysInMonth = new Date(
    currentMonthAndYear.getFullYear(),
    currentMonthAndYear.getMonth() + 1,
    0
  ).getDate();

  const handleSelect = (day: number) => {
    const localDate = new Date(
      currentMonthAndYear.getFullYear(),
      currentMonthAndYear.getMonth(),
      day
    );

    const utcDate = convertLocalToUTC(localDate, false);
    setSelectedDate(utcDate);

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
        date.getMonth() === currentMonthAndYear.getMonth() &&
        date.getFullYear() === currentMonthAndYear.getFullYear()
    );
  };

  useEffect(() => {
    if (!min) return;

    const minDate = min === "now" ? new Date() : min;
    if (selectedDate && selectedDate < minDate) {
      setCurrentMonthAndYear(
        new Date(minDate.getFullYear(), minDate.getMonth(), 1)
      );
      handleSelect(minDate.getDate());
    }
  }, [min]);

  const isDisabled = (day: number) => {
    const selectedDate = new Date(
      currentMonthAndYear.getFullYear(),
      currentMonthAndYear.getMonth(),
      day
    );

    if (disableSunday && selectedDate.getDay() === 0) {
      return true;
    }

    if (min) {
      const minDate = min === "now" ? new Date() : min;
      minDate.setHours(0, 0, 0, 0);

      if (selectedDate < minDate) return true;
    }
    if (max) {
      if (selectedDate > max) return true;
    }
    return false;
  };

  useEffect(() => {
    if (!value) return;

    setCurrentMonthAndYear((prev) => {
      const newVal = new Date(value.getFullYear(), value.getMonth(), 1);
      return prev.getTime() === newVal.getTime() ? prev : newVal;
    });

    setSelectedDate((prev) => {
      return prev?.getTime() === value.getTime() ? prev : value;
    });
  }, [value]);

  return (
    <div className="bg-base-100 border border-base-content/10 rounded p-3 w-80">
      <div className="flex justify-between items-center mb-2 gap-2">
        <FaAngleDoubleLeft
          className="btn btn-ghost h-5 p-0 rounded cursor-pointer"
          onClick={() =>
            setCurrentMonthAndYear(
              new Date(
                currentMonthAndYear.getFullYear() - 1,
                currentMonthAndYear.getMonth(),
                1
              )
            )
          }
        />
        <FaAngleLeft
          className="btn btn-ghost h-5 p-0 rounded cursor-pointer"
          onClick={() =>
            setCurrentMonthAndYear(
              new Date(
                currentMonthAndYear.getFullYear(),
                currentMonthAndYear.getMonth() - 1,
                1
              )
            )
          }
        />
        <span className="font-semibold text-sm w-full text-center">
          {currentMonthAndYear.toLocaleString("default", { month: "long" })}{" "}
          {currentMonthAndYear.getFullYear()}
        </span>
        <FaAngleRight
          className="btn btn-ghost h-5 p-0 rounded cursor-pointer"
          onClick={() =>
            setCurrentMonthAndYear(
              new Date(
                currentMonthAndYear.getFullYear(),
                currentMonthAndYear.getMonth() + 1,
                1
              )
            )
          }
        />
        <FaAngleDoubleRight
          className="btn btn-ghost h-5 p-0 rounded cursor-pointer"
          onClick={() =>
            setCurrentMonthAndYear(
              new Date(
                currentMonthAndYear.getFullYear() + 1,
                currentMonthAndYear.getMonth(),
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
            selectedDate.getMonth() === currentMonthAndYear.getMonth() &&
            selectedDate.getFullYear() === currentMonthAndYear.getFullYear();

          return (
            <button
              type="button"
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
              disabled={isDisabled(day)}
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
