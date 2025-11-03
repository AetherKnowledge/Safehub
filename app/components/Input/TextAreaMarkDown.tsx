"use client";
import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";

type TextAreaProps = {
  name: string;
  legend?: string;
  placeholder?: string;
  bgColor?: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  required?: boolean;
  value: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  height?: string | number;
  width?: string | number;
};

const TextAreaMarkdown = ({
  name,
  legend,
  placeholder,
  bgColor = "bg-base-200",
  size = "sm",
  required = false,
  value,
  onChange,
}: TextAreaProps) => {
  const [focused, setFocused] = useState(false);
  const [textAreaSize, setTextAreaSize] = useState(`textarea-${size}`);
  const [textSize, setTextSize] = useState(`text-${size}`);
  const height = "h-30";

  useEffect(() => {
    setTextAreaSize(`textarea-${size}`);
    setTextSize(`text-${size}`);
  }, [size]);

  const content = value ?? "";

  return (
    <fieldset className="fieldset w-full">
      {legend && (
        <legend className="fieldset-legend pb-1 gap-1">
          {legend} {required && <span className="text-error">*</span>}
        </legend>
      )}

      {focused ? (
        <textarea
          name={name}
          placeholder={placeholder}
          className={`textarea ${textAreaSize} ${height} outline-none ring-0 focus:outline-none focus:ring-0 rounded text-base-content w-full ${bgColor}`}
          required={required}
          value={value}
          onChange={onChange}
          onBlur={() => setFocused(false)}
          autoFocus
        />
      ) : (
        <div
          className={`textarea w-full ${height} p-2 rounded overflow-x-auto cursor-text ${bgColor}`}
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
    </fieldset>
  );
};

export default TextAreaMarkdown;
