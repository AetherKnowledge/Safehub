"use client";
import { on } from "events";
import React from "react";
import { useState } from "react";

interface Props {
  onSend?: () => void;
}

const ChatboxInput = ({ onSend }: Props) => {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault(); // prevents page refresh
    if (!message.trim()) return;

    setLoading(true);
    await sendMessage(message);
    onSend?.();
    setLoading(false);

    setMessage("");
  };

  return (
    <div className="border-t border-base-300 p-4 bg-base-200 rounded-b-2xl ">
      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        <input
          type="text"
          placeholder="Type a message..."
          onChange={(e) => setMessage(e.target.value)}
          className="input input-bordered flex-1 focus:outline-none focus:ring-0"
        />
        {loading ? (
          <div className="loading loading-spinner loading-md"></div>
        ) : (
          <button
            type="submit"
            className="btn btn-primary"
            disabled={!message.trim()}
          >
            Send
          </button>
        )}
      </form>
    </div>
  );
};

const sendMessage = async (message: string) => {
  const res = await fetch("/api/user/sendmessage", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message: message }),
  });

  return await res.json();
};

export default ChatboxInput;
