"use client";
import { Message, Messaging } from "@/@types/network";
import { ChatBotChat } from "@/app/components/ChatBot/ChatBot";
import {
  getChatBotHistory,
  sendMessageToChatBot,
} from "@/app/components/ChatBot/ChatBotActions";
import { useSession } from "next-auth/react";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

export const ChatBotContext = createContext<Messaging | undefined>(undefined);

export function useChatBot() {
  const context = useContext(ChatBotContext);
  if (!context) {
    throw new Error("useChatBot must be used within a ChatBotProvider");
  }
  return context;
}

const ChatBotProvider = ({ children }: { children: ReactNode }) => {
  const session = useSession();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const history = await getChatBotHistory();
      setMessages(history);
      setLoading(false);
    };
    loadData();
  }, []);

  const sendMessage = async (content: string) => {
    console.log(session);
    setMessages((prevMessages) => [
      ...prevMessages,
      {
        id: Date.now().toString(),
        chatId: ChatBotChat.id,
        content,
        userId: session.data?.user.id || "",

        createdAt: new Date(),
        updatedAt: new Date(),

        name: session.data?.user.name || "You",
        src: session.data?.user.image || undefined,
      } as Message,
    ]);

    const reply = await sendMessageToChatBot(content);
    setMessages((prevMessages) => [...prevMessages, reply]);
  };

  const chatBotContextValue: Messaging = { messages, sendMessage, loading };
  return (
    <ChatBotContext.Provider value={chatBotContextValue}>
      {children}
    </ChatBotContext.Provider>
  );
};

export default ChatBotProvider;
