"use server";

import { chathistory } from "@/app/generated/prisma";
import { auth } from "@/auth";

import { prisma } from "@/prisma/client";
import jwt from "jsonwebtoken";

export async function sendMessage(message: string) {
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

  const data = await response.json();
  console.log("Response from n8n:", data);

  return { data, status: response.status };
}

export async function getHistory(): Promise<chathistory[]> {
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

  return chatHistory;
}
