import ModalBase from "./ModalBase";

const LoadingPopup = ({ message }: { message?: string }) => {
  return (
    <ModalBase>
      <div className="bg-base-100 p-6 rounded-lg shadow-lg text-center">
        <div className="flex flex-col items-center justify-center h-full space-y-4">
          <div className="loading loading-spinner loading-lg text-primary"></div>
          <p className="text-base-content">{message || "Loading..."}</p>
        </div>
      </div>
    </ModalBase>
  );
};

export default LoadingPopup;
