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
  minDate?: Date | "now"; // inclusive lower bound
  maxDate?: Date; // inclusive upper bound
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
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(() => {
    return defaultValue ?? undefined;
  });
  const [selectedTime, setSelectedTime] = useState<Time | undefined>(() => {
    return defaultValue ? getTimeFromDate(defaultValue) : undefined;
  });
  const [minDate, setMinDate] = useState<Date | "now" | undefined>(
    initialMinDate
  );
  const [minTime, setMinTime] = useState<Time | "now" | undefined>(() => {
    // If a value is provided, we don't apply "now" restrictions.
    if (defaultValue) return initialMinTime ?? undefined;

    // No min date → no min time
    if (!initialMinDate) return undefined;

    // minDate = "now" → time must be "now"
    if (initialMinDate === "now") return "now";

    // minDate is a real Date
    if (isDateToday(initialMinDate)) {
      return "now";
    }

    // min date is in the future → use the provided min time
    return initialMinTime ?? undefined;
  });

  function handleDateChange(date: Date) {
    setSelectedDate(date);

    // Update minTime depending on whether selected date is today
    const newMinTime = isDateToday(date) ? "now" : initialMinTime;
    setMinTime(newMinTime);

    if (onChange && date && selectedTime) {
      const combinedDateTime = new Date(date);
      let hour = selectedTime.hour % 12;
      if (selectedTime.period === "PM") hour += 12;
      if (selectedTime.period === "AM" && selectedTime.hour === 12) hour = 0;
      combinedDateTime.setHours(hour, selectedTime.minute, 0, 0);
      onChange(combinedDateTime);
    }
  }

  function handleTimeChange(time: Time) {
    setSelectedTime(time);

    // Update minDate based on whether the selected date + time is before initialMinDate
    if (selectedDate && initialMinDate) {
      const newMinDate = isDateTimeAfter(selectedDate, time, initialMinDate)
        ? initialMinDate
        : addDays(initialMinDate, 1);
      setMinDate(newMinDate);
    }

    if (onChange && selectedDate && time) {
      const combinedDateTime = new Date(selectedDate);
      let hour = time.hour % 12;
      if (time.period === "PM") hour += 12;
      if (time.period === "AM" && time.hour === 12) hour = 0;
      combinedDateTime.setHours(hour, time.minute, 0, 0);
      onChange(combinedDateTime);
    }
  }

  useEffect(() => {
    if (!defaultValue) return;

    handleDateChange(defaultValue);
    handleTimeChange(getTimeFromDate(defaultValue));
  }, []);

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
            min={minDate}
            max={maxDate}
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
            min={minTime}
            max={maxTime}
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
