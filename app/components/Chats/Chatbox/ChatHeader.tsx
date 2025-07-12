"use client";
import { IoIosCall } from "react-icons/io";
import { useCallPopup } from "./CallPopupProvider";

const ChatHeader = ({ chatId }: { chatId: string }) => {
  const { initiateCall, setVideoPopup } = useCallPopup();

  const handleInitiateCall = () => {
    initiateCall(chatId);
    setVideoPopup(true); // Show the video popup when initiating a call
  };

  return (
    <div className="p-4 border-b-1 border-none rounded-t-2xl text-base-content bg-base-100">
      <div className="flex flex-row justify-between">
        <h2 className="text-3xl font-bold text-primary">Chats</h2>
        <div className="flex flex-row gap-5">
          <IoIosCall
            className="text-2xl text-primary cursor-pointer hover:text-secondary transition-colors mt-2"
            onClick={handleInitiateCall}
          />
        </div>
      </div>
    </div>
  );
};

export default ChatHeader;
