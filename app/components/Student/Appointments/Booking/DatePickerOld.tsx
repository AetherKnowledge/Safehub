"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { DatePickerRounded, DatePickerSize } from "./DatePickerEnum";
interface Props {
  className?: string;
  value?: string;
  onChange?: (value: string) => void;
  size?: DatePickerSize;
  rounded?: DatePickerRounded;
  border?: string;
  shadow?: string;
}

const DatePicker = ({
  className,
  value,
  onChange,
  size = DatePickerSize.MEDIUM,
  rounded = DatePickerRounded.ROUNDED,
  border = "border border-base-content",
  shadow = "shadow-br",
}: Props) => {
  const dateToday = new Date(Date.now()).toISOString().split("T")[0];
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  console.log("Size: ", size);

  // Load cally only in the browser
  useEffect(() => {
    import("cally").then(() => setLoading(false));
    console.log("Size: ", size);
  }, []);

  const handleDateChange = (date: string) => {
    router.push(`?date=${date}`);
  };

  return (
    <div className={className}>
      {loading ? (
        <div className="loading"></div>
      ) : (
        <calendar-date
          className={`bg-base-100 text-base-content ${size} ${rounded} ${border} ${shadow}`}
          value={value || dateToday}
          onchange={(e) =>
            onChange
              ? onChange((e.target as HTMLInputElement).value)
              : handleDateChange((e.target as HTMLInputElement).value)
          }
        >
          <svg
            aria-label="Previous"
            className="fill-current size-4 duration-150 ease-in-out hover:scale-120"
            slot="previous"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
          >
            <path fill="currentColor" d="M15.75 19.5 8.25 12l7.5-7.5"></path>
          </svg>
          <svg
            aria-label="Next"
            className="fill-current size-4"
            slot="next"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
          >
            <path fill="currentColor" d="m8.25 4.5 7.5 7.5-7.5 7.5"></path>
          </svg>
          <calendar-month></calendar-month>
        </calendar-date>
      )}
    </div>
  );
};

export default DatePicker;
