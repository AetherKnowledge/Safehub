"use client";
import React, { useState, useEffect, useCallback } from "react";
import { FaCaretUp, FaCaretDown } from "react-icons/fa";

const pad = (num: number) => num.toString().padStart(2, "0");

interface Props {
  className?: string;
  onChange?: (value: string) => void;
}

const TimePicker = ({ className = "", onChange }: Props) => {
  const [hour, setHour] = useState(12);
  const [minute, setMinute] = useState(0);
  const [period, setPeriod] = useState<"AM" | "PM">("AM");

  // Memoized formatted time string
  const formattedTime = useCallback(() => {
    const h = hour % 12 === 0 ? 12 : hour;
    const formattedHour =
      period === "AM" ? (h === 12 ? 0 : h) : h === 12 ? 12 : h + 12;
    return `${pad(formattedHour)}:${pad(minute)}`;
  }, [hour, minute, period]);

  useEffect(() => {
    onChange?.(formattedTime());
  }, [hour, minute, period, formattedTime, onChange]);

  const adjustHour = (delta: number) =>
    setHour((prev) => ((prev - 1 + delta + 12) % 12) + 1);

  const adjustMinute = (delta: number) =>
    setMinute((prev) => (prev + delta + 60) % 60);

  const togglePeriod = () => setPeriod((prev) => (prev === "AM" ? "PM" : "AM"));

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
      className={`border rounded-2xl p-4 inline-block text-center shadow-br text-base-content ${className}`}
    >
      <div className="grid grid-cols-5 items-center">
        {renderControl(
          "Hour",
          () => adjustHour(1),
          () => adjustHour(-1),
          pad(hour)
        )}
        <div className="text-2xl flex vertical pb-1 items-center justify-center">
          :
        </div>
        {renderControl(
          "Minute",
          () => adjustMinute(1),
          () => adjustMinute(-1),
          pad(minute)
        )}
        <div></div>
        {renderControl("Period", togglePeriod, togglePeriod, period)}
      </div>
    </div>
  );
};

export default TimePicker;
