import { ChatData } from "@/@types/network";
import { ChatType, UserStatus } from "@/app/generated/prisma/browser";

export const ChatBotChat: ChatData = {
  id: "chatbot",
  name: "SafeHub AI",
  email: "support@safehub-lcup.uk",
  type: ChatType.DIRECT,
  status: UserStatus.Online,
  src: "/images/safehub-ai.svg",
};
