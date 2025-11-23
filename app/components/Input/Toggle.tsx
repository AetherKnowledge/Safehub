type ToggleProps = {
  isChecked: boolean;
  onToggle: (value: boolean) => void;
  showText?: boolean;
  disabled?: boolean;
  size?: "toggle-xs" | "toggle-sm" | "toggle-md" | "toggle-lg" | "toggle-xl";
  leftText?: boolean;
  onText?: string;
  offText?: string;
  fontWeight?: "font-light" | "font-normal" | "font-semibold" | "font-bold";
  className?: string;
};

const Toggle = ({
  isChecked,
  onToggle,
  showText = true,
  disabled = false,
  size = "toggle-md",
  leftText = false,
  onText = "On",
  offText = "Off",
  fontWeight = "font-semibold",
  className,
}: ToggleProps) => {
  return (
    <div
      className={`flex flex-row gap-2 items-center text-sm ${fontWeight} pr-2`}
    >
      {showText && leftText && (isChecked && !disabled ? onText : offText)}
      <input
        type="checkbox"
        className={`toggle border-base-300/50 bg-base-300/50 text-white checked:border-primary checked:bg-primary checked:text-white ${
          disabled && "cursor-not-allowed opacity-50"
        } ${size} ${className}`}
        checked={isChecked}
        onChange={(e) => {
          if (disabled) return;
          onToggle(e.target.checked);
        }}
      />
      {showText && !leftText && (isChecked && !disabled ? onText : offText)}
    </div>
  );
};

export default Toggle;
