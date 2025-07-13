import { Message } from "@/lib/socket/hooks/useMessaging";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { ReactNode } from "react";
import ReactMarkdown from "react-markdown";

interface Props {
  message: Message;
}

const ChatBubble = ({ message }: Props) => {
  const session = useSession();
  if (
    !session ||
    !session.data ||
    !session.data.user ||
    session.status != "authenticated"
  )
    return null;

  const defaultPosition =
    "chat chat-" + (session.data.user.id === message.userId ? "end" : "start");

  return (
    <div className={defaultPosition}>
      <div className="chat-image avatar">
        <div className="w-10 rounded-full">
          {image(message.name, message.src)}
        </div>
      </div>
      <div className="chat-header text-base-content text-xs/normal flex items-center ml-1 mr-1">
        {session.data.user.id !== message.userId && message.name}
        <time className="text-xs opacity-50 ml-2 mr-2">
          {formatDatetime(message.createdAt)}
        </time>
        {session.data.user.id === message.userId && message.name}
      </div>
      <div className="chat-bubble prose max-w-[800px]">
        <ReactMarkdown>{message.content}</ReactMarkdown>
      </div>
      <div className="chat-footer opacity-50 text-base-content flex">
        <span>Delivered</span>
      </div>
    </div>
  );
};

function image(name: string, src?: string): ReactNode {
  // if human and with src image, return the image
  if (src) {
    return (
      <Image
        alt="Tailwind CSS chat bubble component"
        src={src}
        width={40}
        height={40}
      />
    );
  }

  return (
    <div
      role="button"
      tabIndex={0}
      className="w-10 h-10 rounded-full bg-gray-500 text-white flex items-center justify-center font-bold hover:brightness-90 active:brightness-75 transition duration-150 select-none cursor-pointer"
    >
      {name!.charAt(0).toUpperCase()}
    </div>
  );
}

export function formatDatetime(date: Date): string {
  // const date = new Date(datetimeStr + " UTC");
  date = new Date(date);

  const now = new Date();
  const currentYear = now.getFullYear();
  const isCurrentYear = date.getFullYear() === currentYear;

  const formatter = new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    ...(isCurrentYear ? {} : { year: "numeric" }),
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  return formatter.format(date).replace(",", "");
}

export default ChatBubble;
