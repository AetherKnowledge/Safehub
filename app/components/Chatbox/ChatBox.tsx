import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import React, { ReactNode } from "react";
import ChatBubble from "./ChatBubble";
import { prisma } from "@/prisma/client";
import { chathistory, User } from "@/app/generated/prisma";

interface Message {
  type: "human" | "ai";
  content: string;
}

const ChatBox = async () => {
  const session = await getServerSession(authOptions);
  const chatHistory = await prisma.chathistory.findMany({
    where: {
      session_id: session?.user?.email || "",
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  const user = await prisma.user.findUnique({
    where: { email: session?.user?.email || "" },
  });
  if (!user) return <div>User not found</div>;

  return (
    <div className="p-5 bg-base-200 rounded-2xl shadow-md">
      {chatHistory.map((chat) => makeChatBubble(chat, user))}
    </div>
  );
};

function makeChatBubble(chat: chathistory, user: User): ReactNode {
  if (!isMessage(chat.message)) {
    return null;
  }

  const message: Message = chat.message;
  return (
    <ChatBubble
      key={chat.id}
      type={message.type}
      src={user.image || undefined}
      message={message.content}
      createdAt={chat.createdAt}
    />
  );
}

function isMessage(value: unknown): value is Message {
  return (
    (typeof value === "object" &&
      value !== null &&
      "type" in value &&
      (value as any).type === "human") ||
    ((value as any).type === "ai" && typeof (value as any).content === "string")
  );
}

export default ChatBox;
