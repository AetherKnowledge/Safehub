import { auth, signIn } from "@/auth";
import { Session } from "next-auth";
import Link from "next/link";
import { Suspense } from "react";
import { FaChevronDown } from "react-icons/fa6";
import { Await } from "react-router";
import DarkModeToggle from "../DarkModeToggle/DarkModeToggle";
import UserImage from "../UserImage";

const UserButton = async () => {
  return (
    <div className="flex items-center gap-2 hover:cursor-pointer">
      <Suspense fallback={<LoadingUserButton />}>
        <Await resolve={await auth()}>
          {(session) =>
            session ? AuthenticatedUserButton(session) : <SignInButton />
          }
        </Await>
      </Suspense>
    </div>
  );
};

const LoadingUserButton = () => {
  return (
    <div className="flex items-center gap-2 hover:cursor-pointer bg-base-100 shadow-br rounded-lg p-2">
      <div className="animate-pulse flex items-center gap-2">
        <div className="w-10 h-10 rounded-full bg-gray-500"></div>
        <div className="flex flex-col">
          <div className="h-4 w-24 bg-gray-500 rounded"></div>
          <div className="h-4 w-16 bg-gray-500 rounded"></div>
        </div>
      </div>
    </div>
  );
};

const SignInButton = () => {
  return (
    <form
      action={async () => {
        "use server";
        await signIn(undefined, { redirectTo: "/user/dashboard" });
      }}
    >
      <button
        className="btn btn-primary w-25 font-semibold duration-150 ease-in-out hover:scale-105"
        type="submit"
      >
        Sign in
      </button>
    </form>
  );
};

const AuthenticatedUserButton = (session: Session) => {
  function getFirstName() {
    const name = session?.user?.name?.split(" ");
    if (!name) return "User";
    return name.length > 1 ? name[0] : "";
  }

  return (
    <div className="flex flex-row bg-base-100 shadow-br rounded-lg items-center justify-center gap-y-2">
      <div className="relative dropdown" role="button" tabIndex={0}>
        <div className="flex flex-row gap-2 items-center justify-center p-2 min-w-max">
          <UserImage
            name={
              session.user?.name || session.user?.email?.split("@")[0] || "User"
            }
            src={session.user?.image || undefined}
            width={10}
            bordered={false}
          />

          <div className="flex flex-row gap-3 items-center justify-center">
            <div className="flex flex-col text-base-content">
              <p className="text-sm">Hello,</p>
              <p className="font-semibold text-sm whitespace-nowrap">
                {getFirstName() || session.user?.email?.split("@")[0] || "User"}
              </p>
            </div>
            <div className="rounded-md p-1 hover:brightness-90 hover:bg-base-200 active:brightness-75 transition object-cover duration-150 ease-in-out hover:scale-105 cursor-pointer">
              <FaChevronDown className="text-base-content text-2xl" />
            </div>
          </div>
        </div>

        <ul className="absolute right-0 mt-2 w-52 menu dropdown-content bg-base-100 text-base-content rounded-md z-10 p-2 shadow-br">
          <li>
            <DarkModeToggle defaultChecked={session.user?.darkMode || false} />
          </li>
          <li>
            <Link href="/api/auth/signout">Sign Out</Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default UserButton;
