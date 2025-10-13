"use client";
import { useEffect, useState } from "react";
import { FaCaretDown, FaCaretUp } from "react-icons/fa";

export const padTime = (num: number) => num.toString().padStart(2, "0");
export enum TimePeriod {
  AM = "AM",
  PM = "PM",
}

export type Time = {
  hour: number;
  minute: number;
  period: TimePeriod;
};

interface Props {
  className?: string;
  onChange?: (value: Time) => void;
  value?: Time;
  // ...existing code...
  min?: Time; // inclusive lower bound
  max?: Time; // inclusive upper bound
}

// Helpers to compare/clamp times
const timeToMinutes = (t: Time) => {
  let h = t.hour % 12;
  if (t.period === TimePeriod.PM) h += 12;
  if (t.period === TimePeriod.AM && t.hour === 12) h = 0;
  return h * 60 + t.minute;
};

// Convert minutes since midnight (0-1439) to Time
const minutesToTime = (total: number): Time => {
  const normalized = ((total % 1440) + 1440) % 1440; // handle negatives safely
  const hours24 = Math.floor(normalized / 60);
  const minute = normalized % 60;
  const period = hours24 >= 12 ? TimePeriod.PM : TimePeriod.AM;
  const hour = hours24 % 12 || 12;
  return { hour, minute, period };
};

// Add minutes to a Time, handling hour rollover and AM/PM switching
const addMinutesToTime = (t: Time, deltaMinutes: number): Time => {
  const current = timeToMinutes(t);
  const next = current + deltaMinutes;
  return minutesToTime(next);
};

// Add hours to a Time, handling AM/PM switching
const addHoursToTime = (t: Time, deltaHours: number): Time => {
  return addMinutesToTime(t, deltaHours * 60);
};
const isWithinRange = (t: Time, min?: Time, max?: Time) => {
  const m = timeToMinutes(t);
  if (min && m < timeToMinutes(min)) return false;
  if (max && m > timeToMinutes(max)) return false;
  return true;
};
const clampToRange = (t: Time, min?: Time, max?: Time) => {
  const m = timeToMinutes(t);
  if (min && m < timeToMinutes(min)) return min;
  if (max && m > timeToMinutes(max)) return max;
  return t;
};

const TimePicker = ({ className = "", onChange, value, min, max }: Props) => {
  const [time, setTime] = useState<Time>(() =>
    clampToRange(
      value || { hour: 12, minute: 0, period: TimePeriod.AM },
      min,
      max
    )
  );

  useEffect(() => {
    onChange?.(time);
  }, [time]);

  // If min/max change, keep current time within range
  useEffect(() => {
    setTime((t) => clampToRange(t, min, max));
  }, [min, max]);

  const adjustHour = (delta: number) => {
    const raw = addHoursToTime(time, delta);
    const candidate = isWithinRange(raw, min, max)
      ? raw
      : clampToRange(raw, min, max);
    setTime(candidate);
  };

  const adjustMinute = (delta: number) => {
    const raw = addMinutesToTime(time, delta);
    const candidate = isWithinRange(raw, min, max)
      ? raw
      : clampToRange(raw, min, max);
    setTime(candidate);
  };

  const togglePeriod = () => {
    const candidate = {
      ...time,
      period: time.period === TimePeriod.AM ? TimePeriod.PM : TimePeriod.AM,
    };
    const next = isWithinRange(candidate, min, max)
      ? candidate
      : clampToRange(candidate, min, max);
    setTime(next);
  };

  const renderControl = (
    label: string,
    onIncrement: () => void,
    onDecrement: () => void,
    value: string
  ) => (
    <div className="flex flex-col items-center gap-y-1">
      <FaCaretUp
        onClick={onIncrement}
        aria-label={`Increment ${label}`}
        className="btn btn-ghost btn-xs size-7"
      />
      <div className="text-xl font-medium w-10 text-center">{value}</div>
      <FaCaretDown
        onClick={onDecrement}
        aria-label={`Decrement ${label}`}
        className="btn btn-ghost btn-xs size-7"
      />
    </div>
  );

  return (
    <div
      className={`border border-base-content/20 rounded p-4 inline-block text-center text-base-content bg-base-100 ${className}`}
    >
      <div className="grid grid-cols-5 items-center">
        {renderControl(
          "Hour",
          () => adjustHour(1),
          () => adjustHour(-1),
          padTime(time.hour)
        )}
        <div className="text-2xl flex vertical pb-1 items-center justify-center">
          :
        </div>
        {renderControl(
          "Minute",
          () => adjustMinute(1),
          () => adjustMinute(-1),
          padTime(time.minute)
        )}
        <div></div>
        {renderControl("Period", togglePeriod, togglePeriod, time.period)}
      </div>
    </div>
  );
};

export function setTimeToDate(date: Date, time: Time): Date {
  let hour = time.hour % 12;
  if (time.period === TimePeriod.PM) hour += 12;
  if (time.period === TimePeriod.AM && time.hour === 12) hour = 0;
  date.setHours(hour, time.minute, 0, 0);
  return date;
}

export function getTimeFromDate(date: Date): Time {
  const hours = date.getHours();
  const minutes = date.getMinutes();

  const period = hours >= 12 ? TimePeriod.PM : TimePeriod.AM;
  const hour = hours % 12 || 12;

  return { hour, minute: minutes, period };
}

export default TimePicker;
