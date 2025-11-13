// components/Divider.tsx
import React from "react";

type DividerProps = {
  orientation?: "horizontal" | "vertical";
  className?: string; // pass extra tailwind classes e.g. "my-4"
  colorClass?: string; // tailwind color class e.g. "bg-gray-300" or "border-gray-200"
  hairline?: boolean; // use transform scale for crisper hairline on retina
  width?: number; // only for vertical dividers
  height?: number; // only for horizontal dividers
};

export const Divider: React.FC<DividerProps> = ({
  orientation = "horizontal",
  className = "",
  colorClass = "bg-gray-300",
  hairline = false,
  width,
  height,
}) => {
  if (orientation === "vertical") {
    // vertical: 1px wide, full (or specified) height
    return (
      <div
        className={`w-px ${colorClass} ${className}`}
        style={{
          width,
          transform: hairline ? "scaleX(0.5)" : undefined,
          transformOrigin: hairline ? "center" : undefined,
        }}
        aria-hidden
      />
    );
  }

  // horizontal: 1px tall, full width by default
  return (
    <div
      className={`h-px ${colorClass} ${className}`}
      style={{
        height,
        transform: hairline ? "scaleY(0.5)" : undefined,
        transformOrigin: hairline ? "center" : undefined,
      }}
      aria-hidden
    />
  );
};

export default Divider;
