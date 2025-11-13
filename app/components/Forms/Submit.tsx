import { FaRegCheckCircle } from "react-icons/fa";
import { FaArrowLeft } from "react-icons/fa6";
import QuestionBG from "./QuestionBG";

const Submit = () => {
  return (
    <QuestionBG className="flex flex-row justify-between py-5 px-5">
      <button type="button" className="btn btn-outline">
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
