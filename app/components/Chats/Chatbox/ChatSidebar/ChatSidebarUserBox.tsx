"use client";
import { ChatData } from "@/@types/network";
import { useChatBot } from "@/app/components/ChatBot/ChatBotProvider";
import { UserStatus } from "@/app/generated/prisma";
import { useMessaging } from "@/lib/socket/hooks/useMessaging";
import { imageGenerator } from "@/lib/utils";
import { useSession } from "next-auth/react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

type Props = {
  chat: ChatData;
  selected: boolean;
};

const ChatSidebarUserBox = ({ chat, selected }: Props) => {
  const session = useSession();
  const [latestMessage, setLatestMessage] = useState(chat.latestMessage);
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathName = usePathname();
  const messaging =
    chat.id === "chatbot" ? useChatBot() : useMessaging(chat.id, false);

  useEffect(() => {
    console.log(latestMessage);
    if (messaging.messages.length > 0) {
      setLatestMessage(messaging.messages[messaging.messages.length - 1]);
      console.log(messaging.messages[messaging.messages.length - 1]);
    }
  }, [messaging.messages]);

  const updateSearchParam = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set(key, value);
    router.push(`${pathName}?${params.toString()}`);
  };

  const getRelativeTime = (date: Date): string => {
    const now = new Date();
    const diffInMs = now.getTime() - new Date(date).getTime();
    const diffInSeconds = Math.floor(diffInMs / 1000);
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);
    const diffInWeeks = Math.floor(diffInDays / 7);
    const diffInMonths = Math.floor(diffInDays / 30);
    const diffInYears = Math.floor(diffInDays / 365);

    if (diffInSeconds <= 0) return "now";
    if (diffInSeconds < 60) return `${diffInSeconds}s`;
    if (diffInMinutes < 60) return `${diffInMinutes}m`;
    if (diffInHours < 24) return `${diffInHours}h`;
    if (diffInDays < 7) return `${diffInDays}d`;
    if (diffInWeeks < 4) return `${diffInWeeks}w`;
    if (diffInMonths < 12) return `${diffInMonths}mo`;
    return `${diffInYears}yr`;
  };

  return (
    <div
      className={`flex flex-row border-b-1 rounded rounded-b-none border-base-content/20 p-2 gap-2 ${
        selected ? "bg-base-300" : "hover:bg-base-200 cursor-pointer"
      } transition-opacity`}
      onClick={() => updateSearchParam("chatId", chat.id)}
    >
      <div
        className={`border-2 border-transparent rounded-full ${
          chat.status === UserStatus.Online ? "border-primary" : ""
        }`}
      >
        {imageGenerator(chat.name, 10, chat.src)}
      </div>
      <div className="flex flex-col justify-center max-w-59 overflow-hidden flex-1 min-w-0">
        <h2 className="font-semibold text-sm overflow-hidden text-ellipsis whitespace-nowrap">
          {chat.name}
        </h2>
        <p className="text-xs text-base-content/60 overflow-hidden text-ellipsis whitespace-nowrap">
          {latestMessage?.userId === session.data?.user.id ? "You: " : ""}
          {latestMessage?.content || "No messages yet"}
        </p>
      </div>
      <div className="flex flex-col justify-end items-end">
        <p className="text-xs text-base-content/60">
          {latestMessage ? getRelativeTime(latestMessage.createdAt) : ""}
        </p>
      </div>
    </div>
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
