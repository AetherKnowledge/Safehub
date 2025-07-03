import React from "react";
import { useEffect } from "react";

interface Props {
  className?: string;
  value?: string;
  onChange?: (value: string) => void;
}

const DatePicker = ({ className, value, onChange }: Props) => {
  const [hasCallyLoaded, setHasCallyLoaded] = React.useState(false);

  useEffect(() => {
    import("cally").then(() => {
      setTimeout(() => {
        setHasCallyLoaded(true);
      }, 0); // 100 ms delay
    });
  }, []);

  const dateToday = new Date(Date.now()).toISOString().split("T")[0];

  return (
    <div className={className}>
      {hasCallyLoaded ? (
        <calendar-date
          className="cally2 bg-base-100 border border-base-content shadow-br text-base-content rounded-box"
          value={value || dateToday}
          onchange={(e) =>
            onChange && onChange((e.target as HTMLInputElement).value)
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
      ) : (
        <div className="loading"></div>
      )}
    </div>
  );
};

export default DatePicker;
