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
  noFormOutput = false,
  readonly = false,
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
    const newOption =
      options.find((o) => o.value === (value ?? defaultValue)) || null;

    // Only update internal state — DO NOT call onChange here
    setSelectedOption((prev) => {
      if (prev?.value === newOption?.value) return prev; // avoid unnecessary state updates
      return newOption;
    });
  }, [value, defaultValue, options]);

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
      <fieldset
        ref={sizeRef}
        className={`fieldset ${className ? className : "w-full"}`}
      >
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
          popoverTarget={readonly ? undefined : popoverName}
          style={
            readonly
              ? { pointerEvents: "none" }
              : ({ anchorName } as React.CSSProperties)
          }
        >
          {hint && (
            <p className="border p-2 border-transparent border-r-base-300">
              {hint}
            </p>
          )}

          <p
            className={`ml-1 p-2 text-left ${
              selectedOption ? "" : "text-base-content/50"
            }`}
          >
            {selectedOption?.label || placeholder}
          </p>

          {!readonly && <FaChevronDown className="cursor-pointer" />}
        </button>

        <input
          name={noFormOutput ? undefined : name}
          value={selectedOption?.value ?? ""}
          type="text"
          className={`sr-only text-transparent w-full static validator-2 outline-none ring-0 focus:outline-none focus:ring-0 bg-transparent -mt-1.5 -mb-1.5`}
          required={required}
          onInvalid={(e) => {
            setHasError(true);
            if (onInvalid) onInvalid();
          }}
          onChange={() => {}}
          style={{ caretColor: "transparent" }}
          readOnly
        />

        <div className="flex flex-col -mt-1.5">
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
              className={`w-full text-left p-2 ${
                bgColor == "bg-base-200"
                  ? "hover:bg-base-100"
                  : "hover:bg-base-200"
              }`}
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
