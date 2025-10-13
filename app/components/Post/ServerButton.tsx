"use server";
import React from "react";
import { IconType } from "react-icons";

interface Props {
  onChange: (value: boolean) => void;
  icon: IconType;
  value: number;
  label: string;
  color?: string;
  className?: string;
}

const ServerButton = ({
  icon,
  value,
  label,
  color = "text-green-500",
  className = "",
}: Props) => {
  return (
    <label className="swap">
      <input type="checkbox" />
      <div className="swap-on flex flex-col items-center justify-between hover:cursor-pointer">
        {React.createElement(icon, {
          className: `text-2xl ${color} ${className}`,
        })}
        <p>{`${value.toString()} ${label}`}</p>
      </div>
      <div className="swap-off flex flex-col items-center justify-between hover:cursor-pointer">
        {React.createElement(icon, {
          className: `text-2xl text-base-content ${className}`,
        })}
        <p>{`${value.toString()} ${label}`}</p>
      </div>
    </label>
  );
};

export default ServerButton;
