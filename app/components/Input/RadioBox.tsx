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
  const [currentValue, setCurrentValue] = useState<Option | undefined>(() => {
    if (!defaultValue) return undefined;

    const option = options.find((option) => option.value === defaultValue);
    const other = options.find((option) => option.other);

    if (option) {
      return option;
    } else if (other) {
      return other;
    }
  });
  const [otherText, setOtherText] = useState<string | undefined>(() => {
    if (!defaultValue || readonly) return undefined;
    const other = options.some((option) => option.other);
    if (other) {
      return defaultValue;
    }
  });
  const [otherError, setOtherError] = useState(false);
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
            className={`flex flex-row items-center cursor-pointer ${bgColor} p-2 rounded-lg border ${
              hasError || (option.other && otherError)
                ? "border-error"
                : currentValue?.value === option.value
                ? "border-base-content hover:border-base-content/50"
                : "border-base-300"
            } ${readonly ? "pointer-events-none" : ""}`}
            onClick={() => {
              if (readonly) return;

              setHasError(false);
              setOtherError(false);
              setCurrentValue(option);
              setHasError(false);
            }}
          >
            <input
              type="radio"
              className={`radio ${size}`}
              name={noFormOutput ? undefined : name}
              value={option.other ? otherText : option.value}
              required={required}
              checked={currentValue?.value === option.value}
              onInvalid={(e) => {
                setHasError(true);
                onInvalid?.();
              }}
              onChange={() => {}}
              readOnly={readonly}
            />
            <span className="ml-2">
              {option.label}
              {option.other && ": "}
            </span>
            {option.other && (
              <input
                type="text"
                className={`no-outline border-b-1 border-dotted w-full ml-2`}
                value={otherText || ""}
                required={required && option.value === currentValue?.value}
                onInvalid={(e) => {
                  setOtherError(true);
                  if (onInvalid) onInvalid();
                }}
                onChange={(e) => {
                  setHasError(false);
                  setOtherError(false);
                  setOtherText(e.target.value);
                  onChange?.({ label: option.label, value: e.target.value });
                }}
                readOnly={readonly}
              />
            )}
          </label>
        ))}
        <div className="flex flex-col">
          <p
            className={`text-xs text-error ml-1 mt-[-5px] ${
              hasError || otherError ? "" : "hidden"
            }`}
          >
            {otherError
              ? "Please enter a value for 'Other'"
              : "This field is required."}
          </p>
        </div>
      </div>
    </fieldset>
  );
};

export default RadioBox;
