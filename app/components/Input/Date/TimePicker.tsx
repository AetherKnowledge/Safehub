"use client";
import { useEffect, useState } from "react";
import { FaCaretDown, FaCaretUp } from "react-icons/fa";
import { Time, TimePeriod, padTime } from "./utils";

interface Props {
  className?: string;
  onChange?: (value: Time) => void;
  value?: Time;
  // ...existing code...
  minTime?: Time; // inclusive lower bound
  maxTime?: Time; // inclusive upper bound
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
const clampToRange = (t: Time, min?: Time, max?: Time) => {
  const m = timeToMinutes(t);
  if (min && m < timeToMinutes(min)) return min;
  if (max && m > timeToMinutes(max)) return max;
  return t;
};

const TimePicker = ({
  className = "",
  onChange,
  value,
  minTime,
  maxTime,
}: Props) => {
  const [time, setTime] = useState<Time>(() =>
    clampToRange(
      value || { hour: 12, minute: 0, period: TimePeriod.AM },
      minTime,
      maxTime
    )
  );

  // Clamp time if min/max change, but avoid unnecessary setState
  useEffect(() => {
    setTime((t) => {
      const clamped = clampToRange(t, minTime, maxTime);
      // Only update if different
      if (
        clamped.hour === t.hour &&
        clamped.minute === t.minute &&
        clamped.period === t.period
      ) {
        return t;
      }
      return clamped;
    });
    onChange?.(clampToRange(time, minTime, maxTime));
  }, [minTime, maxTime]);

  const adjustHour = (delta: number) => {
    setTime((t) => clampToRange(addHoursToTime(t, delta), minTime, maxTime));
    onChange?.(clampToRange(addHoursToTime(time, delta), minTime, maxTime));
  };

  const adjustMinute = (delta: number) => {
    setTime((t) => clampToRange(addMinutesToTime(t, delta), minTime, maxTime));
    onChange?.(clampToRange(addMinutesToTime(time, delta), minTime, maxTime));
  };

  const togglePeriod = () => {
    setTime((t) =>
      clampToRange(
        {
          ...t,
          period: t.period === TimePeriod.AM ? TimePeriod.PM : TimePeriod.AM,
        },
        minTime,
        maxTime
      )
    );
    onChange?.(
      clampToRange(
        {
          ...time,
          period: time.period === TimePeriod.AM ? TimePeriod.PM : TimePeriod.AM,
        },
        minTime,
        maxTime
      )
    );
  };

  return (
    <div
      className={`border border-base-content/20 rounded p-4 inline-block text-center text-base-content bg-base-100 ${className}`}
    >
      <div className="grid grid-cols-5 items-center">
        <TimeControl
          label="Hour"
          onIncrement={() => adjustHour(1)}
          onDecrement={() => adjustHour(-1)}
          value={padTime(time.hour)}
        />
        <div className="text-2xl flex vertical pb-1 items-center justify-center">
          :
        </div>
        <TimeControl
          label="Minute"
          onIncrement={() => adjustMinute(1)}
          onDecrement={() => adjustMinute(-1)}
          value={padTime(time.minute)}
        />
        <div></div>
        <TimeControl
          label="Period"
          onIncrement={togglePeriod}
          onDecrement={togglePeriod}
          value={time.period}
        />
      </div>
    </div>
  );
};

const TimeControl = ({
  label,
  onIncrement,
  onDecrement,
  value,
}: {
  label: string;
  onIncrement: () => void;
  onDecrement: () => void;
  value: string | number;
}) => (
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

export default TimePicker;
