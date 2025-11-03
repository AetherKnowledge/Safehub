import { IconType } from "react-icons";

type InputBoxProps = {
  name: string;
  legend?: string;
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
  bgColor?: string;
  size?: "input-xs" | "input-sm" | "input-md" | "input-lg" | "input-xl";
  required?: boolean;
  icon?: IconType;
};

const InputBox = ({
  name,
  legend,
  defaultValue,
  placeholder,
  type = "text",
  bgColor = "bg-base-200",
  size = "input-sm",
  icon: Icon,
  required = false,
}: InputBoxProps) => {
  return (
    <>
      <fieldset className="fieldset w-full">
        <legend className="fieldset-legend pb-1 gap-1">
          {legend} {required && <span className="text-error">*</span>}
        </legend>
        <label
          className={`input validator-2 ${size} no-outline rounded text-base-content w-full ${bgColor}`}
        >
          {Icon && <Icon />}
          <input
            pattern={type === "tel" ? "[0-9]*" : undefined}
            name={name}
            type={type}
            placeholder={placeholder}
            defaultValue={defaultValue}
            required={required}
          />
        </label>
        <p className="validator-hint hidden ml-1 mt-[-5px]">
          Must be a valid {type === "tel" ? "phone number" : type}
        </p>
      </fieldset>
    </>
  );
};

export default InputBox;
