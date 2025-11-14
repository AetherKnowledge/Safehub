"use client";
import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import InputInterface from "./InputInterface";
import Legend from "./Legend";

export type TextAreaMarkdownProps = InputInterface & {
  placeholder?: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  value: string;
  onChange?: (value: string) => void;
  height?: string | number;
  width?: string | number;
};

const TextAreaMarkdown = ({
  name,
  legend,
  className,
  required = false,
  number,
  placeholder,
  bgColor = "bg-neutral",
  size = "md",
  value,
  onChange,
  onInvalid,
  noFormOutput = false,
}: TextAreaMarkdownProps) => {
  const [focused, setFocused] = useState(false);
  const [textAreaSize, setTextAreaSize] = useState(`textarea-${size}`);
  const [textSize, setTextSize] = useState(`text-${size}`);
  const [hasError, setHasError] = useState(false);
  const height = "h-30";

  useEffect(() => {
    setTextAreaSize(`textarea-${size}`);
    setTextSize(`text-${size}`);
  }, [size]);

  const content = value ?? "";

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

      {focused ? (
        <textarea
          name={noFormOutput ? undefined : name}
          placeholder={placeholder}
          className={`textarea ${textAreaSize} ${height} outline-none ring-0 focus:outline-none focus:ring-0 rounded text-base-content w-full ${bgColor} ${
            hasError ? "border-error" : "border-base-300"
          } ${className}`}
          required={required}
          value={value}
          onChange={(e) => {
            if (onChange) onChange(e.target.value);
          }}
          onInvalid={(e) => {
            setHasError(true);
            if (onInvalid) onInvalid();
          }}
          onBlur={() => setFocused(false)}
          autoFocus
        />
      ) : (
        <div
          className={`textarea w-full ${height} p-2 rounded overflow-x-auto cursor-text ${bgColor} ${
            hasError ? "border-error" : "border-base-300"
          }`}
          onClick={() => setFocused(true)}
        >
          {content.trim() ? (
            <div className={`prose max-w-none text-base-content ${textSize}`}>
              <ReactMarkdown>{content}</ReactMarkdown>
            </div>
          ) : (
            <span className="opacity-50">{placeholder}</span>
          )}
        </div>
      )}
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

export default TextAreaMarkdown;
