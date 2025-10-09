"use server";

import { ChatData, Message } from "@/@types/network";
import { chathistory } from "@/app/generated/prisma";
import { auth } from "@/auth";
import { Session } from "next-auth";

import { prisma } from "@/prisma/client";
import jwt from "jsonwebtoken";
import { ChatBotChat } from "./ChatBot";

export type ChatBotResponse = {
  output: string;
};

type ChatBotMessage = {
  type: "human" | "ai";
  content: string;
};

export async function sendMessageToChatBot(message: string): Promise<Message> {
  const session = await auth();
  if (!session) {
    throw new Error("Unauthorized");
  }

  if (!message || typeof message !== "string") {
    throw new Error("Invalid request");
  }

  const token = jwt.sign(
    {
      userId: session.user.id,
      email: session.user.email,
    },
    process.env.N8N_SECRET!,
    { expiresIn: "1h" }
  );

  const n8nWebhookUrl = process.env.N8N_URL!;
  const response = await fetch(n8nWebhookUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      message,
    }),
  });

  const data: ChatBotResponse = await response.json();
  console.log("Response from n8n:", data);

  return {
    id: Date.now().toString(),
    chatId: ChatBotChat.id,
    userId: ChatBotChat.id,
    content: data.output,
    createdAt: new Date(),
    updatedAt: new Date(),

    name: ChatBotChat.name,
    src: ChatBotChat.src,
  };
}

export async function getChatBotChat(): Promise<ChatData> {
  const session = await auth();

  if (!session) {
    throw new Error("Unauthorized");
  }

  const chatHistory: chathistory | null = await prisma.chathistory.findFirst({
    where: {
      session_id: session.user.id,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return {
    ...ChatBotChat,
    latestMessage: chatHistory
      ? convertChatBotMessageToChatMessage(session, chatHistory)
      : undefined,
  };
}

export async function getChatBotHistory(): Promise<Message[]> {
  const session = await auth();

  if (!session) {
    throw new Error("Unauthorized");
  }

  const chatHistory: chathistory[] = await prisma.chathistory.findMany({
    where: {
      session_id: session.user.id,
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  const convertedHistory: Message[] = chatHistory.map((msg) =>
    convertChatBotMessageToChatMessage(session, msg)
  );

  return convertedHistory;
}

function convertChatBotMessageToChatMessage(
  session: Session,
  chatHistory: chathistory
): Message {
  return {
    id: chatHistory.id,
    chatId: ChatBotChat.id,
    userId:
      (chatHistory.message as ChatBotMessage).type === "human"
        ? session.user.id || "user"
        : "chatbot",
    content: (chatHistory.message as ChatBotMessage).content,
    createdAt: chatHistory.createdAt,
    updatedAt: chatHistory.createdAt,

    name:
      (chatHistory.message as ChatBotMessage).type === "human"
        ? session.user.name || "You"
        : ChatBotChat.name,
    src:
      (chatHistory.message as ChatBotMessage).type === "human"
        ? session.user.image || undefined
        : ChatBotChat.src,
  };
}
