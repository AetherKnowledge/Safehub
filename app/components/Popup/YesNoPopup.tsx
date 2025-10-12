import ModalBase from "./ModalBase";

const YesNoPopup = ({
  message,
  onYes,
  onNo,
}: {
  message?: string;
  onYes?: () => void;
  onNo?: () => void;
}) => {
  return (
    <ModalBase>
      <div className="bg-base-100 p-6 rounded-lg shadow-lg text-center">
        <div className="flex flex-col items-center justify-center h-full space-y-4">
          <p className="text-base-content">{message || "Are you sure?"}</p>
          <div className="flex flex-row items-center justify-between gap-4 w-full">
            <button className="btn btn-primary" onClick={onYes}>
              Yes
            </button>
            <button className="btn btn-error" onClick={onNo}>
              No
            </button>
          </div>
        </div>
      </div>
    </ModalBase>
  );
};

export default YesNoPopup;
