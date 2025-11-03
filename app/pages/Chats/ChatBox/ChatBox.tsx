"use client";
import { ChatData } from "@/@types/network";
import { useMessaging } from "@/lib/socket/hooks/useMessaging";
import { useSession } from "next-auth/react";
import { useEffect, useRef } from "react";
import { useChatBot } from "../../../components/ChatBot/ChatBotProvider";
import ChatBoxInput from "./ChatBoxInput";
import ChatHeader from "./ChatHeader";
import ChatHistory from "./ChatHistory";

// TODO: Move useMessaging logic to a higher-level component to avoid re-initialization on chat switch.
// TODO: Change order of elements to have chat history first for better accessibility.

export function ChatBox({ chat }: { chat: ChatData }) {
  const session = useSession();
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const chatBot = useChatBot();
  const userChats = useMessaging(chat.id);
  const messaging = chat.id === "chatbot" ? chatBot : userChats;

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
    <div className="flex flex-col rounded-lg w-full h-full bg-base-100 overflow-y-auto shadow-br p-4">
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

export default ChatBox;
