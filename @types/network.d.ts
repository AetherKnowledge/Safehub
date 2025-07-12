import { UserStatus } from "@/app/generated/prisma";

export interface ParsedChat {
  id: string;
  name: string;
  email: string;
  type: ChatType;
  latestMessage?: string;
  src?: string;
  status: UserStatus;
  latestMessageAt?: Date;
}
