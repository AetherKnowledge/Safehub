import { ChatData } from "@/@types/network";
import { getChatBotChat } from "../../components/ChatBot/ChatBotActions";
import { getSettings } from "../AiManagement/AiManagementActions";
import ChatBox from "./ChatBox/ChatBox";
import ChatSidebar from "./ChatBox/ChatSidebar";
import { getChats } from "./ChatsActions";

type ChatsPageProps = {
  chatId?: string;
};

const ChatsPage = async ({ chatId }: ChatsPageProps) => {
  // So SafeHub AI is always first
  const chats: ChatData[] = [];
  if ((await getSettings()).isAiOn) {
    chats.push(await getChatBotChat());
  }
  chats.push(...(await getChats()));

  const chatForSelectedId =
    chats.find((chat) => chat.id === chatId) || chats[0];

  return (
    <div className="flex flex-row gap-3 flex-1 min-h-0">
      <ChatSidebar chatId={chatId || chats[0]?.id} chats={chats} />

      {chatForSelectedId && <ChatBox chat={chatForSelectedId} />}
    </div>
  );
};

export const ChatPageSkeleton = () => {
  return (
    <div className="flex flex-row h-full gap-5">
      <ChatSidebar chats={[]} loading={true} />
    </div>
  );
};

export default ChatsPage;
