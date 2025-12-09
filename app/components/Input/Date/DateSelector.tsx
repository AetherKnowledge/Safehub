"use client";
import { formatDateDisplay } from "@/lib/client-utils";
import { useState } from "react";
import { FaChevronDown } from "react-icons/fa6";
import { MdOutlineDateRange } from "react-icons/md";
import InputInterface from "../InputInterface";
import Legend from "../Legend";
import DatePicker from "./DatePicker";

export type DateSelectorProps = InputInterface & {
  value?: Date;
  highlightedDates?: Date[];

  /** Returns utc date not local date */
  onChange?: (date: Date) => void;

  minDate?: Date | "now"; // inclusive lower bound
  maxDate?: Date; // inclusive upper bound
  disableSunday?: boolean;
};

const DateSelector = ({
  name,
  legend,
  className,
  required,
  number,
  bgColor = "bg-neutral",
  value,
  highlightedDates,

  onChange,
  minDate,
  maxDate,
  noFormOutput = false,
  readonly = false,
  answerOnly = false,
  disableSunday = false,
}: DateSelectorProps) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(() => {
    if (value) return value;
    if (minDate === "now") return new Date();
    if (minDate instanceof Date) return minDate;
    return null;
  });
  const [hasError, setHasError] = useState(false);

  const popoverName = name + "-popover";
  const anchorName = "--" + name + "-anchor";

  function selectDate(date: Date) {
    if (onChange) {
      onChange(date);
    }
    setSelectedDate(date);
    setHasError(false);
  }

  return (
    <>
      <fieldset className="fieldset w-full">
        {legend && (
          <Legend
            legend={legend}
            required={answerOnly ? undefined : required}
            number={number}
          />
        )}
        <button
          type="button"
          className={`flex pr-2 justify-between items-center ${bgColor} rounded-lg cursor-pointer border ${
            hasError ? "border-error" : "border-base-300"
          } ${className}`}
          popoverTarget={readonly ? undefined : popoverName}
          style={
            readonly
              ? { pointerEvents: "none" }
              : ({ anchorName } as React.CSSProperties)
          }
        >
          <div className="flex flex-row items-center text-center border border-transparent border-r-base-300 gap-1 p-0 px-2 h-full">
            <MdOutlineDateRange className="w-5 h-5" />
            <p>Date</p>
          </div>

          <input
            name={noFormOutput ? undefined : name}
            value={selectedDate?.toISOString().split("T")[0] ?? ""}
            type="date"
            className="sr-only h-full static validator-2 outline-none ring-0 focus:outline-none focus:ring-0"
            required={required}
            onInvalid={(e) => {
              setHasError(true);
            }}
            onChange={() => {
              console.log("changed");
            }}
            style={{ caretColor: "transparent" }}
          />

          <p
            className={`w-full p-2 text-left ${
              selectedDate ? "" : "text-base-content/50"
            }`}
          >
            {selectedDate ? formatDateDisplay(selectedDate) : "Select Date"}
          </p>

          {!readonly && <FaChevronDown className="cursor-pointer" />}
        </button>

        <div className="flex flex-col">
          <p
            className={`text-xs text-error ml-1 mt-[-5px] ${
              hasError ? "" : "hidden"
            }`}
          >
            This field is required.
          </p>
        </div>
      </fieldset>

      <div
        className={`dropdown dropdown-end menu rounded-box p-0 ${bgColor} rounded-lg border-base-300 shadow-sm`}
        popover="auto"
        id={popoverName}
        style={{ positionAnchor: anchorName } as React.CSSProperties}
      >
        <DatePicker
          value={selectedDate || value}
          highlightedDates={highlightedDates}
          onChange={(date) => {
            selectDate(date);
          }}
          minDate={minDate}
          maxDate={maxDate}
          readonly={readonly}
          disableSunday={disableSunday}
        />
      </div>
    </>
  );
};

export default DateSelector;
