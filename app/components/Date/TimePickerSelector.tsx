"use client";
import { useEffect, useState } from "react";
import { FaAngleDown, FaClock } from "react-icons/fa6";
import TimePicker, { padTime, Time, TimePeriod } from "./TimePicker";

interface TimePickerSelectorProps {
  value?: Time;
  onChange?: (time: Time) => void;
  min?: Time; // inclusive lower bound
  max?: Time; // inclusive upper bound
}

const TimePickerSelector = ({
  value,
  onChange,
  min,
  max,
}: TimePickerSelectorProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTime, setSelectedTime] = useState<Time>(
    value || { hour: 12, minute: 0, period: TimePeriod.AM }
  );

  useEffect(() => {
    onChange?.(selectedTime);
  }, [selectedTime]);

  return (
    <div
      className="relative dropdown h-12 min-h-[48px] min-w-70 border border-base-content/20 bg-base-200 rounded"
      role="button"
      tabIndex={0}
    >
      <div className="flex flex-row justify-between items-center h-full">
        <div
          className={`flex flex-row items-center px-3 py-2 gap-2 text-left ${
            selectedTime ? "text-base-content" : "text-base-content/40"
          }`}
        >
          <FaClock />
          <p>
            {selectedTime
              ? `${selectedTime.hour}:${padTime(selectedTime.minute)} ${
                  selectedTime.period
                }`
              : "Select time"}
          </p>
        </div>
        <button
          className="flex flex-row items-center justify-between px-3 py-2 h-full w-25 text-left border border-transparent border-l-base-content/20 text-base-content"
          onClick={() => setIsOpen(!isOpen)}
        >
          <p className="pl-1">Select</p>
          <FaAngleDown />
        </button>
      </div>
      <ul className="dropdown-content menu absolute mt-2 z-10">
        <li>
          <TimePicker
            value={value}
            onChange={setSelectedTime}
            min={min}
            max={max}
          />
        </li>
      </ul>
    </div>
  );
};

export default TimePickerSelector;
