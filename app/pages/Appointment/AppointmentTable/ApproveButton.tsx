"use client";

import { FaCheckCircle } from "react-icons/fa";

interface ApproveButton {
  onClick?: () => void;
}

const ApproveButton = ({ onClick }: ApproveButton) => {
  return (
    <button
      className="flex flex-row btn btn-info gap-1 justify-center items-center btn-sm h-8"
      onClick={onClick}
    >
      <FaCheckCircle className="w-3 h-3" />
      Approve
    </button>
  );
};

export default ApproveButton;
