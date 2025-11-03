import { Message } from "@/@types/network";
import { ReactNode } from "react";
import MessageBubble from "./MessageBubble";

const ChatHistory = ({
  loading,
  messages,
  userId,
}: {
  loading: boolean;
  messages: Message[] | null;
  userId: string;
}): ReactNode => {
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full space-y-4">
        <div className="loading loading-spinner loading-lg text-primary"></div>
        <p className="text-base-content">Loading chat...</p>
      </div>
    );
  }

  if (!messages || messages.length === 0) {
    return (
      <p className="text-center text-base-content/70 mt-4">
        No chat history available.
      </p>
    );
  }

  return messages.map((chat) => (
    <MessageBubble
      key={chat.id}
      name={chat.name}
      image={chat.src}
      imageSize={10}
      content={chat.content}
      createdAt={chat.createdAt}
      self={userId === chat.userId}
    />
  ));
};

export default ChatHistory;
