"use client";
import React, { ReactNode, useEffect, useRef, useState } from "react";
import AIChatBubble from "./AiChatBubble";
import { chathistory } from "@/app/generated/prisma";
import AIChatboxInput from "./AiChatboxInput";
import { useSession } from "next-auth/react";

interface Message {
  type: "human" | "ai";
  content: string;
}

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
    const res = await fetch("/api/user/student/history");
    const data = await res.json();

    if (!res.ok) {
      console.error("Failed to fetch chat history:", data);
      setLoading(false);
      return;
    }

    setChatHistory(data);
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
  if (!isMessage(chat.message)) return null;

  const message: Message = chat.message;
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

function isMessage(value: unknown): value is Message {
  return (
    typeof value === "object" &&
    value !== null &&
    "type" in value &&
    (value as any).type &&
    (value as any).content &&
    (value as any).type in { human: 1, ai: 1 }
  );
}

export default AiChatBox;
