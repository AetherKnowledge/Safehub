import DefaultLoading from "../DefaultLoading";
import ModalBase from "./ModalBase";

const LoadingPopup = ({ message }: { message?: string }) => {
  return (
    <ModalBase>
      <div className="bg-base-100 border border-base-300 shadow-xl rounded-2xl px-6 py-5 max-w-sm w-full text-center text-base-content">
        <div className="flex flex-col items-center justify-center gap-3">
          <DefaultLoading size="loading-lg" message={message} />
          {!message && (
            <p className="text-xs text-base-content/70">Please wait…</p>
          )}
        </div>
      </div>
    </ModalBase>
  );
};

export default LoadingPopup;
