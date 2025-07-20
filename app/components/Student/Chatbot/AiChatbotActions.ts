"use server";

import { chathistory } from "@/app/generated/prisma";
import authOptions from "@/lib/auth/authOptions";
import { authenticateUser } from "@/lib/utils";
import { prisma } from "@/prisma/client";
import { getServerSession } from "next-auth";

export async function sendMessage(message: string): Promise<any> {
  const session = await getServerSession(authOptions);
  if (!session || !authenticateUser(session)) {
    throw new Error("Unauthorized");
  }

  if (!message || typeof message !== "string") {
    throw new Error("Invalid request");
  }

  const n8nWebhookUrl = process.env.N8N_URL!;
  const response = await fetch(n8nWebhookUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      userId: session.user.id,
      message,
    }),
  });

  const data = await response.json();
  console.log("Response from n8n:", data);

  return { data, status: response.status };
}

export async function getHistory(): Promise<chathistory[]> {
  const session = await getServerSession(authOptions);

  if (!session || !authenticateUser(session)) {
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

  return chatHistory;
}
