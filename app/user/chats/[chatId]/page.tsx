import ChatsPage from "@/app/components/Chats/ChatsPage";

interface Props {
  params: {
    chatId: string;
  };
}

const page = async ({ params }: Props) => {
  const { chatId } = await params;

  return <ChatsPage chatId={chatId} />;
};

export default page;
