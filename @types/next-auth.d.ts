import { AppointmentStatus, UserType } from "@/app/generated/prisma";
import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id?: string;
      type?: UserType;
    } & DefaultSession["user"];
  }
}
