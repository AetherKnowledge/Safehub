"use client";
import { useState } from "react";
import InputInterface from "./InputInterface";
import Legend from "./Legend";

export type TextAreaProps = InputInterface & {
  defaultValue?: string;
  placeholder?: string;
  size?:
    | "textarea-xs"
    | "textarea-sm"
    | "textarea-md"
    | "textarea-lg"
    | "textarea-xl";
  onChange?: (value: string) => void;
};

const TextArea = ({
  name,
  legend,
  className,
  required = false,
  number,
  defaultValue,
  placeholder,
  bgColor = "bg-neutral",
  size = "textarea-md",
  onChange,
  onInvalid,
}: TextAreaProps) => {
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
      <textarea
        name={name}
        placeholder={placeholder}
        className={`textarea ${size} outline-none ring-0 focus:outline-none focus:ring-0 rounded text-base-content w-full ${bgColor} ${
          hasError ? "border-error" : "border-base-300"
        } ${className}`}
        defaultValue={defaultValue}
        required={required}
        onInvalid={(e) => {
          setHasError(true);
          if (onInvalid) onInvalid();
        }}
        onChange={(e) => {
          if (onChange) onChange(e.target.value);
        }}
      />
      <p
        className={`text-xs text-error ml-1 mt-[-5px] ${
          hasError ? "" : "hidden"
        }`}
      >
        This field is required.
      </p>
    </fieldset>
  );
};

export default TextArea;
