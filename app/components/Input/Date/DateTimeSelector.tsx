"use client";
import { formatDateDisplay } from "@/lib/utils";
import { useEffect, useState } from "react";
import { FaChevronDown, FaRegClock } from "react-icons/fa";
import { MdOutlineDateRange } from "react-icons/md";
import InputInterface from "../InputInterface";
import Legend from "../Legend";
import DatePicker from "./DatePicker";
import TimePicker from "./TimePicker";
import {
  addDays,
  dateToString,
  getTimeFromDate,
  isDateTimeAfter,
  isDateToday,
  isTimeAfter,
  padTime,
  setTimeToDate,
  Time,
} from "./utils";

export type DateTimeSelectorProps = InputInterface & {
  defaultValue?: Date;
  onChange?: (dateTime: Date) => void;
  minDate?: Date | "now";
  maxDate?: Date;
  minTime?: Time | "now";
  maxTime?: Time;
  noFormOutput?: boolean;
  horizontal?: boolean;
};

const DateTimeSelector = ({
  name,
  legend,
  className,
  required,
  number,
  defaultValue,
  onChange,
  minDate: initialMinDate,
  maxDate,
  minTime: initialMinTime,
  maxTime,
  noFormOutput = false,
  horizontal = false,
  onInvalid,
  readonly = false,
}: DateTimeSelectorProps) => {
  const [hasError, setHasError] = useState(false);
  const [initialized, setInitialized] = useState(false);

  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [selectedTime, setSelectedTime] = useState<Time | undefined>();

  const [minDate, setMinDate] = useState<Date | "now" | undefined>();
  const [minTime, setMinTime] = useState<Time | "now" | undefined>();

  // ---------------------------------------------------------------
  // INITIALIZATION (Runs Only Once)
  // ---------------------------------------------------------------
  useEffect(() => {
    if (initialized) return;
    setInitialized(true);

    // Handle initial default value
    if (defaultValue) {
      const time = getTimeFromDate(defaultValue);
      setSelectedDate(defaultValue);
      setSelectedTime(time);

      if (
        isDateToday(defaultValue) &&
        initialMinTime &&
        isTimeAfter(getTimeFromDate(new Date()), initialMinTime)
      ) {
        setMinTime("now");
      } else {
        setMinTime(initialMinTime ?? undefined);
      }

      setMinDate(initialMinDate);

      if (onChange) onChange(defaultValue);
      return;
    }

    // If NO default value → apply min rules
    setMinDate(initialMinDate);
    const now = new Date();
    const currentTime = getTimeFromDate(now); // or however your helper returns time

    const isMinDateToday =
      initialMinDate === "now" ||
      (initialMinDate && isDateToday(initialMinDate));

    if (
      isMinDateToday &&
      initialMinTime &&
      isTimeAfter(currentTime, initialMinTime)
    ) {
      setMinTime("now");
    } else {
      setMinTime(initialMinTime ?? undefined);
    }
  }, [initialized, defaultValue, initialMinDate, initialMinTime, onChange]);

  // ---------------------------------------------------------------
  // HANDLERS
  // ---------------------------------------------------------------

  function combineDateTime(date: Date, time: Time) {
    const combined = new Date(date);
    let hour = time.hour % 12;
    if (time.period === "PM") hour += 12;
    if (time.period === "AM" && time.hour === 12) hour = 0;
    combined.setHours(hour, time.minute, 0, 0);
    return combined;
  }

  function emit(date?: Date, time?: Time) {
    if (!date || !time) return;
    const dt = combineDateTime(date, time);
    if (onChange) onChange(dt);
  }

  function handleDateChange(date: Date) {
    if (date === selectedDate) return;
    setSelectedDate(date);

    // time must be "now" if picking today and minTime passed
    const now = new Date();
    const currentTime = getTimeFromDate(now);
    if (
      isDateToday(date) &&
      initialMinTime &&
      isTimeAfter(currentTime, initialMinTime)
    ) {
      setMinTime("now");
    } else {
      setMinTime(initialMinTime);
    }

    // Only emit if we have a valid time already selected
    if (selectedTime) {
      emit(date, selectedTime);
    }
  }

  function handleTimeChange(time: Time) {
    if (time === selectedTime) return;

    setSelectedTime(time);

    if (selectedDate && initialMinDate && initialMinDate !== "now") {
      const allowed =
        isDateTimeAfter(selectedDate, time, initialMinDate) ||
        selectedDate > initialMinDate;

      setMinDate(allowed ? initialMinDate : addDays(initialMinDate, 1));
    }

    // Only emit if we have a valid date already selected
    if (selectedDate) {
      emit(selectedDate, time);
    }
  }

  // ---------------------------------------------------------------
  // RENDER
  // ---------------------------------------------------------------

  const datePopoverName = name + "-date-popover";
  const dateAnchorName = "--" + name + "-date-anchor";

  const timePopoverName = name + "-time-popover";
  const timeAnchorName = "--" + name + "-time-anchor";

  return (
    <>
      <fieldset className="fieldset w-full">
        {legend && (
          <Legend legend={legend} required={required} number={number} />
        )}

        <div
          className={`flex ${
            horizontal ? "flex-col gap-0" : "flex-row gap-2"
          } ${className}`}
        >
          {/* Date */}
          <fieldset className="fieldset w-full">
            <button
              type="button"
              className={`flex pr-2 justify-between items-center bg-neutral rounded-lg cursor-pointer border ${
                hasError ? "border-error" : "border-base-300"
              } ${className}`}
              popoverTarget={readonly ? undefined : datePopoverName}
              style={
                readonly
                  ? { pointerEvents: "none" }
                  : ({ anchorName: dateAnchorName } as React.CSSProperties)
              }
            >
              <div className="flex flex-row items-center text-center border border-transparent border-r-base-300 gap-1 p-0 px-2 h-full">
                <MdOutlineDateRange className="w-5 h-5" />
                <p>Date</p>
              </div>

              <p
                className={`w-full p-2 text-left ${
                  selectedDate ? "" : "text-base-content/50"
                }`}
              >
                {selectedDate ? formatDateDisplay(selectedDate) : "Select Date"}
              </p>

              {!readonly && <FaChevronDown className="cursor-pointer" />}
            </button>
          </fieldset>

          <input
            name={noFormOutput ? undefined : name}
            value={
              selectedDate && selectedTime
                ? dateToString(setTimeToDate(selectedDate, selectedTime))
                : ""
            }
            type="datetime-local"
            className="sr-only h-full static validator-2 outline-none ring-0 focus:outline-none focus:ring-0"
            required={required}
            onInvalid={(e) => {
              setHasError(true);
              if (onInvalid) onInvalid();
            }}
            onChange={() => {}}
            style={{ caretColor: "transparent" }}
          />

          {/* Time */}
          <fieldset className={`fieldset ${className ? className : "w-full"}`}>
            <button
              type="button"
              className={`flex pr-2 justify-between items-center bg-neutral rounded-lg cursor-pointer border ${
                hasError ? "border-error" : "border-base-300"
              } ${className}`}
              popoverTarget={readonly ? undefined : timePopoverName}
              style={
                readonly
                  ? { pointerEvents: "none" }
                  : ({ anchorName: timeAnchorName } as React.CSSProperties)
              }
            >
              <div className="flex flex-row items-center text-center border border-transparent border-r-base-300 gap-1 p-0 px-2 h-full">
                <FaRegClock className="w-5 h-5" />
                <p>Time</p>
              </div>

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
          </fieldset>
        </div>

        <p
          className={`text-xs text-error ml-1 mt-[-5px] ${
            hasError ? "" : "hidden"
          }`}
        >
          This field is required.
        </p>
      </fieldset>

      <div
        className={`dropdown dropdown-end menu rounded-box p-0 bg-neutral rounded-lg border-base-300 shadow-sm`}
        popover="auto"
        id={datePopoverName}
        style={{ positionAnchor: dateAnchorName } as React.CSSProperties}
      >
        <DatePicker
          value={selectedDate}
          onChange={(date) => {
            handleDateChange(date);
          }}
          minDate={minDate}
          maxDate={maxDate}
        />
      </div>

      <div
        className={`dropdown dropdown-end menu rounded-box p-0 bg-neutral rounded-lg border-base-300 shadow-sm`}
        popover="auto"
        id={timePopoverName}
        style={{ positionAnchor: timeAnchorName } as React.CSSProperties}
      >
        <TimePicker
          value={selectedTime}
          onChange={handleTimeChange}
          minTime={minTime === "now" ? getTimeFromDate(new Date()) : minTime}
          maxTime={maxTime}
        />
      </div>
    </>
  );
};

export default DateTimeSelector;
