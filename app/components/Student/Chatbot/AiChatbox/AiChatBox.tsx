"use client";
import { chathistory } from "@/app/generated/prisma";
import { useSession } from "next-auth/react";
import { ReactNode, useEffect, useRef, useState } from "react";
import { getHistory } from "../AiChatbotActions";
import AIChatboxInput from "./AiChatboxInput";
import AIChatBubble from "./AiChatBubble";

type Message = {
  type: "human" | "ai";
  content: string;
};

export function AiChatBox() {
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const [chatHistory, setChatHistory] = useState<chathistory[]>([]);
  const [userImage, setUserImage] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const session = useSession();

  useEffect(() => {
    const loadData = async () => {
      setUserImage(session?.data?.user?.image || undefined);

      await refreshChat();
    };

    loadData();
  }, []);

  const refreshChat = async () => {
    const history = await getHistory();
    if (!history) {
      console.error("Failed to fetch chat history:", history);
      setLoading(false);
      return;
    }

    setChatHistory(history);
    setTimeout(scrollToBottom, 50);
    setLoading(false);
  };

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
    <>
      {/* Scrollable chat history */}
      <div className="flex-1 overflow-y-auto p-5" ref={chatContainerRef}>
        {renderChatHistory(loading, chatHistory, userImage)}
      </div>

      {/* Fixed input bar */}
      <AIChatboxInput onSend={refreshChat} />
    </>
  );
}

function renderChatHistory(
  loading: boolean,
  chatHistory: chathistory[],
  userImage?: string
): ReactNode {
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full space-y-4">
        <div className="loading loading-spinner loading-lg text-primary"></div>
        <p className="text-base-content">Loading chat...</p>
      </div>
    );
  }

  if (!chatHistory || chatHistory.length === 0) {
    return (
      <p className="text-center text-gray-500">No chat history available.</p>
    );
  }

  return chatHistory.map((chat) => makeChatBubble(chat, userImage));
}

function makeChatBubble(chat: chathistory, imageUrl?: string): ReactNode {
  console.log("Chat:", chat);

  const message = chat.message as Message;
  return (
    <AIChatBubble
      key={chat.id}
      type={message.type}
      src={imageUrl}
      message={message.content}
      createdAt={chat.createdAt}
    />
  );
}

export default AiChatBox;
