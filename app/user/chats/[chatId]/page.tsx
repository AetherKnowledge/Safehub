import ChatsPage from "@/app/components/Chats/ChatsPage";

const page = async ({ params }: { params: Promise<{ chatId: string }> }) => {
  const { chatId } = await params;

  return <ChatsPage chatId={chatId} />;
};

export default page;
