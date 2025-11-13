import Image from "next/image";
import ModalBase from "../../../components/Popup/ModalBase";

type RingingPopupProps = {
  callerName: string;
  callerImage?: string;
  onAnswer: () => void;
  onReject: () => void;
};

const RingingPopup = ({
  callerName,
  callerImage,
  onAnswer,
  onReject,
}: RingingPopupProps) => {
  return (
    <ModalBase>
      <div className="bg-base-100 p-6 rounded-lg shadow-lg text-center">
        <h3 className="text-xl font-bold mb-4 text-base-content">
          Incoming Call
        </h3>
        <div className="flex flex-col items-center justify-center">
          {callerImage ? (
            <Image
              className="w-10 h-10 rounded-full "
              src={callerImage}
              alt={callerName || "User Profile"}
              width={40}
              height={40}
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gray-500 text-white flex items-center justify-center font-bold select-none cursor-pointer">
              {callerName.charAt(0).toUpperCase()}
            </div>
          )}
          <p className="mb-4 text-base-content">{callerName}</p>
        </div>
        <div className="flex justify-center gap-4">
          <button
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            onClick={onAnswer}
          >
            Answer
          </button>
          <button
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            onClick={onReject}
          >
            Reject
          </button>
        </div>
      </div>
    </ModalBase>
  );
};

export default RingingPopup;
