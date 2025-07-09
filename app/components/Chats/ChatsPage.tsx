import { ChatType } from "@/app/generated/prisma";
import { prisma } from "@/prisma/client";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ReactNode } from "react";
import AuthOptions from "../AuthOptions";
import { authenticateUser, imageGenerator } from "../Utils";
import ChatBox from "./Chatbox/ChatBox";

interface Chat {
  id: string;
  name: string;
  type: ChatType;
  src: ReactNode;
}

const ChatsPage = async ({ chatId }: { chatId: string }) => {
  const chats = await fetchChats();
  if (chatId === "-1" && chats && chats.length > 0) {
    redirect("/user/chats/" + chats[0].id);
  }

  return (
    <div className="flex flex-col h-[82vh] ">
      <div className="p-4 border-b-1 border-none rounded-t-2xl text-base-content bg-base-100">
        <h2 className="text-3xl font-bold text-primary">Chats</h2>
      </div>
      <div className="divider mt-[-8] mb-[-8] pl-3 pr-3" />
      <div className="flex flex-row h-full">
        <div className="flex flex-col overflow-y-auto">
          {chats?.map((chat) => (
            <Link
              key={chat.id}
              role="button"
              className={
                (chatId === chat.id ? "bg-base-300" : "hover:bg-base-200") +
                " button px-2 py-2 transition-opacity flex items-center justify-between gap-4 w-[20vw]"
              }
              href={"/user/chats/" + chat.id}
            >
              {chat.src}
              <div className="text-left text-base-content font-medium w-full">
                {chat.name}
              </div>
            </Link>
          ))}
        </div>
        <div className="divider divider-horizontal mx-[-6]" />
        <div className="flex flex-col h-full w-full">
          <ChatBox chatId={chatId} />
        </div>
      </div>
    </div>
  );
};

const fetchChats = async () => {
  const session = await getServerSession(AuthOptions);

  if (!session || !(await authenticateUser(session))) {
    return null;
  }

  const chats = await prisma.chat.findMany({
    where: {
      members: {
        some: {
          userId: session.user.id,
        },
      },
    },

    select: {
      id: true,
      name: true,
      createdAt: true,
      type: true,
      members: {
        select: {
          user: {
            select: {
              id: true,
              name: true,
              image: true,
              email: true,
            },
          },
        },
      },
    },
  });

  return chats.map((chat) => {
    const member = chat.members.find(
      (member) => member.user.id !== session.user.id
    )?.user;

    if (!member) {
      return {
        id: chat.id,
        name: "Unknown",
        type: chat.type,
        src: imageGenerator("Unknown", 10),
      } as Chat;
    }

    return {
      id: chat.id,
      name: member?.name || "Unknown",
      type: chat.type,
      src: imageGenerator(
        member.name || member.email,
        10,
        member?.image || undefined
      ),
    } as Chat;
  });
};
export default ChatsPage;
