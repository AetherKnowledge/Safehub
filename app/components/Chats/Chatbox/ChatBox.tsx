"use client";
import { ChatData } from "@/@types/network";
import { Message, useMessaging } from "@/lib/socket/hooks/useMessaging";
import { useSession } from "next-auth/react";
import { ReactNode, useEffect, useRef, useState } from "react";
import { getChatBotHistory, sendMessageToChatBot } from "../AiChatBotActions";
import ChatBoxInput from "./ChatBoxInput";
import ChatHeader from "./ChatHeader";
import MessageBubble from "./MessageBubble";

export function ChatBox({ chat }: { chat: ChatData }) {
  const session = useSession();
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const [messages, onMessage, sendMessage, loading] = useMessaging(chat.id);

  useEffect(() => {
    setTimeout(scrollToBottom, 50);
  }, [messages]);

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
          loading={loading}
          messages={messages}
          userId={session.data?.user.id || ""}
        />
      </div>

      {/* Fixed input bar */}
      <ChatBoxInput
        onSend={(message) => {
          sendMessage({ content: message, chatId: chat.id });
        }}
      />
    </div>
  );
}

export function AiChatBox({ chat }: { chat: ChatData }) {
  const session = useSession();
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(scrollToBottom, 50);
  }, [messages]);

  const scrollToBottom = () => {
    const container = chatContainerRef.current;
    if (container) {
      container.scrollTo({
        top: container.scrollHeight,
        behavior: "smooth",
      });
    }
  };

  async function onSendToChatBot(message: string) {
    try {
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          id: Date.now().toString(),
          chatId: chat.id,
          content: message,
          userId: session.data?.user.id || "",

          createdAt: new Date(),
          updatedAt: new Date(),

          name: session.data?.user.name || "You",
          src: session.data?.user.image || undefined,
        },
      ]);
      const reply = await sendMessageToChatBot(message);
      setMessages((prevMessages) => [...prevMessages, reply]);
    } catch (error) {
      console.error("Error sending message to chatbot:", error);
    }
  }

  useEffect(() => {
    const loadData = async () => {
      const history = await getChatBotHistory();
      setMessages(history);
      setLoading(false);
    };
    loadData();
  }, []);

  return (
    <div className="flex flex-col rounded-lg w-full h-full bg-base-100 shadow-br p-4">
      <ChatHeader chat={chat} />
      {/* Scrollable chat history */}
      <div
        className="group flex-1 flex flex-col gap-2 overflow-y-auto scrollbar-gutter:stable"
        ref={chatContainerRef}
      >
        <ChatHistory
          loading={loading}
          messages={messages}
          userId={session.data?.user.id || ""}
        />
      </div>

      {/* Fixed input bar */}
      <ChatBoxInput asyncOnsend={onSendToChatBot} />
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
