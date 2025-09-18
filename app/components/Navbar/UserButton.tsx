import { auth, signIn, signOut } from "@/auth";
import { Session } from "next-auth";
import Image from "next/image";
import { FaChevronDown } from "react-icons/fa6";

const UserButton = async () => {
  const session = await auth();

  return (
    <div className="flex items-center gap-2 hover:cursor-pointer">
      {session ? (
        AuthenticatedUserButton(session)
      ) : (
        <form
          action={async () => {
            "use server";
            await signIn();
          }}
        >
          <button
            className="btn btn-primary w-25 font-semibold duration-150 ease-in-out hover:scale-105"
            type="submit"
          >
            Sign in
          </button>
        </form>
      )}
    </div>
  );
};

const AuthenticatedUserButton = (session: Session) => {
  function getLastName() {
    const name = session?.user?.name?.split(" ");
    if (!name) return "User";
    return name.length > 1 ? name[name.length - 1] : "";
  }

  return (
    <div className="flex flex-row bg-base-100 shadow-br rounded-lg items-center justify-center gap-y-2">
      <div className="relative dropdown" role="button" tabIndex={0}>
        <div className="flex flex-row gap-2 items-center justify-center px-2 min-w-max py-2">
          {session.user?.image ? (
            <Image
              className="w-10 h-10 rounded-full "
              src={session.user.image}
              alt={session.user.name || "User Profile"}
              width={40}
              height={40}
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gray-500 text-white flex items-center justify-center font-bold select-none cursor-pointer">
              {session.user?.email?.charAt(0).toUpperCase() || "?"}
            </div>
          )}

          <div className="flex flex-row gap-3 items-center justify-center">
            <div className="flex flex-col text-base-content">
              <p className="text-sm">Hello,</p>
              <p className="font-semibold text-sm whitespace-nowrap">
                Mr. {getLastName()}
              </p>
            </div>
            <div className="rounded-md p-1 hover:brightness-90 hover:bg-base-200 active:brightness-75 transition object-cover duration-150 ease-in-out hover:scale-105 cursor-pointer">
              <FaChevronDown className="text-base-content text-2xl" />
            </div>
          </div>
        </div>

        <ul className="absolute right-0 mt-2 w-52 menu dropdown-content bg-base-100 text-base-content rounded-md z-10 p-2 shadow-br">
          <li>
            <label>
              <input
                type="checkbox"
                value="lcup-dark"
                className="toggle theme-controller"
              />
              Dark Mode
            </label>
          </li>
          <li>
            <form
              action={async () => {
                "use server";
                await signOut();
              }}
            >
              <button type="submit">Sign Out</button>
            </form>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default UserButton;
