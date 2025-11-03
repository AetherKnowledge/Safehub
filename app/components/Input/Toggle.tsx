type ToggleProps = {
  isChecked: boolean;
  onToggle: (value: boolean) => void;
  showText?: boolean;
  disabled?: boolean;
};

const Toggle = ({
  isChecked,
  onToggle,
  showText = true,
  disabled = false,
}: ToggleProps) => {
  return (
    <div className="flex flex-row gap-2 items-center text-sm font-semibold pr-2">
      <input
        type="checkbox"
        className={`toggle border-base-300 bg-base-300 text-white checked:border-primary checked:bg-primary checked:text-white ${
          disabled && "cursor-not-allowed opacity-50"
        }`}
        checked={isChecked}
        onChange={(e) => {
          if (disabled) return;
          onToggle(e.target.checked);
        }}
      />
      {showText && (isChecked && !disabled ? "On" : "Off")}
    </div>
  );
};

export default Toggle;
