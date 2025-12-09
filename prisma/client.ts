import { PrismaClient } from "@/app/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

// This file should only be imported in server-side code
if (typeof window !== "undefined") {
  throw new Error("prisma/client should only be imported in server-side code");
}

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});
export const prisma = new PrismaClient({ adapter });

// const globalForPrisma = global as unknown as {
//   prisma: PrismaClient;
// };

// // Create the base client
// const basePrisma = globalForPrisma.prisma || new PrismaClient();

// // Extend it safely
// export const prisma = basePrisma.$extends({
//   result: {
//     chatMessage: {
//       create: {
//         needs: { chatId: true },
//         async compute(chatMessage) {
//           // Note: `this` inside compute refers to the extension context,
//           // not the global prisma, so call basePrisma instead
//           await basePrisma.chat.update({
//             where: { id: chatMessage.chatId },
//             data: { lastMessageAt: new Date() },
//           });
//           return chatMessage;
//         },
//       },
//     },
//   },
// });

// // Cache in dev (hot reload safe)
// if (process.env.NODE_ENV !== "production") {
//   globalForPrisma.prisma = basePrisma;
// }
