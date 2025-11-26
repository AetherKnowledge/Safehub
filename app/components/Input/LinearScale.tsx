"use client";
import { useEffect, useState } from "react";
import InputInterface from "./InputInterface";
import Legend from "./Legend";

export type LinearScaleProps = InputInterface & {
  min?: 0 | 1;
  max?: 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
  minText?: string;
  maxText?: string;
  defaultValue?: number;
  onChange?: (value: number) => void;
  size?: "radio-xs" | "radio-sm" | "radio-md" | "radio-lg" | "radio-xl";
};

const LinearScale = ({
  name,
  legend,
  className,
  required = false,
  number,
  min = 1,
  max = 5,
  defaultValue,
  onChange,
  size = "radio-md",
  noFormOutput = false,
  bgColor = "bg-neutral",
  onInvalid,
  readonly = false,
  minText,
  maxText,
  answerOnly = false,
}: LinearScaleProps) => {
  const [currentValue, setCurrentValue] = useState<number | undefined>(
    defaultValue
  );
  const [hasError, setHasError] = useState(false);
  const numbers = Array.from({ length: max - min + 1 }, (_, i) => i + min);

  useEffect(() => {
    // If current value is no longer valid, reset it to defaultValue
    if (
      currentValue === undefined ||
      currentValue < min ||
      currentValue > max
    ) {
      setCurrentValue(defaultValue);
    }
  }, [min, max, defaultValue]);

  return (
    <fieldset className="fieldset w-full">
      {legend && (
        <Legend
          legend={legend}
          required={answerOnly ? undefined : required}
          number={number}
          size={size}
        />
      )}

      {/* Grid layout: numbers on top row, radios middle row, min/max labels bottom */}
      <div className={`${className || ""}`}>
        {/* Grid with side label columns so labels sit right beside radios */}
        <div
          className="grid items-center w-full gap-x-4 gap-y-2 p-4"
          style={{
            gridTemplateColumns: `auto repeat(${numbers.length}, minmax(0,1fr)) auto`,
          }}
        >
          {/* Row 1: empty left, numbers across, empty right */}
          <div />
          {numbers.map((n) => (
            <div
              key={`num-${n}`}
              className="text-center text-sm text-base-content"
            >
              {n}
            </div>
          ))}
          <div />

          {/* Row 2: minText, radios, maxText */}
          <div className="text-left text-sm text-muted-foreground">
            {minText}
          </div>
          {numbers.map((n) => (
            <label
              key={`input-${n}`}
              className={`flex justify-center items-center p-2 bg-transparent border-transparent rounded-lg border ${
                hasError
                  ? "border-error"
                  : currentValue === n
                  ? "border-base-content"
                  : "border-base-300"
              } ${readonly && "pointer-events-none"}`}
              onClick={() => {
                if (readonly) return;
                setCurrentValue(n);
                setHasError(false);
                if (onChange) onChange(n);
              }}
            >
              <input
                name={noFormOutput ? undefined : name}
                type="radio"
                className={`radio ${size} disabled:opacity-100`}
                value={n}
                required={required}
                checked={currentValue === n}
                onInvalid={() => {
                  setHasError(true);
                  if (onInvalid) onInvalid();
                }}
                onChange={() => {
                  if (readonly) return;
                  setHasError(false);
                  setCurrentValue(n);
                  if (onChange) onChange(n);
                }}
                readOnly={readonly}
              />
            </label>
          ))}
          <div className="text-right text-sm text-muted-foreground">
            {maxText}
          </div>
        </div>

        {/* error message */}
        <div className="mt-1">
          <p className={`text-xs text-error ml-1 ${hasError ? "" : "hidden"}`}>
            This field is required.
          </p>
        </div>
      </div>
    </fieldset>
  );
};

export default LinearScale;
