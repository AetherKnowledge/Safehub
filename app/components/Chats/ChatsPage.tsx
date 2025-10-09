import { ChatData } from "@/@types/network";
import { getChatBotChat } from "../ChatBot/ChatBotActions";
import ChatBox from "./ChatBox/ChatBox";
import ChatSidebar from "./ChatBox/ChatSidebar";
import { getChats } from "./ChatsActions";

type ChatsPageProps = {
  chatId?: string;
};

const ChatsPage = async ({ chatId }: ChatsPageProps) => {
  // So SafeHub AI is always first
  const chats: ChatData[] = [await getChatBotChat()];
  chats.push(...(await getChats()));

  const chatForSelectedId = chats.find((chat) => chat.id === chatId);

  return (
    <div className="flex flex-row h-[87.5vh] gap-3">
      <ChatSidebar chatId={chatId} chats={chats} />

      {/* This is here because hooks need to be called in the same order
          because chatbot uses different hooks compared to normal chats.
          Navigating between normal chats will not remount the component, but
          navigating to chatbot from another chat will.
      */}
      {chatForSelectedId &&
        (chatForSelectedId.id === "chatbot" ? (
          <ChatBox key={chatId} chat={chatForSelectedId} />
        ) : (
          <ChatBox chat={chatForSelectedId} />
        ))}
    </div>
  );
};

export const ChatPageSkeleton = () => {
  return (
    <div className="flex flex-row h-[87vh] gap-5">
      <ChatSidebar chats={[]} loading={true} />
    </div>
  );
};

export default ChatsPage;
