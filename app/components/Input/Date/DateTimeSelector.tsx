"use client";
import { useEffect, useState } from "react";
import InputInterface from "../InputInterface";
import Legend from "../Legend";
import DateSelector from "./DateSelector";
import TimeSelector from "./TimeSelector";
import {
  addDays,
  dateToString,
  getTimeFromDate,
  isDateTimeAfter,
  isDateToday,
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

      if (isDateToday(defaultValue)) {
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
    if (
      initialMinDate === "now" ||
      (initialMinDate && isDateToday(initialMinDate))
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
    setSelectedDate(date);

    // time must be "now" if picking today
    if (isDateToday(date)) setMinTime("now");
    else setMinTime(initialMinTime);

    emit(date, selectedTime);
  }

  function handleTimeChange(time: Time) {
    setSelectedTime(time);

    if (selectedDate && initialMinDate) {
      const allowed =
        isDateTimeAfter(selectedDate, time, initialMinDate) ||
        selectedDate > initialMinDate;

      setMinDate(allowed ? initialMinDate : addDays(initialMinDate, 1));
    }

    emit(selectedDate, time);
  }

  // ---------------------------------------------------------------
  // RENDER
  // ---------------------------------------------------------------

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
          <DateSelector
            name="date"
            noFormOutput
            value={selectedDate}
            onChange={handleDateChange}
            minDate={minDate}
            maxDate={maxDate}
            readonly={readonly}
          />

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

          <TimeSelector
            name="time"
            noFormOutput
            value={selectedTime}
            onChange={handleTimeChange}
            minTime={minTime}
            maxTime={maxTime}
            readonly={readonly}
          />
        </div>

        <p
          className={`text-xs text-error ml-1 mt-[-5px] ${
            hasError ? "" : "hidden"
          }`}
        >
          This field is required.
        </p>
      </fieldset>
    </>
  );
};

export default DateTimeSelector;
