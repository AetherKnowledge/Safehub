import { useEffect, useRef, useState } from "react";
import { FaPlus, FaX } from "react-icons/fa6";
import { Option } from "../../Input/InputInterface";
import { getNextOptionName } from "./utils";

export type EditableSelectBoxProps = {
  className?: string;
  bgColor?: string;
  size?: "text-xs" | "text-sm" | "text-base" | "text-lg" | "text-xl";
  selected?: boolean;
  onChange?: (options: Option[]) => void;
};

const EditableSelectBox = ({
  className,
  bgColor = "bg-neutral",
  size,
  selected = false,
  onChange,
}: EditableSelectBoxProps) => {
  const [options, setOptions] = useState<Option[]>([
    { label: "Option 1", value: "option1" },
    { label: "Option 2", value: "option2" },
  ]);
  const [selectedOption, setSelectedOption] = useState<Option | null>(null);

  const wrapperRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (onChange) {
      onChange(options);
    }
  }, [options, onChange]);

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

  return (
    <fieldset className="fieldset w-full">
      <div
        ref={wrapperRef}
        className={`flex flex-col gap-2 rounded-lg ${className || ""}`}
      >
        {options.map((option, index) => (
          <div
            key={option.value}
            className="flex flex-row items-center justify-center gap-2"
          >
            <label
              key={option.value}
              onClick={() => setSelectedOption(option)}
              className={`flex flex-row w-full cursor-pointer items-center ${bgColor} p-2 rounded-lg border ${
                selectedOption?.value === option.value
                  ? "border-primary"
                  : "border-base-300 hover:border-base-content/50"
              }`}
            >
              <p>{index + 1}. </p>
              <input
                className="ml-2 bg-transparent w-full outline-none"
                value={option.label}
                placeholder="Option text here"
                onChange={(e) => {
                  setOptions((prevOptions) =>
                    prevOptions.map((opt) =>
                      opt.value === option.value
                        ? { ...opt, label: e.target.value }
                        : opt
                    )
                  );
                }}
              />
            </label>
            {selected && (
              <button
                className="btn btn-ghost btn-sm p-2"
                onClick={() => {
                  setOptions((prevOptions) =>
                    prevOptions.filter((opt) => opt.value !== option.value)
                  );
                }}
              >
                <FaX className="w-4 h-4" />
              </button>
            )}
          </div>
        ))}

        {selected && (
          <button
            className="btn btn-ghost btn-sm p-2"
            onClick={() => {
              setOptions((prevOptions) => {
                const nextNum = getNextOptionName(prevOptions);

                return [
                  ...prevOptions,
                  {
                    label: `Option ${nextNum}`,
                    value: crypto.randomUUID(),
                  },
                ];
              });
            }}
          >
            <FaPlus className="w-4 h-4" />
            Add Option
          </button>
        )}
      </div>
    </fieldset>
  );
};

export default EditableSelectBox;
