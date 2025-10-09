"use client";
import { ChatData } from "@/@types/network";
import { UserType } from "@/app/generated/prisma";
import { useEffect, useState } from "react";
import ChatSidebarHeader from "./ChatSidebarHeader";
import ChatSidebarUserBox, {
  SidebarUserBoxSkeleton,
} from "./ChatSidebarUserBox";
import FilterButton from "./FilterButton";

export enum ChatFilter {
  All = "all",
  Counselors = "counselors",
  Unread = "unread",
}

const ChatSidebar = ({
  chatId,
  chats,
  loading = false,
}: {
  chatId?: string;
  chats: ChatData[];
  loading?: boolean;
}) => {
  const [filter, setFilter] = useState<ChatFilter>(ChatFilter.All);
  const [searchText, setSearchText] = useState("");
  const [filteredChats, setFilteredChats] = useState<ChatData[]>(chats);

  // Filter chats based on filter and search text
  useEffect(() => {
    let updatedChats = [...chats];
    if (filter === ChatFilter.Counselors) {
      updatedChats = updatedChats.filter(
        (chat) => chat.type === UserType.Counselor
      );
    }
    if (searchText) {
      updatedChats = updatedChats.filter((chat) =>
        chat.name.toLowerCase().includes(searchText.toLowerCase())
      );
    }
    setFilteredChats(updatedChats);
  }, [filter, searchText, chats]);

  return (
    <div className="flex flex-col bg-base-100 shadow-br rounded-xl p-4 gap-2">
      <ChatSidebarHeader onChangeSearch={setSearchText} />
      <div className="flex flex-row items-center gap-3">
        <FilterButton
          currentValue={filter}
          value={ChatFilter.All}
          onClick={() => setFilter(ChatFilter.All)}
        >
          All
        </FilterButton>
        <FilterButton
          value={ChatFilter.Counselors}
          currentValue={filter}
          onClick={() => setFilter(ChatFilter.Counselors)}
        >
          Counselors
        </FilterButton>
        <FilterButton
          value={ChatFilter.Unread}
          currentValue={filter}
          onClick={() => setFilter(ChatFilter.Unread)}
        >
          Unread
        </FilterButton>
      </div>
      <div className="flex flex-col overflow-y-auto scrollbar-thin scrollbar-thumb-base-300 scrollbar-track-base-200 h-full">
        {loading
          ? Array.from({ length: 5 }).map((_, index) => (
              <SidebarUserBoxSkeleton key={index} />
            ))
          : filteredChats.map((chat) => (
              <ChatSidebarUserBox
                key={chat.id}
                chat={chat}
                selected={chatId === chat.id}
              />
            ))}
      </div>
    </div>
  );
};

export default ChatSidebar;
