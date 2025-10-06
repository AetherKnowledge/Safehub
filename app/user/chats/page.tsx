import ChatsPage, { ChatPageSkeleton } from "@/app/components/Chats/ChatsPage";
import { Suspense } from "react";

const page = async ({
  searchParams,
}: {
  searchParams: Promise<{ chatId: string }>;
}) => {
  const { chatId } = await searchParams;

  return (
    <Suspense fallback={<ChatPageSkeleton />}>
      <ChatsPage chatId={chatId} />
    </Suspense>
  );
};

export default page;
