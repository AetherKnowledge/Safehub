"use client";
import { ChatMessage } from "@/app/generated/prisma";
import { useCallback, useEffect, useState } from "react";
import { SocketEventType, SocketMessage } from "../SocketEvents";
import { useSocket } from "../SocketProvider";

export interface Message extends ChatMessage {
  name: string;
  src?: string;
}

export function useMessaging(chatId: string) {
  const socket = useSocket().socket;
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState<Message[]>([]);
  const onMessage = useSocket().onMessage;

  useEffect(() => {
    const loadData = async () => {
      const serverMessages = await fetchMessages(chatId);
      setMessages(serverMessages);
      setLoading(false);
    };

    loadData();
  }, []);

  useEffect(() => {
    const receiveMessage = onMessage((data: Message) => {
      console.log("Received socket message:", data);
      setMessages((prev) => [...prev, data]);
    });
    return () => {
      receiveMessage();
    };
  }, [onMessage]);

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

    return () => {
      leaveChat();
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
