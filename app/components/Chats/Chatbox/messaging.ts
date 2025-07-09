"use client";
import { ChatMessage } from "@/app/generated/prisma";
import { useCallback, useEffect, useState } from "react";
import {
  SocketEvent,
  SocketEventType,
  SocketMessage,
} from "../../Socket/SocketEvents";

export interface Message extends ChatMessage {
  name: string;
  src?: string;
}

export function useMessaging(socket: WebSocket | null, chatId: string) {
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    const loadData = async () => {
      const serverMessages = await fetchMessages(chatId);
      setMessages(serverMessages);
      setLoading(false);
    };

    loadData();
  }, []);

  const handleMessage = async (event: MessageEvent) => {
    const payload =
      typeof event.data === "string" ? event.data : await event.data.text();
    console.log("Received message:", payload);

    if (!payload) return;

    const message = JSON.parse(payload) as SocketEvent<Message>;
    if (message.type === "error") {
      console.error("WebSocket error message:", message.payload);
      return;
    }
    if (!message.payload) {
      return;
    }

    setMessages((prev) => [...prev, message.payload]);
  };

  const sendMessage = useCallback(
    (content: SocketMessage) => {
      if (!socket || socket.readyState !== WebSocket.OPEN) {
        console.warn("Socket not open. Cannot send message.");
        return;
      }

      socket.send(
        JSON.stringify({ type: SocketEventType.MESSAGE, payload: content })
      );
    },
    [socket]
  );

  const joinChat = useCallback(() => {
    if (!socket || socket.readyState !== WebSocket.OPEN) {
      console.warn("Socket not open. Cannot join chat.");
      return;
    }

    socket.send(
      JSON.stringify({ type: SocketEventType.JOINCHAT, payload: { chatId } })
    );
  }, [socket, chatId]);

  const leaveChat = useCallback(() => {
    if (!socket || socket.readyState !== WebSocket.OPEN) {
      console.warn("Socket not open. Cannot leave chat.");
      return;
    }

    socket.send(JSON.stringify({ type: SocketEventType.LEAVECHAT }));
  }, [socket, chatId]);

  useEffect(() => {
    if (!socket) return;

    joinChat();
    socket?.addEventListener("message", handleMessage);

    return () => {
      leaveChat();
      socket?.removeEventListener("message", handleMessage);
    };
  }, [socket, chatId]);

  return [messages, sendMessage, loading] as const;
}

async function fetchMessages(chatId: string): Promise<Message[]> {
  const res = await fetch("/api/user/chats/" + chatId);
  const data = await res.json();

  if (!res.ok) {
    console.error("Failed to fetch chat history:", data);
    return [] as Message[];
  }

  return data as Message[];
}
