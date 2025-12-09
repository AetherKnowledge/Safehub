"use server";
import { ChatMessage } from "@/app/generated/prisma/browser";
import type { PrismaClient } from "@prisma/client";

export async function extendsDb(prisma: PrismaClient) {
  prisma.$extends({
    result: {
      chatMessage: {
        create: {
          needs: { chatId: true },
          compute(chatMessage: ChatMessage) {
            return prisma.chat.update({
              where: { id: chatMessage.chatId },
              data: { lastMessageAt: new Date() },
            });
          },
        },
      },
    },
  });
}
