"use client";
import React from "react";

const FilterButton = ({
  value,
  currentValue,
  children = value,
  onClick,
}: {
  value: string;
  currentValue: string;
  children?: React.ReactNode;
  defaultState?: boolean;
  onClick?: (value: string) => void;
}) => {
  return (
    <button
      className="btn btn-ghost shadow-none bg-base-100 disabled:bg-base-300 disabled:text-base-content hover:bg-base-200 active:bg-base-300 p-2 h-8"
      disabled={value.toLowerCase() === currentValue.toLowerCase()}
      onClick={() => onClick?.(value)}
    >
      {children}
    </button>
  );
};

export default FilterButton;
