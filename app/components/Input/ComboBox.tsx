import InputInterface from "./InputInterface";
import Legend from "./Legend";

type ComboBoxProps = InputInterface & {
  defaultValue?: string;
  placeholder?: string;
  options?: { label: string; value: string }[];
  bgColor?: string;
  size?: "select-xs" | "select-sm" | "select-md" | "select-lg" | "select-xl";
};

const ComboBox = ({
  name,
  legend,
  className,
  required = false,
  number,
  defaultValue,
  placeholder,
  options,
  bgColor = "bg-neutral",
  size = "select-sm",
}: ComboBoxProps) => {
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
      <select
        name={name}
        className={`select ${size} outline-none ring-0 focus:outline-none focus:ring-0 rounded ${bgColor} ${className}`}
        defaultValue={defaultValue}
        required={required}
      >
        <option disabled value="select">
          {placeholder}
        </option>
        {options?.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </fieldset>
  );
};

export default ComboBox;
