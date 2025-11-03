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
    <section className="flex-1 flex flex-col gap-4 min-h-0 border-x border-base-300">
      <h2 className="text-center text-lg font-bold pt-4">ChatBot Sand Box</h2>
      <Divider />
      <div
        className="p-4 group flex-1 flex flex-col gap-2 overflow-y-auto scrollbar-gutter:stable"
        ref={chatContainerRef}
      >
        <ChatHistory
          loading={chatBot.loading}
          messages={chatBot.messages}
          userId={session.data?.user.id || ""}
        />
      </div>

      {/* Fixed input bar */}
      <ChatBoxInput className="p-4 pt-0" asyncOnsend={chatBot.sendMessage} />
    </section>
  );
};

export default ChatbotSandbox;
