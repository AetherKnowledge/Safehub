import DefaultLoading from "../DefaultLoading";
import ModalBase from "./ModalBase";

const LoadingPopup = ({ message }: { message?: string }) => {
  return (
    <ModalBase>
      <div className="bg-base-100 p-6 rounded-lg shadow-lg text-center">
        <DefaultLoading size="loading-lg" message={message} />
      </div>
    </ModalBase>
  );
};

export default LoadingPopup;
