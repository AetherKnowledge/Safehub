type Props = {
  onChangeSearch?: (value: string) => void;
};

const ChatSidebarHeader = ({ onChangeSearch }: Props) => {
  return (
    <div className="flex flex-row items-center justify-between gap-3">
      <h1 className="text-xl font-semibold">Chats</h1>
      <label className="input w-full input-sm outline-none ring-0 focus-within:outline-none focus-within:ring-0">
        <svg
          className="h-[1em] opacity-50"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
        >
          <g
            strokeLinejoin="round"
            strokeLinecap="round"
            strokeWidth="2.5"
            fill="none"
            stroke="currentColor"
          >
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.3-4.3"></path>
          </g>
        </svg>
        <input
          type="search"
          className="grow"
          placeholder="Search Chats"
          onChange={(e) => onChangeSearch?.(e.target.value)}
        />
      </label>
      {/* <FaRegEdit className="h-6 w-6 hover:cursor-pointer hover:text-primary duration-150 ease-in-out" />
      <GiHamburgerMenu className="h-6 w-6 hover:cursor-pointer hover:text-primary duration-150 ease-in-out" /> */}
    </div>
  );
};

export default ChatSidebarHeader;
