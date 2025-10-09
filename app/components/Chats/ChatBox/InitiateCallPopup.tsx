import { CallStatus } from "@/app/generated/prisma";
import { Recipient } from "@/lib/socket/SocketEvents";
import Image from "next/image";
import ModalBase from "../../Popup/ModalBase";

type InitiateCallPopupProps = {
  recipients: Recipient[];
  chatName?: string;
  status: CallStatus;
  onCancel: () => void;
};

const InitiateCallPopup = ({
  recipients,
  chatName,
  onCancel,
  status,
}: InitiateCallPopupProps) => {
  function getChatName(): string {
    if (chatName) return chatName;
    if (recipients.length === 0) return "Unknown";
    if (recipients.length === 1) return recipients[0].name || "Unknown";
    return `${recipients[0].name || "Unknown"} and ${
      recipients.length - 1
    } others`;
  }

  return (
    <ModalBase>
      <div className="bg-base-100 p-6 rounded-lg shadow-lg text-center">
        <h3 className="text-xl font-bold mb-4">
          {status === CallStatus.No_Answer
            ? "No Answer"
            : status === CallStatus.Rejected
            ? "Call Rejected"
            : "Calling"}
        </h3>
        <div className="flex flex-col items-center justify-center">
          {recipients[0] && recipients[0].image ? (
            <Image
              className="w-10 h-10 rounded-full "
              src={recipients[0]?.image}
              alt={recipients[0]?.name || "User Profile"}
              width={40}
              height={40}
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gray-500 text-white flex items-center justify-center font-bold select-none cursor-pointer">
              {recipients[0]?.name?.charAt(0).toUpperCase() || "?"}
            </div>
          )}
          <p className="mb-4">{getChatName()}</p>
        </div>
        <div className="flex justify-center gap-4">
          <button
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            onClick={onCancel}
          >
            {status === CallStatus.No_Answer || status === CallStatus.Rejected
              ? "Close"
              : "Cancel"}
          </button>
        </div>
      </div>
    </ModalBase>
  );
};

export default InitiateCallPopup;
