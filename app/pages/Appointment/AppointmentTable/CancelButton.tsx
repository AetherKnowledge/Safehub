import { MdCancel } from "react-icons/md";

const CancelButton = ({
  onCancel,
  text,
}: {
  onCancel?: () => void;
  text?: string;
}) => {
  return (
    <button
      className="flex flex-row btn btn-error gap-1 justify-center items-center btn-sm h-8"
      onClick={onCancel}
    >
      <MdCancel className="w-3 h-3" />
      {text || "Cancel"}
    </button>
  );
};

export default CancelButton;
