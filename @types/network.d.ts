import { UserStatus } from "@/app/generated/prisma";

export interface ChatData {
  id: string;
  name: string;
  email: string;
  type: ChatType;
  isLatestMessageFromSelf?: boolean;
  latestMessage?: string;
  src?: string;
  status: UserStatus;
  latestMessageAt?: Date;
}
