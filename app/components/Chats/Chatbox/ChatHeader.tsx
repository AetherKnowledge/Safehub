"use client";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { IoIosCall } from "react-icons/io";
import { MdCallEnd } from "react-icons/md";
import { useCalling } from "../../Socket/useCalling";

const ChatHeader = ({ chatId }: { chatId: string }) => {
  const [calling, initiateCall, answerCall, rejectCall, leaveCall] =
    useCalling(chatId);
  const session = useSession();

  useEffect(() => {
    if (calling && calling.callerId !== session.data?.user.id) {
      console.log("Incoming call:", calling);
      // Here you can handle the incoming call, e.g., show a modal or notification
    }
  }, [calling]);

  return (
    <div className="p-4 border-b-1 border-none rounded-t-2xl text-base-content bg-base-100">
      <div className="flex flex-row justify-between">
        <h2 className="text-3xl font-bold text-primary">Chats</h2>
        <div className="flex flex-row gap-5">
          <IoIosCall
            className="text-2xl text-primary cursor-pointer hover:text-secondary transition-colors mt-2"
            onClick={() => initiateCall(chatId)}
          />
          <MdCallEnd
            className="text-2xl text-primary cursor-pointer hover:text-secondary transition-colors mt-2"
            onClick={() => leaveCall()}
          />
          <IoIosCall
            className="text-2xl text-accent cursor-pointer hover:text-secondary transition-colors mt-2"
            onClick={() => answerCall()}
          />
          <MdCallEnd
            className="text-2xl text-accent cursor-pointer hover:text-secondary transition-colors mt-2"
            onClick={() => rejectCall()}
          />
        </div>
      </div>
    </div>
  );
};

export default ChatHeader;
