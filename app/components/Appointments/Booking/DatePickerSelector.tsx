"use client";
import { formatDateDisplay } from "@/lib/utils";
import { useState } from "react";
import { FaAngleDown, FaCalendar } from "react-icons/fa6";
import DatePicker from "./DatePicker";

interface DatePickerSelectorProps {
  value?: Date;
  highlightedDates?: Date[];

  /** Returns utc date not local date */
  onChange?: (date: Date) => void;

  canPickPast?: boolean;
}

const DatePickerSelector = ({
  value,
  highlightedDates,
  onChange,
}: DatePickerSelectorProps) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(value || null);

  function selectDate(date: Date) {
    if (onChange) {
      onChange(date);
    }
    setSelectedDate(date);
  }

  return (
    <div
      className="relative dropdown h-12 min-h-[48px] min-w-70 border border-base-content/20 bg-base-200 rounded"
      role="button"
      tabIndex={0}
    >
      <div className="flex flex-row justify-between items-center h-full">
        <div
          className={`flex flex-row items-center px-3 py-2 gap-2 text-left ${
            selectedDate ? "text-base-content" : "text-base-content/40"
          }`}
        >
          <FaCalendar />
          <p>
            {selectedDate ? formatDateDisplay(selectedDate) : "Select date"}
          </p>
        </div>
        <button className="flex flex-row items-center justify-between px-3 py-2 h-full w-25 text-left border border-transparent border-l-base-content/20 text-base-content">
          <p className="pl-1">Select</p>
          <FaAngleDown />
        </button>
      </div>
      <div className="dropdown-content absolute mt-2 z-10">
        <DatePicker
          value={selectedDate || value}
          highlightedDates={highlightedDates}
          onChange={(date) => {
            selectDate(date);
          }}
          canPickPast={false}
        />
      </div>
    </div>
  );
};

export default DatePickerSelector;
