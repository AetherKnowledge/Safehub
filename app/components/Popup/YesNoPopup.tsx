import { HelpCircle } from "lucide-react";
import { FaExclamation } from "react-icons/fa";
import ModalBase from "./ModalBase";

const YesNoPopup = ({
  message,
  onYes,
  onNo,
  warning = false,
}: {
  message?: string;
  onYes?: () => void;
  onNo?: () => void;
  warning?: boolean;
}) => {
  console.log("Rendering YesNoPopup", warning);

  return (
    <ModalBase>
      <div className="bg-base-100 border border-base-300 shadow-xl rounded-2xl px-6 py-5 max-w-sm w-full text-base-content">
        <div className="flex flex-col items-center text-center gap-4">
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-base-200 text-base-content">
            {warning ? (
              <FaExclamation className="w-6 h-6" />
            ) : (
              <HelpCircle className="w-6 h-6" />
            )}
          </div>
          <div className="space-y-1">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-base-content/80">
              Confirm action
            </p>
            <p className="text-sm text-base-content/80 break-words">
              {message || "Are you sure?"}
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-stretch gap-2 w-full mt-2">
            <button
              className="btn btn-primary btn-sm sm:flex-1 w-full"
              onClick={onYes}
            >
              Yes
            </button>
            <button
              className="btn btn-ghost btn-sm sm:flex-1 w-full"
              onClick={onNo}
            >
              No
            </button>
          </div>
        </div>
      </div>
    </ModalBase>
  );
};

export default YesNoPopup;
