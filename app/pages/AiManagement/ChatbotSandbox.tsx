"use client";
import { useChatBot } from "@/app/components/ChatBot/ChatBotProvider";
import Divider from "@/app/components/Divider";
import { useSession } from "next-auth/react";
import { useEffect, useRef } from "react";
import ChatBoxInput from "../Chats/ChatBox/ChatBoxInput";
import ChatHistory from "../Chats/ChatBox/ChatHistory";

const ChatbotSandbox = () => {
  const session = useSession();
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const chatBot = useChatBot();

  const scrollToBottom = () => {
    const container = chatContainerRef.current;
    if (container) {
      container.scrollTo({
        top: container.scrollHeight,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    setTimeout(scrollToBottom, 50);
  }, [chatBot.messages]);

  return (
    <section className="bg-base-100 p-4 flex flex-col h-[calc(100dvh-7rem)] border-x border-base-300">
      <h2 className="text-center text-lg font-bold mb-2 h-[35px]">
        ChatBot Sand Box
      </h2>
      <Divider />
      <div
        className="group flex-1 flex flex-col gap-2 overflow-y-auto scrollbar-gutter:stable"
        ref={chatContainerRef}
      >
        <ChatHistory
          loading={chatBot.loading}
          messages={chatBot.messages}
          userId={session.data?.user.id || ""}
        />
      </div>

      {/* Fixed input bar */}
      <ChatBoxInput asyncOnsend={chatBot.sendMessage} />
    </section>
  );
};

export default ChatbotSandbox;
