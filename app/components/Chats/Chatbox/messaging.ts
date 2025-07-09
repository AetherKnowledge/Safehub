"use client";
import { ChatMessage } from "@/app/generated/prisma";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useWebSocket } from "./useWebsocket";
export interface Message extends ChatMessage {
  name: string;
  src?: string;
}

interface WebSocketEventMap {
  message: Message;
  error: string;
}

export function useMessaging(chatId: string) {
  const url = useMemo(() => {
    return () => `ws://${window.location.host}/api/user/chats/${chatId}`;
  }, []);
  const { socket, isConnected, error } = useWebSocket(url, {
    reconnect: true,
    reconnectIntervalMs: 1000,
    maxReconnectAttempts: 5,
  });

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

  useEffect(() => {
    if (!socket) return;

    const handleMessage = async (event: MessageEvent) => {
      const payload =
        typeof event.data === "string" ? event.data : await event.data.text();

      if (!payload) return;

      const message = JSON.parse(payload) as WebSocketEventMap;
      if (message.error) {
        console.error("WebSocket error message:", message.error);
        return;
      }

      setMessages((prev) => [...prev, message.message]);
    };

    socket.addEventListener("message", handleMessage);
    return () => socket.removeEventListener("message", handleMessage);
  }, [socket]);

  const sendMessage = useCallback(
    (content: string) => {
      if (!socket || socket.readyState !== WebSocket.OPEN) {
        console.warn("Socket not open. Cannot send message.");
        return;
      }

      socket.send(JSON.stringify({ content }));
    },
    [socket]
  );

  return [messages, sendMessage, loading, isConnected, error] as const;
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
