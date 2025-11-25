"use client";
import { ChatData } from "@/@types/network";
import { UserStatus } from "@/app/generated/prisma";
import Link from "next/link";
import { IoIosArrowBack, IoIosCall } from "react-icons/io";
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
    <div className="p-4">
      <div className="flex flex-row justify-between items-center">
        <div className="flex flex-row gap-3 items-center flex-1 min-w-0">
          <Link
            className="btn btn-ghost btn-sm rounded-lg p-2 flex xl:hidden hover:bg-base-200"
            href="/user/chats"
          >
            <IoIosArrowBack className="w-5 h-5" />
          </Link>
          <div className="relative">
            <div
              className={`flex flex-col rounded-full ring-2 ring-offset-2 ring-offset-base-100 transition-all ${
                chat.status === UserStatus.Online
                  ? "ring-primary"
                  : "ring-base-300"
              }`}
            >
              <UserImage name={chat.name} width={10} src={chat.src} />
            </div>
            {chat.status === UserStatus.Online && (
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-primary rounded-full border-2 border-base-100"></div>
            )}
          </div>
          <div className="flex flex-col justify-center overflow-hidden flex-1 min-w-0">
            <h2 className="font-semibold text-base overflow-hidden text-ellipsis whitespace-nowrap">
              {chat.name}
            </h2>
            <p
              className={`text-xs overflow-hidden text-ellipsis whitespace-nowrap ${
                chat.status === UserStatus.Online
                  ? "text-primary font-medium"
                  : "text-base-content/60"
              }`}
            >
              {`${chat.status === UserStatus.Online ? "● Online" : "Offline"}`}
            </p>
          </div>
        </div>
        {chat && (
          <div className="flex flex-row gap-2">
            {chat.id !== "chatbot" && (
              <button
                className="btn btn-circle btn-sm bg-primary/10 border-primary/20 hover:bg-primary hover:border-primary text-primary hover:text-primary-content transition-all"
                onClick={handleInitiateCall}
                aria-label="Start call"
              >
                <IoIosCall className="text-xl" />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatHeader;
