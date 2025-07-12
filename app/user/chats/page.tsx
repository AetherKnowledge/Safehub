"use server";
import authOptions from "@/lib/auth/authOptions";
import { authenticateUser } from "@/lib/utils";
import { prisma } from "@/prisma/client";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

const page = async () => {
  const defaultChatId = await firstChatId();

  redirect("/user/chats/" + defaultChatId);
};

const firstChatId = async () => {
  "use server";

  const session = await getServerSession(authOptions);
  if (!session || !(await authenticateUser(session))) {
    return redirect("/login");
  }

  const chat = await prisma.chat.findFirst({
    where: {
      members: {
        some: {
          userId: session.user.id,
        },
      },
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  return chat?.id ? chat.id : "-1";
};

export default page;
