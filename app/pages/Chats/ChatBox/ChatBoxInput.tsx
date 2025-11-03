"use client";
import React, { useState } from "react";
import { IoIosSend } from "react-icons/io";

interface Props {
  onSend?: (content: string) => void;
  asyncOnsend?: (content: string) => Promise<void>;
  className?: string;
}

const ChatBoxInput = ({ onSend, asyncOnsend, className }: Props) => {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault(); // prevents page refresh
    if (!message.trim()) return;

    setLoading(true);
    setMessage("");

    try {
      onSend?.(message);
      if (asyncOnsend) {
        await asyncOnsend(message);
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }

    setLoading(false);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`flex items-center gap-2 mt-4 ${className}`}
    >
      <input
        type="text"
        placeholder="Type a message..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="input rounded-2xl bg-base-200 border-none flex-1 outline-none ring-0 focus:outline-none focus:ring-0"
      />
      <div className="flex items-center justify-center w-8">
        {loading ? (
          <div className="loading loading-spinner text-primary loading-md"></div>
        ) : (
          <button type="submit" disabled={!message.trim()}>
            <IoIosSend
              type="submit"
              className="text-3xl text-primary cursor-pointer hover:text-secondary transition-colors"
            />
          </button>
        )}
      </div>
    </form>
  );
};

export default ChatBoxInput;
