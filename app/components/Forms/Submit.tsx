"use client";
import { useRouter } from "next/navigation";
import { FaRegCheckCircle } from "react-icons/fa";
import { FaArrowLeft } from "react-icons/fa6";

const Submit = ({
  readOnly = false,
  backHref,
  onBack,
}: {
  readOnly?: boolean;
  backHref?: string;
  onBack?: () => void;
}) => {
  const router = useRouter();

  const handleBack = () => {
    if (onBack) {
      onBack();
      return;
    }

    if (backHref) {
      router.push(backHref);
      return;
    }

    router.back();
  };

  return (
    <div className="flex flex-row justify-between">
      <button type="button" className="btn btn-outline" onClick={handleBack}>
        <FaArrowLeft />
        Back
      </button>
      {readOnly ? (
        <div></div>
      ) : (
        <button className="btn btn-primary">
          <FaRegCheckCircle className="h-4 w-4" />
          Submit
        </button>
      )}
    </div>
  );
};

export default Submit;
