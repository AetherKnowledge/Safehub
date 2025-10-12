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
    <div className="flex flex-row h-full gap-3">
      <ChatSidebar chatId={chatId} chats={chats} />

      {chatForSelectedId && <ChatBox chat={chatForSelectedId} />}
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
