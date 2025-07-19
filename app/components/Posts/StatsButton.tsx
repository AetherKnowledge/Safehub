import React, { useEffect, useState } from "react";
import { IconType } from "react-icons";
import { PostStat } from "./PostActions";

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
  icon,
  value,
  label,
  color = "text-green-500",
  commentBtn = false,
  className,
}: ButtonProps) {
  const [optimisticValue, setOptimisticValue] = useState<PostStat>(value);

  useEffect(() => {
    if (commentBtn) {
      setOptimisticValue(value);
    }
  }, [value]);

  return (
    <label className="swap">
      <input
        type="checkbox"
        checked={optimisticValue.selected}
        onChange={(e) => {
          onChange(e.target.checked);
          setOptimisticValue((prev) => ({
            ...prev,
            selected: e.target.checked,
            count: commentBtn
              ? prev.count
              : prev.count + (e.target.checked ? 1 : -1),
          }));
        }}
      />
      <div className="swap-on flex flex-col items-center justify-between hover:cursor-pointer">
        {React.createElement(icon, {
          className: `text-2xl ${color} ${className || ""}`,
        })}
        <p>{`${optimisticValue.count.toString()} ${label}`}</p>
      </div>
      <div className="swap-off flex flex-col items-center justify-between hover:cursor-pointer">
        {React.createElement(icon, {
          className: `text-2xl text-base-content ${className || ""}`,
        })}
        <p>{`${optimisticValue.count.toString()} ${label}`}</p>
      </div>
    </label>
  );
}

export default StatButton;
