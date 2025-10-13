import ChatsPage, { ChatPageSkeleton } from "@/app/pages/Chats/ChatsPage";
import { Suspense } from "react";

const page = async () => {
  return (
    <Suspense fallback={<ChatPageSkeleton />}>
      <ChatsPage />
    </Suspense>
  );
};

export default page;
