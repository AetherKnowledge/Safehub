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
  const isActive = value.toLowerCase() === currentValue.toLowerCase();

  return (
    <button
      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
        isActive
          ? "bg-primary text-primary-content shadow-md"
          : "bg-base-200/50 text-base-content/70 hover:bg-base-200 hover:text-base-content"
      }`}
      disabled={isActive}
      onClick={() => onClick?.(value)}
    >
      {children}
    </button>
  );
};

export default FilterButton;
