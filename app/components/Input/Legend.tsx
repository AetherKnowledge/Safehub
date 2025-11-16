const Legend = ({
  number,
  legend,
  required,
  size,
}: {
  number?: number;
  legend: string;
  required?: boolean;
  size?: string;
}) => {
  const textSizeClass = size?.includes("xs")
    ? "text-xs"
    : size?.includes("sm")
    ? "text-xs"
    : size === "lg"
    ? "text-base"
    : size?.includes("xl")
    ? "text-lg"
    : "text-sm";

  return (
    <legend
      className={`pl-1 fieldset-legend pt-1 pb-1 gap-1 justify-between w-full ${textSizeClass} font-medium`}
    >
      <span>
        {number ? number.toString() + ". " : ""} {legend}
      </span>
      {required && <span className="text-error">Required</span>}
    </legend>
  );
};

export default Legend;
