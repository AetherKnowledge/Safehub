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

  const chatForSelectedId = chats.find((chat) => chat.id === chatId) || null;

  return (
    <div className="flex flex-row gap-4 flex-1 min-h-0">
      <ChatSidebar chatId={chatId || undefined} chats={chats} />

      {chatForSelectedId && <ChatBox chat={chatForSelectedId} />}

      {!chatForSelectedId && (
        <div className="hidden xl:flex flex-1 items-center justify-center bg-gradient-to-br from-base-100 to-base-200 rounded-xl border border-base-content/5 shadow-xl">
          <div className="flex flex-col items-center gap-4 p-8 text-center">
            <div className="p-6 bg-primary/10 rounded-full">
              <svg
                className="w-16 h-16 text-primary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-base-content mb-2">
                Select a conversation
              </h3>
              <p className="text-base-content/60 text-sm">
                Choose a chat from the sidebar to start messaging
              </p>
            </div>
          </div>
        </div>
      )}
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
