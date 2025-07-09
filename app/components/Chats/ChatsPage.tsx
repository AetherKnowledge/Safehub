import ChatBox from "./Chatbox/ChatBox";
import ChatHeader from "./Chatbox/ChatHeader";
import ChatSidebar from "./Chatbox/ChatSidebar";

const ChatsPage = async ({ chatId }: { chatId: string }) => {
  return (
    <div className="flex flex-col h-[82vh] ">
      <ChatHeader />
      <div className="divider mt-[-8] mb-[-8] pl-3 pr-3" />
      <div className="flex flex-row h-full">
        <ChatSidebar chatId={chatId} />
        <div className="divider divider-horizontal mx-[-6]" />
        <div className="flex flex-col h-full w-full">
          <ChatBox chatId={chatId} />
        </div>
      </div>
    </div>
  );
};

export default ChatsPage;
