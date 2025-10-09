"use client";
import { ChatData, Message } from "@/@types/network";
import { useMessaging } from "@/lib/socket/hooks/useMessaging";
import { useSession } from "next-auth/react";
import { ReactNode, useEffect, useRef } from "react";
import { useChatBot } from "../../ChatBot/ChatBotProvider";
import ChatBoxInput from "./ChatBoxInput";
import ChatHeader from "./ChatHeader";
import MessageBubble from "./MessageBubble";

export function ChatBox({ chat }: { chat: ChatData }) {
  const session = useSession();
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const messaging =
    chat.id === "chatbot" ? useChatBot() : useMessaging(chat.id);

  useEffect(() => {
    setTimeout(scrollToBottom, 50);
  }, [messaging.messages]);

  const scrollToBottom = () => {
    const container = chatContainerRef.current;
    if (container) {
      container.scrollTo({
        top: container.scrollHeight,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="flex flex-col rounded-lg w-full h-full bg-base-100 shadow-br p-4">
      <ChatHeader chat={chat} />
      {/* Scrollable chat history */}
      <div
        className="group flex-1 flex flex-col gap-2 overflow-y-auto scrollbar-gutter:stable"
        ref={chatContainerRef}
      >
        <ChatHistory
          loading={messaging.loading}
          messages={messaging.messages}
          userId={session.data?.user.id || ""}
        />
      </div>

      {/* Fixed input bar */}
      <ChatBoxInput asyncOnsend={messaging.sendMessage} />
    </div>
  );
}

function ChatHistory({
  loading,
  messages,
  userId,
}: {
  loading: boolean;
  messages: Message[] | null;
  userId: string;
}): ReactNode {
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full space-y-4">
        <div className="loading loading-spinner loading-lg text-primary"></div>
        <p className="text-base-content">Loading chat...</p>
      </div>
    );
  }

  if (!messages || messages.length === 0) {
    return (
      <p className="text-center text-gray-500 mt-4">
        No chat history available.
      </p>
    );
  }

  return messages.map((chat) => (
    <MessageBubble
      key={chat.id}
      name={chat.name}
      image={chat.src}
      imageSize={10}
      content={chat.content}
      createdAt={chat.createdAt}
      self={userId === chat.userId}
    />
  ));
}

export default ChatBox;
