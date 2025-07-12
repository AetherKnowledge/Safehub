"use client";
import { ParsedChat } from "@/@types/network";
import { ChatType, UserStatus } from "@/app/generated/prisma";
import { useSocket } from "@/lib/socket/SocketProvider";
import { Message } from "@/lib/socket/useMessaging";
import { imageGenerator } from "@/lib/utils";
import Link from "next/link";
import { ReactNode, useEffect, useState } from "react";

export interface Chat {
  id: string;
  name: string;
  type: ChatType;
  latestMessage?: string;
  src: ReactNode;
  status: UserStatus;
  latestMessageAt?: Date;
}

const ChatSidebar = ({ chatId }: { chatId: string }) => {
  const [chats, setChats] = useState<Chat[]>([]);
  const onMessage = useSocket().onMessage;

  useEffect(() => {
    const fetchChats = async () => {
      const response = await fetch("/api/user/chats");
      const data = (await response.json()) as ParsedChat[];

      const parsedData = await Promise.all(
        data.map(
          async (chat) =>
            ({
              id: chat.id,
              name: chat.name || chat.email || "Unknown",
              type: chat.type,
              src: imageGenerator(chat.name, 10, chat.src),
              status: chat.status || UserStatus.Offline,
              latestMessage: chat.latestMessage,
            }) as Chat
        )
      );

      setChats(parsedData);
    };

    fetchChats();
  }, []);

  useEffect(() => {
    const receiveMessage = onMessage((data: Message) => {
      setChats((prevChats) =>
        prevChats.map((prev) => {
          if (prev.id === data.chatId) {
            return {
              ...prev,
              latestMessage: data.content,
              latestMessageAt: new Date(data.createdAt),
            };
          }
          return prev;
        })
      );
    });
    return () => {
      receiveMessage();
    };
  }, [onMessage]);

  return (
    <div className="flex flex-col overflow-y-auto">
      {chats
        .slice()
        .sort((a, b) => {
          const aTime = a.latestMessageAt
            ? new Date(a.latestMessageAt).getTime()
            : 0;
          const bTime = b.latestMessageAt
            ? new Date(b.latestMessageAt).getTime()
            : 0;
          return bTime - aTime;
        })
        .map((chat) => (
          <Link
            key={chat.id}
            role="button"
            className={
              (chatId === chat.id ? "bg-base-300" : "hover:bg-base-200") +
              " button px-2 py-2 transition-opacity flex items-center justify-between gap-4 w-[20vw]"
            }
            href={"/user/chats/" + chat.id}
          >
            <div className="relative">
              {chat.src}
              {chat.status === UserStatus.Online && (
                <span className="absolute top-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-green-500" />
              )}
            </div>
            <div className="text-left text-base-content font-medium w-full">
              {chat.name}
            </div>
          </Link>
        ))}
    </div>
  );
};
export default ChatSidebar;
