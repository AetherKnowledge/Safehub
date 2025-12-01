import UserImage from "@/app/components/UserImage";
import { formatDateDisplay, formatTime } from "@/lib/utils";
import ReactMarkdown from "react-markdown";

interface Props {
  name: string;
  image?: string;
  imageSize?: number;
  content: string;
  createdAt: string | Date;
  self?: boolean;
  showStatus?: boolean;
  anonymous?: boolean;
}

const MessageBubble = ({
  name,
  image,
  imageSize = 10,
  content,
  createdAt,
  self = false,
  showStatus = true,
  anonymous = false,
}: Props) => {
  const defaultPosition = self ? "chat chat-end" : "chat chat-start";
  const isLoading = !content || content.trim() === "";

  return (
    <div className={defaultPosition}>
      <div className="chat-image avatar">
        <div className={`w-${imageSize} rounded-full`}>
          <UserImage
            name={anonymous ? "Anonymous" : name}
            width={imageSize}
            src={anonymous ? undefined : image}
          />
        </div>
      </div>
      <div className="chat-header text-base-content text-xs/normal flex items-center ml-1 mr-1">
        {anonymous ? "Anonymous" : !self && name}
        <time className="text-xs opacity-50 ml-2 mr-2">
          {createdAt.toLocaleString() === new Date().toLocaleString()
            ? formatDateDisplay(createdAt, false)
            : formatTime(createdAt)}
        </time>
        {self && "You"}
      </div>
      <div
        className={`chat-bubble prose max-w-[800px] ${
          self ? "bg-primary text-primary-content" : "bg-neutral"
        }`}
      >
        {isLoading ? (
          <span className="flex gap-1 items-center">
            <span className="animate-bounce">●</span>
            <span className="animate-bounce [animation-delay:0.15s]">●</span>
            <span className="animate-bounce [animation-delay:0.3s]">●</span>
          </span>
        ) : (
          <ReactMarkdown>{content}</ReactMarkdown>
        )}
      </div>
      <div className="chat-footer opacity-50 text-base-content flex">
        {showStatus && <span>Delivered</span>}
      </div>
    </div>
  );
};
export default MessageBubble;
