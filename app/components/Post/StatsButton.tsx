import { IconType } from "react-icons";
import { PostStat } from "../../pages/Post/PostActions";

type ButtonProps = {
  onChange: (value: boolean) => Promise<void>;
  icon: IconType;
  value: PostStat;
  label: string;
  color?: string;
  commentBtn?: boolean;
  className?: string;
};

function StatButton({
  onChange,
  icon: Icon,
  value,
  label,
  color = "text-green-500",
  className,
}: ButtonProps) {
  return (
    <label className="swap btn btn-ghost btn-xs px-1 cursor-pointer">
      <input
        type="checkbox"
        checked={value.selected}
        onChange={(e) => {
          onChange(e.target.checked);
        }}
      />
      <div className="swap-on flex flex-col items-center justify-between hover:cursor-pointer">
        {Icon && <Icon className={`text-xl ${color} ${className || ""}`} />}
      </div>
      <div className="swap-off flex flex-col items-center justify-between hover:cursor-pointer">
        {Icon && (
          <Icon className={`text-xl text-base-content ${className || ""}`} />
        )}
      </div>
    </label>
  );
}

export default StatButton;
