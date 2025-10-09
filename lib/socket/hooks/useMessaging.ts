"use client";
import { Message, Messaging } from "@/@types/network";
import { getChatById } from "@/app/components/Chats/ChatsActions";
import { useCallback, useEffect, useState } from "react";
import { SocketEventType, SocketMessage } from "../SocketEvents";
import { useSocket } from "../SocketProvider";

export function useMessaging(chatId: string, fetchMessages = true): Messaging {
  // Don't use socket for chatbot
  // as it uses a different mechanism
  // for sending and receiving messages
  // this is here because chatbox calls two hooks conditionally
  // which changes the order of hooks called
  // which is against the rules of hooks
  const socket = chatId === "chatbot" ? null : useSocket().socket;
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState<Message[]>([]);
  const onRecieveData = useSocket().onRecieveData;
  const onMessage = useCallback(
    (event: Message) => {
      console.log("Received socket message:", event);
      if (event.chatId !== chatId) return;
      setMessages((prev) => [...prev, event]);
    },
    [chatId]
  );

  useEffect(() => {
    if (!fetchMessages) {
      setLoading(false);
      return;
    }
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
    async (content: string) => {
      if (!socket || socket.readyState !== WebSocket.OPEN) {
        console.warn("Socket not open. Cannot send message.");
        return;
      }

      const message: SocketMessage = { content, chatId };

      socket.send(
        JSON.stringify({ type: SocketEventType.MESSAGE, payload: message })
      );
    },
    [socket, chatId]
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

  return { messages, sendMessage, loading } as const;
}
