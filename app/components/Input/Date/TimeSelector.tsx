"use client";
import { useEffect, useState } from "react";
import { FaChevronDown, FaRegClock } from "react-icons/fa6";
import { size } from "zod";
import InputInterface from "../InputInterface";
import Legend from "../Legend";
import TimePicker from "./TimePicker";
import { getTimeFromDate, padTime, Time, timeToString } from "./utils";

export type TimeSelectorProps = InputInterface & {
  value?: Time;
  onChange?: (time: Time) => void;
  minTime?: Time | "now"; // inclusive lower bound
  maxTime?: Time; // inclusive upper bound
  size?: "radio-xs" | "radio-sm" | "radio-md" | "radio-lg" | "radio-xl";
};

const TimeSelector = ({
  name,
  legend,
  className,
  required,
  number,
  bgColor = "bg-neutral",
  value,
  onChange,
  minTime,
  maxTime,
  noFormOutput = false,
  readonly = false,
  answerOnly = false,
}: TimeSelectorProps) => {
  const [hasError, setHasError] = useState(false);

  const popoverName = name + "-popover";
  const anchorName = "--" + name + "-anchor";

  const [selectedTime, setSelectedTime] = useState<Time | null>(value || null);

  useEffect(() => {
    if (selectedTime) {
      onChange?.(selectedTime);
    }
    setSelectedTime(selectedTime);
    setHasError(false);
  }, [selectedTime]);

  return (
    <>
      <fieldset className={`fieldset ${className ? className : "w-full"}`}>
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
            <FaRegClock className="w-5 h-5" />
            <p>Time</p>
          </div>

          <input
            name={noFormOutput ? undefined : name}
            value={selectedTime ? timeToString(selectedTime) : "00:00"}
            type="time"
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
              selectedTime ? "" : "text-base-content/50"
            }`}
          >
            {selectedTime
              ? `${padTime(selectedTime.hour)}:${padTime(
                  selectedTime.minute
                )} ${selectedTime.period}`
              : "Select Time"}
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
        className={`dropdown dropdown-end menu rounded-box p-0 ${bgColor} rounded-lg border-base-300 shadow-sm ${size}`}
        popover="auto"
        id={popoverName}
        style={{ positionAnchor: anchorName } as React.CSSProperties}
      >
        <TimePicker
          value={selectedTime || value}
          onChange={setSelectedTime}
          minTime={minTime === "now" ? getTimeFromDate(new Date()) : minTime}
          maxTime={maxTime}
        />
      </div>
    </>
  );
};

export default TimeSelector;
