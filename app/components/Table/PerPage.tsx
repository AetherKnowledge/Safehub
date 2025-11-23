"use client";
import { FaAngleDown } from "react-icons/fa6";

const PerPage = ({
  values = [5, 10, 15],
  perPage = 1,
  onChange,
}: {
  values?: number[];
  perPage?: number;
  onChange?: (value: number) => void;
}) => {
  return (
    <div className="flex items-center border border-base-content/20 rounded-md overflow-hidden w-fit bg-neutral">
      <span className="text-sm lg:text-md px-3 py-1.5 text-base-content/70 border-r border-base-content/20">
        Per page
      </span>

      <div className="relative">
        <select
          className="text-sm lg:text-md px-2 py-1.5 pr-6 focus:outline-none appearance-none bg-neutral text-base-content/90"
          value={perPage}
          onChange={(e) => {
            onChange?.(parseInt(e.target.value));
          }}
        >
          {values.map((value) => (
            <option key={value} value={value}>
              {value}
            </option>
          ))}
        </select>

        <FaAngleDown className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-xs text-base-content/70" />
      </div>
    </div>
  );
};

export default PerPage;
