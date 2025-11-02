"use client";
import { Message, Messaging } from "@/@types/network";
import { ChatBotChat } from "@/app/components/ChatBot/ChatBot";
import { getChatBotHistory } from "@/app/components/ChatBot/ChatBotActions";
import { useSession } from "next-auth/react";
import {
  createContext,
  ReactNode,
  useCallback,
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
      if (!session) return;

      setLoading(true);
      const history = await getChatBotHistory();
      setMessages(history);
      setLoading(false);
    };
    loadData();
  }, [session]);

  const sendMessage = useCallback(
    async (content: string) => {
      if (!session) return;

      // Add the user's message immediately
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

      // Create a placeholder message for the bot
      const botMessageId = `bot-${Date.now()}`;
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          id: botMessageId,
          chatId: ChatBotChat.id,
          userId: ChatBotChat.id,
          content: "",
          createdAt: new Date(),
          updatedAt: new Date(),
          name: ChatBotChat.name,
          src: ChatBotChat.src,
        } as Message,
      ]);

      // Stream from n8n
      const reply = await sendMessageToChatBot(
        content,
        session.data?.supabaseAccessToken,
        (chunk) => {
          setMessages((prevMessages) =>
            prevMessages.map((m) =>
              m.id === botMessageId
                ? { ...m, content: m.content + (chunk.content || "") }
                : m
            )
          );
        }
      );

      // Once streaming completes, make sure the final content is synced
      setMessages((prevMessages) =>
        prevMessages.map((m) =>
          m.id === botMessageId ? { ...m, content: reply.content } : m
        )
      );
    },
    [session]
  );

  const chatBotContextValue: Messaging = { messages, sendMessage, loading };
  return (
    <ChatBotContext.Provider value={chatBotContextValue}>
      {children}
    </ChatBotContext.Provider>
  );
};

type ChatBotResponse = {
  type: string;
  metadata?: object;
  content?: string;
};

export async function sendMessageToChatBot(
  message: string,
  sessionToken?: string,
  onChunk?: (chunk: ChatBotResponse) => void
): Promise<Message> {
  if (!sessionToken) {
    throw new Error("Unauthorized");
  }

  const n8nWebhookUrl = process.env.NEXT_PUBLIC_N8N_URL!;
  const response = await fetch(n8nWebhookUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${sessionToken}`,
    },
    body: JSON.stringify({ message }),
  });

  if (!response.ok || !response.body) {
    throw new Error("Failed to connect to n8n webhook");
  }

  // Handle streaming response
  const reader = response.body.getReader();
  const decoder = new TextDecoder("utf-8");
  let buffer = "";

  let fullText = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });

    const parts = buffer.split("\n");
    buffer = parts.pop() || ""; // save last partial JSON for next iteration

    for (const part of parts) {
      try {
        const parsed: ChatBotResponse = JSON.parse(part);
        fullText += parsed.content || "";
        if (onChunk) onChunk(parsed);
      } catch (err) {
        console.warn("Invalid JSON skipped:", part);
      }
    }
  }

  // Optionally parse final JSON if n8n sends structured data
  let output = fullText.trim();
  try {
    const parsed = JSON.parse(output);
    output = parsed.output ?? output;
  } catch {
    // ignore parse errors if it's plain text stream
  }

  return {
    id: Date.now().toString(),
    chatId: ChatBotChat.id,
    userId: ChatBotChat.id,
    content: output,
    createdAt: new Date(),
    updatedAt: new Date(),
    name: ChatBotChat.name,
    src: ChatBotChat.src,
  };
}

export default ChatBotProvider;
