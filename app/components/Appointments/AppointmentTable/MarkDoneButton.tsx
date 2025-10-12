"use client";

import { FaCheckCircle } from "react-icons/fa";

interface MarkDoneButtonProps {
  onClick?: () => void;
}

const MarkDoneButton = ({ onClick }: MarkDoneButtonProps) => {
  return (
    <button
      className="flex flex-row btn btn-primary gap-1 justify-center items-center btn-sm h-8"
      onClick={onClick}
    >
      <FaCheckCircle className="w-3 h-3" />
      Mark Done
    </button>
  );
};

export default MarkDoneButton;
