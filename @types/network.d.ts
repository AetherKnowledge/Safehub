import { ChatMessage, UserStatus } from "@/app/generated/prisma";

export interface Messaging {
  messages: Message[];
  loading: boolean;
  sendMessage: (content: string) => Promise<void>;
}

export interface Message extends ChatMessage {
  name: string;
  src?: string;
}

export interface ChatData {
  id: string;
  name: string;
  email: string;
  type: ChatType;
  latestMessage?: Message;
  src?: string;
  status: UserStatus;
}
