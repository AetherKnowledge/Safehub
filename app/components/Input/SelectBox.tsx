"use client";
import { useEffect, useRef, useState } from "react";
import { FaChevronDown } from "react-icons/fa";
import InputInterface, { Option } from "./InputInterface";
import Legend from "./Legend";

export type SelectBoxProps = InputInterface & {
  defaultValue?: Option["value"];
  options: Option[];
  size?: "text-xs" | "text-sm" | "text-base" | "text-lg" | "text-xl";
  hint?: string;
  onChange?: (value: Option) => void;
  placeholder?: string;
  value?: string;
};

const SelectBox = ({
  name,
  legend,
  className,
  required = false,
  hint,
  number,
  defaultValue,
  options,
  bgColor = "bg-neutral",
  size = "text-xs",
  onChange,
  onInvalid,
  placeholder = "Select an option",
  value,
}: SelectBoxProps) => {
  const [selectedOption, setSelectedOption] = useState<Option | null>(
    options.find((option) => option.value === defaultValue) || null
  );
  const [hasError, setHasError] = useState(false);
  function handleSelect(item: Option | null) {
    if (onChange && item) onChange(item);
    setSelectedOption(item);
    setHasError(false);
  }
  const [width, setWidth] = useState(200);
  const sizeRef = useRef<HTMLFieldSetElement | null>(null);

  const popoverName = name + "-popover";
  const anchorName = "--" + name + "-anchor";

  useEffect(() => {
    handleSelect(
      options.find((option) => option.value === (value || defaultValue)) || null
    );
  }, [value, options]);

  useEffect(() => {
    const element = sizeRef.current;
    if (!element) return;

    // Create ResizeObserver to detect element size changes
    const observer = new ResizeObserver(([entry]) => {
      const { width } = entry.contentRect;
      setWidth(width);
    });

    observer.observe(element);

    // Cleanup
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <fieldset ref={sizeRef} className="fieldset w-full">
        {legend && (
          <Legend
            legend={legend}
            required={required}
            number={number}
            size={size}
          />
        )}
        <button
          type="button"
          className={`flex pr-2 justify-between items-center ${bgColor} rounded-lg cursor-pointer border ${
            hasError ? "border-error" : "border-base-300"
          } ${className} ${size}`}
          popoverTarget={popoverName}
          style={{ anchorName } as React.CSSProperties}
        >
          {hint && (
            <p className="border p-2 border-transparent border-r-base-300">
              {hint}
            </p>
          )}

          <input
            name={name}
            value={selectedOption?.value ?? ""}
            type="text"
            className="sr-only h-full static validator-2 outline-none ring-0 focus:outline-none focus:ring-0"
            required={required}
            onInvalid={(e) => {
              setHasError(true);
              if (onInvalid) onInvalid();
            }}
            onChange={() => {}}
            style={{ caretColor: "transparent" }}
          />

          <p
            className={`w-full p-2 text-left ${
              selectedOption ? "" : "text-base-content/50"
            }`}
          >
            {selectedOption?.label || placeholder}
          </p>

          <FaChevronDown className="cursor-pointer" />
        </button>

        <div className="flex flex-col">
          <p
            className={`text-xs text-error ml-1 mt-[-5px] ${
              hasError ? "" : "hidden"
            }`}
          >
            This field is required.
          </p>
        </div>
      </fieldset>

      <ul
        className={`dropdown dropdown-end menu rounded-box ${bgColor} rounded-lg border-base-300 shadow-sm ${size}`}
        popover="auto"
        id={popoverName}
        style={{ positionAnchor: anchorName, width } as React.CSSProperties}
      >
        {options.map((option) => (
          <li key={option.value}>
            <button
              type="button"
              className="w-full text-left p-2 hover:bg-base-200"
              onClick={() => handleSelect(option)}
            >
              {option.label}
            </button>
          </li>
        ))}
      </ul>
    </>
  );
};
export default SelectBox;
