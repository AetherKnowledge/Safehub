import ChatsPage, { ChatPageSkeleton } from "@/app/pages/Chats/ChatsPage";
import { Suspense } from "react";

const page = async ({ params }: { params: Promise<{ chatId: string }> }) => {
  const { chatId } = await params;

  return (
    <Suspense fallback={<ChatPageSkeleton />}>
      <ChatsPage chatId={chatId} />
    </Suspense>
  );
};

export default page;
