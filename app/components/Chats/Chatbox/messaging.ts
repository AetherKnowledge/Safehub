"use client";
import { useCallback, useEffect, useState, useRef } from "react";
import { ChatMessage } from "@/app/generated/prisma";

export interface Message extends ChatMessage {
  name: string;
  src?: string;
}

interface WebSocketEventMap {
  message: Message;
  error: string;
}

export function useMessaging(url: () => string) {
  const socket = useWebSocket(url);

  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    const loadData = async () => {
      const serverMessages = await fetchMessages();
      setMessages(serverMessages);
      setLoading(false);
    };

    loadData();
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    socket?.addEventListener(
      "message",
      async (event) => {
        const payload =
          typeof event.data === "string" ? event.data : await event.data.text();

        if (!payload) {
          return console.log("Received empty message from WebSocket");
        }

        const message = JSON.parse(payload) as WebSocketEventMap;
        console.log("WebSocket message received:", message);
        if (message.error) {
          console.log("WebSocket error:", payload.error);
          return console.error("WebSocket error:", payload.error);
        }

        setMessages((p) => [...p, message.message]);
      },
      controller
    );

    socket?.addEventListener(
      "error",
      (event) => {
        console.log("WebSocket error:", event);
      },
      controller
    );

    socket?.addEventListener(
      "close",
      (event) => {
        if (event.wasClean) return;
        console.log("WebSocket closed unexpectedly:", event);
      },
      controller
    );

    return () => controller.abort();
  }, [socket]);

  const sendMessage = useCallback(
    (content: string) => {
      if (!socket || socket.readyState !== socket.OPEN) return;
      console.log("Outgoing message:", content);
      socket.send(JSON.stringify({ content }));
    },
    [socket]
  );

  return [messages, sendMessage, loading] as const;
}

async function fetchMessages(): Promise<Message[]> {
  const res = await fetch("/api/user/chats/chat_direct_1");
  const data = await res.json();

  if (!res.ok) {
    console.error("Failed to fetch chat history:", data);
    return [] as Message[];
  }

  return data as Message[];
}

export function useWebSocket(url: () => string) {
  const ref = useRef<WebSocket>(null);
  const target = useRef(url);
  const [, update] = useState(0);

  useEffect(() => {
    if (ref.current) return;
    const socket = new WebSocket(target.current());
    ref.current = socket;
    update((p) => p + 1);

    return () => socket.close();
  }, []);

  return ref.current;
}
