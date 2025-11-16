"use client";
import { useState } from "react";
import InputInterface, { Option } from "./InputInterface";
import Legend from "./Legend";

export type RadioBoxProps = InputInterface & {
  // Define any additional props needed for RadioBox here
  defaultValue?: Option["value"];
  options: Option[];
  size?: "radio-xs" | "radio-sm" | "radio-md" | "radio-lg" | "radio-xl";
  onChange?: (value: Option) => void;
};

const RadioBox = ({
  name,
  legend,
  className,
  required = false,
  number,
  defaultValue,
  options,
  bgColor = "bg-neutral",
  size = "radio-xs",
  onChange,
  onInvalid,
  noFormOutput = false,
  readonly = false,
}: RadioBoxProps) => {
  const [currentValue, setCurrentValue] = useState<Option | undefined>(
    options.find((option) => option.value === defaultValue)
  );
  const [hasError, setHasError] = useState(false);

  return (
    <fieldset className="fieldset w-full">
      {legend && (
        <Legend
          legend={legend}
          required={required}
          number={number}
          size={size}
        />
      )}
      <div className={`flex flex-col gap-2 rounded-lg ${className || ""}`}>
        {options.map((option) => (
          <label
            key={option.value}
            className={`cursor-pointer ${bgColor} p-2 rounded-lg border ${
              hasError
                ? "border-error"
                : currentValue?.value === option.value
                ? "border-base-content"
                : "border-base-300 hover:border-base-content/50"
            }`}
            onClick={() => setCurrentValue(option)}
          >
            <input
              type="radio"
              className={`radio ${size}`}
              name={noFormOutput ? undefined : name}
              value={option.value}
              required={required}
              defaultChecked={defaultValue === option.value}
              onInvalid={(e) => {
                setHasError(true);
                if (onInvalid) onInvalid();
              }}
              onChange={(e) => {
                setHasError(false);
                if (onChange && currentValue) onChange(option);
              }}
            />
            <span className="ml-2">{option.label}</span>
          </label>
        ))}
        <div className="flex flex-col">
          <p
            className={`text-xs text-error ml-1 mt-[-5px] ${
              hasError ? "" : "hidden"
            }`}
          >
            This field is required.
          </p>
        </div>
      </div>
    </fieldset>
  );
};

export default RadioBox;
