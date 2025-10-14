type ComboBoxProps = {
  name: string;
  legend?: string;
  defaultValue?: string;
  placeholder?: string;
  options?: { label: string; value: string }[];
  bgColor?: string;
  size?: "select-xs" | "select-sm" | "select-md" | "select-lg" | "select-xl";
};

const ComboBox = ({
  name,
  legend,
  defaultValue,
  placeholder,
  options,
  bgColor = "bg-base-200",
  size = "select-sm",
}: ComboBoxProps) => {
  return (
    <fieldset className="fieldset w-full">
      <legend className="fieldset-legend pb-1">{legend}</legend>
      <select
        name={name}
        className={`select ${size} outline-none ring-0 focus:outline-none focus:ring-0 rounded ${bgColor}`}
        defaultValue={defaultValue}
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
