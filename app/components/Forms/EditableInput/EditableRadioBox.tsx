import { useEffect, useRef, useState } from "react";
import { FaPlus, FaX } from "react-icons/fa6";
import { Option } from "../../Input/InputInterface";
import { getNextOptionName } from "./utils";

export type EditableRadioBoxProps = {
  className?: string;
  bgColor?: string;
  size?: "radio-xs" | "radio-sm" | "radio-md" | "radio-lg" | "radio-xl";
  selected?: boolean;
  options?: Option[];
  onChange?: (options: Option[]) => void;
};

const EditableRadioBox = ({
  className,
  bgColor = "bg-neutral",
  size,
  selected = false,
  options = [],
  onChange,
}: EditableRadioBoxProps) => {
  const [selectedOption, setSelectedOption] = useState<Option | null>(null);

  const wrapperRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setSelectedOption(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const hasOtherOption = (): boolean => {
    return options.some((option) => option.other);
  };

  return (
    <fieldset className="fieldset w-full">
      <div
        ref={wrapperRef}
        className={`flex flex-col gap-2 rounded-lg ${className || ""}`}
      >
        {options.map((option) => {
          return (
            <div
              key={option.value}
              className="flex flex-row items-center justify-center gap-2"
            >
              <label
                onClick={() => setSelectedOption(option)}
                className={`flex flex-row w-full cursor-pointer items-center ${bgColor} p-2 rounded-lg border ${
                  selectedOption?.value === option.value
                    ? "border-primary"
                    : "border-base-300 hover:border-base-content/50"
                }`}
              >
                <input
                  type="radio"
                  className={`radio ${size}`}
                  value={option.value}
                  checked={selectedOption?.value === option.value}
                  readOnly
                />
                {option.other ? (
                  <>
                    <span className="ml-2">Other:</span>
                    <input
                      type="text"
                      className={`no-outline border-b-1 border-dotted w-full ml-2`}
                      readOnly
                    />
                  </>
                ) : (
                  <input
                    className="ml-2 bg-transparent w-full outline-none"
                    value={option.label}
                    placeholder="Option text here"
                    onChange={(e) => {
                      const updatedOptions = options.map((opt) =>
                        opt.value === option.value
                          ? { ...opt, label: e.target.value }
                          : opt
                      );

                      onChange?.(updatedOptions);
                    }}
                  />
                )}
              </label>
              {selected && (
                <button
                  type="button"
                  className="btn btn-ghost btn-sm p-2"
                  onClick={() => {
                    const updatedOptions = options.filter(
                      (opt) => opt.value !== option.value
                    );
                    onChange?.(updatedOptions);
                  }}
                >
                  <FaX className="w-4 h-4" />
                </button>
              )}
            </div>
          );
        })}

        {selected && (
          <>
            <button
              type="button"
              className="btn btn-ghost btn-sm p-2"
              onClick={() => {
                const oldOptions = hasOtherOption()
                  ? options.filter((o) => !o.other)
                  : options;

                const otherOption = options.find((o) => o.other);

                const updatedOptions = [
                  ...oldOptions,
                  {
                    label: `Option ${getNextOptionName(options)}`,
                    value: crypto.randomUUID(),
                  },
                  ...(otherOption ? [otherOption] : []),
                ];
                onChange?.(updatedOptions);
              }}
            >
              <FaPlus className="w-4 h-4" />
              Add Option
            </button>
            {hasOtherOption() ? null : (
              <button
                type="button"
                className="btn btn-ghost btn-sm p-2"
                onClick={() => {
                  if (hasOtherOption()) return;

                  const updatedOptions = [
                    ...options,
                    {
                      label: "Other",
                      value: "other",
                      other: true,
                    },
                  ];
                  onChange?.(updatedOptions);
                }}
              >
                <FaPlus className="w-4 h-4" />
                Add Other
              </button>
            )}
          </>
        )}
      </div>
    </fieldset>
  );
};

export default EditableRadioBox;
