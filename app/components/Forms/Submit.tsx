"use client";
import { FaRegCheckCircle } from "react-icons/fa";
import { FaArrowLeft } from "react-icons/fa6";

const Submit = ({ onBack }: { onBack?: () => void }) => {
  return (
    <div className="flex flex-row justify-between">
      <button type="button" className="btn btn-outline" onClick={onBack}>
        <FaArrowLeft />
        Back
      </button>
      <button className="btn btn-primary">
        <FaRegCheckCircle className="h-4 w-4" />
        Submit
      </button>
    </div>
  );
};

export default Submit;
