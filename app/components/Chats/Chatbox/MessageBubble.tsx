import { formatDatetime } from "@/lib/utils";
import Image from "next/image";
import { ReactNode } from "react";
import ReactMarkdown from "react-markdown";

interface Props {
  name: string;
  image?: string;
  imageSize?: number;
  content: string;
  createdAt: string | Date;
  self?: boolean;
  showStatus?: boolean;
}

const MessageBubble = ({
  name,
  image,
  imageSize = 10,
  content,
  createdAt,
  self = false,
  showStatus = true,
}: Props) => {
  const defaultPosition = self ? "chat chat-end" : "chat chat-start";

  return (
    <div className={defaultPosition}>
      <div className="chat-image avatar">
        <div className={`w-${imageSize} rounded-full`}>
          {avatarGenerator(name, imageSize, image)}
        </div>
      </div>
      <div className="chat-header text-base-content text-xs/normal flex items-center ml-1 mr-1">
        {!self && name}
        <time className="text-xs opacity-50 ml-2 mr-2">
          {formatDatetime(createdAt)}
        </time>
        {self && name}
      </div>
      <div className="chat-bubble prose max-w-[800px]">
        <ReactMarkdown>{content}</ReactMarkdown>
      </div>
      <div className="chat-footer opacity-50 text-base-content flex">
        {showStatus && <span>Delivered</span>}
      </div>
    </div>
  );
};

function avatarGenerator(name: string, width: number, src?: string): ReactNode {
  // if human and with src image, return the image
  if (src) {
    return (
      <Image
        alt="Tailwind CSS chat bubble component"
        src={src}
        width={width * 2}
        height={width * 2}
      />
    );
  }

  return (
    <div
      role="button"
      tabIndex={0}
      className={`w-${width} h-${width} rounded-full bg-gray-500 text-white flex items-center justify-center font-bold hover:brightness-90 active:brightness-75 transition duration-150 select-none cursor-pointer`}
    >
      {name!.charAt(0).toUpperCase()}
    </div>
  );
}

export default MessageBubble;
