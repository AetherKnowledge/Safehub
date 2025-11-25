import { IoMdClose } from "react-icons/io";

const CloseButton = ({ onClick }: { onClick: () => void }) => {
  return (
    <button
      type="button"
      className="btn btn-ghost btn-error p-0 h-8 w-8 self-end"
      onClick={onClick}
    >
      <IoMdClose className="w-6 h-6" />
    </button>
  );
};

export default CloseButton;
