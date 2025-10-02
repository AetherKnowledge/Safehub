type ComboBoxProps = {
  name: string;
  legend?: string;
  defaultValue?: string;
  placeholder?: string;
  options?: { label: string; value: string }[];
};

const ComboBox = ({
  name,
  legend,
  defaultValue,
  placeholder,
  options,
}: ComboBoxProps) => {
  return (
    <fieldset className="fieldset w-full">
      <legend className="fieldset-legend pb-1">{legend}</legend>
      <select
        name={name}
        className="select select-sm outline-none ring-0 focus:outline-none focus:ring-0 rounded bg-base-200"
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
