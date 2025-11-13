"use client";
import { FaRegCheckCircle } from "react-icons/fa";
import { FaArrowLeft } from "react-icons/fa6";
import QuestionBG from "./QuestionBG";

const Submit = ({ onBack }: { onBack?: () => void }) => {
  return (
    <QuestionBG className="flex flex-row justify-between py-5 px-5">
      <button type="button" className="btn btn-outline" onClick={onBack}>
        <FaArrowLeft />
        Back
      </button>
      <button className="btn btn-primary">
        <FaRegCheckCircle className="h-4 w-4" />
        Submit
      </button>
    </QuestionBG>
  );
};

export default Submit;
