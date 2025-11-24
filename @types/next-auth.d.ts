import { MoodType, UserType } from "@/app/generated/prisma";
import { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
  interface Session {
    supabaseAccessToken?: string;
    user: {
      id?: string;
      type?: UserType;
      darkMode?: boolean;
      moodToday?: MoodType; // Optional field for mood today
      deactivated?: boolean;
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    id?: string;
    type?: UserType;
    darkMode?: boolean;
    moodToday?: MoodType; // Optional field for mood today
    deactivated?: boolean;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    type?: UserType;
    darkMode?: boolean;
    moodToday?: MoodType; // Optional field for mood today
    deactivated?: boolean;
  }
}

declare module "ws" {
  interface WebSocket {
    userId?: string;
    userType?: UserType;
    chatId?: string;
    callId?: string; // Added callId to WebSocket interface
    socketId?: string; // Added socketId to WebSocket interface
  }
  interface WebSocketServer {
    clients: Set<WebSocket>;
  }
}
