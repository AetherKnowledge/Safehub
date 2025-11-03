"use client";
import { ChatData } from "@/@types/network";
import { UserStatus } from "@/app/generated/prisma";
import { IoIosCall } from "react-icons/io";
import UserImage from "../../../components/UserImage";
import { useCallPopup } from "./CallPopupProvider";

// TODO: Split video and audio call buttons

type ChatHeaderProps = {
  chat: ChatData;
};

const ChatHeader = ({ chat }: ChatHeaderProps) => {
  const { initiateCall } = useCallPopup();

  const handleInitiateCall = () => {
    if (!chat.id) return;

    initiateCall(chat.id);
  };

  return (
    <div className="border-b-1 border-base-content/20 rounded-t-2xl pb-2">
      <div className="flex flex-row justify-between items-center">
        <div className="flex flex-row gap-2 items-center">
          <div
            className={`flex flex-col border-2 border-transparent rounded-full ${
              chat.status === UserStatus.Online ? "border-primary" : ""
            }`}
          >
            <UserImage name={chat.name} width={10} src={chat.src} />
          </div>
          <div className="flex flex-col justify-center max-w-59 overflow-hidden flex-1 min-w-0">
            <h2 className="font-semibold text-sm overflow-hidden text-ellipsis whitespace-nowrap">
              {chat.name}
            </h2>
            <p className="text-xs text-base-content/60 overflow-hidden text-ellipsis whitespace-nowrap">
              {`${chat.status === UserStatus.Online ? "Online" : "Offline"}`}
            </p>
          </div>
        </div>
        {chat && (
          <div className="flex flex-row gap-5">
            {chat.id !== "chatbot" && (
              <IoIosCall
                className="text-2xl text-primary cursor-pointer hover:text-secondary transition-colors"
                onClick={handleInitiateCall}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatHeader;
