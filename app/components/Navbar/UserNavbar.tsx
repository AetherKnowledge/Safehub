import PageTitle from "./PageTitle";
import UserButton from "./UserButton";

const UserNavbar = () => {
  return (
    <div className="flex flex-row bg-base-200 top-0 gap-3 sticky z-10 items-center justify-center ">
      <div className="flex bg-base-100 shadow-br rounded-lg w-full items-center h-full px-4 py-3 gap-5">
        <PageTitle />
        {/* <label className="flex-1 input text-base-content focus-within:outline-none focus-within:ring-0 input-sm ">
          <svg
            className="h-[1em] opacity-50"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="1 0 22 22"
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
          <input type="search" className="grow" placeholder="Search" />
        </label> */}
      </div>
      <UserButton />
    </div>
  );
};

export default UserNavbar;
