import { ReactNode } from "react";

const Cell = ({
  isFirst = false,
  children,
  className = "",
}: {
  isFirst?: boolean;
  children?: ReactNode;
  className?: string;
}) => {
  return (
    <div
      className={`${className} w-full p-4 px-6 ${isFirst ? "text-left" : ""}`}
    >
      {children}
    </div>
  );
};

export default Cell;
