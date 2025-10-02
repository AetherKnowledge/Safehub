type InputBoxProps = {
  name: string;
  legend?: string;
  defaultValue?: string;
  placeholder?: string;
  password?: boolean;
};

const InputBox = ({
  name,
  legend,
  defaultValue,
  placeholder,
  password = false,
}: InputBoxProps) => {
  return (
    <fieldset className="fieldset w-full">
      <legend className="fieldset-legend pb-1">{legend}</legend>
      <input
        name={name}
        type={password ? "password" : "text"}
        placeholder={placeholder}
        className="input input-sm outline-none ring-0 focus:outline-none focus:ring-0 rounded bg-base-200"
        defaultValue={defaultValue}
      />
    </fieldset>
  );
};

export default InputBox;
