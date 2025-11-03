type TextAreaProps = {
  name: string;
  legend?: string;
  defaultValue?: string;
  placeholder?: string;
  bgColor?: string;
  size?:
    | "textarea-xs"
    | "textarea-sm"
    | "textarea-md"
    | "textarea-lg"
    | "textarea-xl";
  required?: boolean;
};

const TextArea = ({
  name,
  legend,
  defaultValue,
  placeholder,
  bgColor = "bg-base-200",
  size = "textarea-sm",
  required = false,
}: TextAreaProps) => {
  return (
    <fieldset className="fieldset w-full">
      <legend className="fieldset-legend pb-1 gap-1">
        {legend} {required && <span className="text-error">*</span>}
      </legend>
      <textarea
        name={name}
        placeholder={placeholder}
        className={`textarea ${size} outline-none ring-0 focus:outline-none focus:ring-0 rounded text-base-content w-full ${bgColor}`}
        defaultValue={defaultValue}
        required={required}
      />
    </fieldset>
  );
};

export default TextArea;
