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
}

const DatePickerSelector = ({
  value,
  highlightedDates,
  onChange,
}: DatePickerSelectorProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(value || null);

  function selectDate(date: Date) {
    if (onChange) {
      onChange(date);
    }
    setSelectedDate(date);
    setIsOpen(false);
  }

  return (
    <div className="relative inline-block w-100 border border-base-content/20 bg-white rounded">
      <div className="flex flex-row justify-between items-center">
        <div className="flex flex-row items-center px-3 py-2 gap-2 text-left text-base-content/40">
          <FaCalendar />
          <p>
            {selectedDate ? formatDateDisplay(selectedDate) : "Select date"}
          </p>
        </div>
        <button
          className="flex flex-row items-center justify-between px-3 py-2 w-25 text-left border border-transparent border-l-base-content/20 text-base-content/40"
          onClick={() => setIsOpen(!isOpen)}
        >
          <p className="pl-1">Select</p>
          <FaAngleDown />
        </button>
      </div>
      {isOpen && (
        <div className="absolute mt-2 z-10">
          <DatePicker
            value={selectedDate || value}
            highlightedDates={highlightedDates}
            onChange={(date) => {
              selectDate(date);
            }}
          />
        </div>
      )}
    </div>
  );
};

export default DatePickerSelector;
