"use client";
import { IconType } from "react-icons";
import InputInterface from "./InputInterface";
import Legend from "./Legend";

export type TextBoxProps = InputInterface & {
  defaultValue?: string;
  placeholder?: string;
  type?:
    | "text"
    | "password"
    | "email"
    | "number"
    | "date"
    | "datetime-local"
    | "week"
    | "month"
    | "tel"
    | "url"
    | "search"
    | "time"
    | "color";
  size?: "input-xs" | "input-sm" | "input-md" | "input-lg" | "input-xl";
  pattern?: string;
  onChange?: (value: string) => void;
  icon?: IconType;
};

const TextBox = ({
  name,
  legend,
  className,
  required = false,
  number,
  defaultValue,
  placeholder,
  type = "text",
  bgColor = "bg-neutral",
  size = "input-sm",
  icon: Icon,
  pattern,
  onChange,
  onInvalid,
  noFormOutput,
}: TextBoxProps) => {
  return (
    <>
      <fieldset className="fieldset w-full">
        {legend && (
          <Legend
            legend={legend}
            required={required}
            number={number}
            size={size}
          />
        )}
        <label
          className={`input validator-2 ${size} no-outline rounded-lg text-base-content w-full ${bgColor} ${
            className || ""
          }`}
        >
          {Icon && <Icon />}
          <input
            pattern={
              type === "tel" ? "^(?:\\+?[1-9]\\d{6,14}|09\\d{9})$" : pattern
            }
            name={noFormOutput ? undefined : name}
            type={type}
            placeholder={placeholder}
            defaultValue={defaultValue}
            required={required}
            onInvalid={(e) => {
              onInvalid && onInvalid();
            }}
            onChange={(e) => {
              onChange && onChange(e.target.value);
            }}
          />
        </label>
        <p className="validator-hint hidden ml-1 mt-[-5px]">
          Must be a valid {type === "tel" ? "phone number" : type}
        </p>
      </fieldset>
    </>
  );
};

export default TextBox;
