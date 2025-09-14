"use client";
import { getChatById } from "@/app/components/Chats/ChatsActions";
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
  const onRecieveData = useSocket().onRecieveData;
  const onMessage = useCallback((event: Message) => {
    console.log("Received socket message:", event);
    setMessages((prev) => [...prev, event]);
  }, []);

  useEffect(() => {
    const loadData = async () => {
      const serverMessages = (await getChatById(chatId)) as Message[];

      setMessages(serverMessages);
      setLoading(false);
    };

    loadData();
  }, []);

  useEffect(() => {
    const unsubscribe = onRecieveData((event) => {
      if (event.type === SocketEventType.MESSAGE) {
        onMessage(event.payload as Message);
      }
    });
    return () => {
      unsubscribe();
    };
  }, [onRecieveData]);

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

  return [messages, onMessage, sendMessage, loading] as const;
}
