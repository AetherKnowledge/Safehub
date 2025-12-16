"use client";
import { ChatData } from "@/@types/network";
import { useChatBot } from "@/app/components/ChatBot/ChatBotProvider";
import UserImage from "@/app/components/UserImage";
import { UserStatus } from "@/app/generated/prisma/browser";
import { getRelativeTime } from "@/lib/client-utils";
import { useMessaging } from "@/lib/socket/hooks/useMessaging";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";

// TODO: find another way to get latest message without using useMessaging
// it loads all messages which is not efficient
// maybe create a new hook that only fetches the latest message
// or use a global state management solution to store the latest message

type Props = {
  chat: ChatData;
  selected: boolean;
};

const ChatSidebarUserBox = ({ chat, selected }: Props) => {
  const session = useSession();
  const [latestMessage, setLatestMessage] = useState(chat.latestMessage);
  const chatBot = useChatBot();
  const userChats = useMessaging(chat.id, false);

  const messaging = chat.id === "chatbot" ? chatBot : userChats;

  useEffect(() => {
    console.log(latestMessage);
    if (messaging.messages.length > 0) {
      setLatestMessage(messaging.messages[messaging.messages.length - 1]);
      console.log(messaging.messages[messaging.messages.length - 1]);
    }
  }, [messaging.messages]);

  return (
    <Link
      href={`/user/chats/${chat.id}`}
      className={`flex flex-row rounded-lg p-3 gap-3 mb-1 transition-all duration-200 min-w-0 ${
        selected
          ? "bg-primary/10 border border-primary/20 shadow-sm"
          : "hover:bg-base-100 border border-transparent hover:shadow-sm"
      }`}
    >
      <div className="relative shrink-0">
        <UserImage
          name={chat.name}
          width={10}
          src={chat.src || undefined}
          bordered={chat.status === UserStatus.Online}
        />
        {chat.status === UserStatus.Online && (
          <div className="absolute bottom-0 right-0 w-3 h-3 bg-primary rounded-full border-2 border-base-100"></div>
        )}
      </div>
      <div className="flex flex-col justify-center flex-1 min-w-0">
        <h2 className="font-semibold text-sm truncate">{chat.name}</h2>
        <p className="text-xs text-base-content/60 truncate">
          {latestMessage?.userId === session.data?.user.id ? "You: " : ""}
          {latestMessage?.content && latestMessage.content.length > 20
            ? `${latestMessage.content.substring(0, 50)}...`
            : latestMessage?.content || "No messages yet"}
        </p>
      </div>
      <div className="flex flex-col justify-center items-end shrink-0">
        <p className="text-xs text-base-content/50 whitespace-nowrap">
          {latestMessage ? getRelativeTime(latestMessage.createdAt) : ""}
        </p>
      </div>
    </Link>
  );
};

export const SidebarUserBoxSkeleton = () => {
  return (
    <div className="flex flex-row border-b-1 rounded rounded-b-none border-base-content/20 p-2 gap-2 animate-pulse">
      <div className="border-2 border-transparent rounded-full">
        <div className="w-10 h-10 bg-base-300 rounded-full"></div>
      </div>
      <div className="flex flex-col justify-center max-w-59 overflow-hidden flex-1 min-w-0">
        <div className="font-semibold text-sm overflow-hidden text-ellipsis whitespace-nowrap">
          <div className="w-24 h-4 bg-base-300 rounded"></div>
        </div>
        <div className="text-xs text-base-content/60 overflow-hidden text-ellipsis whitespace-nowrap">
          <div className="w-32 h-4 bg-base-300 rounded"></div>
        </div>
      </div>
      <div className="flex flex-col justify-end items-end">
        <div className="text-xs text-base-content/60">
          <div className="w-16 h-4 bg-base-300 rounded"></div>
        </div>
      </div>
    </div>
  );
};

export default ChatSidebarUserBox;
