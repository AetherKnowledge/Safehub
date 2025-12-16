import { auth } from "@/auth";
import { Session } from "next-auth";
import Link from "next/link";
import { Suspense } from "react";
import { FaChevronDown } from "react-icons/fa6";
import { Await } from "react-router";
import DarkModeToggle from "../DarkModeToggle/DarkModeToggle";
import UserImage from "../UserImage";
import SignInButton from "./SignInButton";

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
    <div className="flex items-center gap-2 hover:cursor-pointer bg-linear-to-r from-base-100 to-base-200/50 shadow-xl rounded-xl border border-base-content/5 p-3 backdrop-blur-sm">
      <div className="animate-pulse flex items-center gap-2">
        <div className="w-10 h-10 rounded-full bg-base-300"></div>
        <div className="flex flex-col gap-1">
          <div className="h-3 w-24 bg-base-300 rounded"></div>
          <div className="h-3 w-16 bg-base-300 rounded"></div>
        </div>
      </div>
    </div>
  );
};

const AuthenticatedUserButton = (session: Session) => {
  function getFirstName() {
    const name = session?.user?.name?.split(" ");
    if (!name) return "User";
    return name.length > 1 ? name[0] : "";
  }

  return (
    <div className="flex flex-row bg-linear-to-r from-base-100 to-base-200/50 shadow-xl rounded-xl border border-base-content/5 items-center justify-center backdrop-blur-sm">
      <div className="relative dropdown" role="button" tabIndex={0}>
        <div className="flex flex-row gap-3 items-center justify-center p-3 min-w-max">
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
              <p className="text-xs text-base-content/60">Hello,</p>
              <p className="font-semibold text-sm whitespace-nowrap">
                {getFirstName() || session.user?.email?.split("@")[0] || "User"}
              </p>
            </div>
            <div className="rounded-lg p-2 hover:bg-base-200 active:bg-base-300 transition-all duration-200 cursor-pointer">
              <FaChevronDown className="text-base-content/70 text-lg" />
            </div>
          </div>
        </div>

        <ul className="absolute right-0 mt-2 w-52 menu dropdown-content bg-base-100 text-base-content rounded-xl z-10 p-2 shadow-xl border border-base-content/5">
          <li>
            <DarkModeToggle defaultChecked={session.user?.darkMode || false} />
          </li>
          <li>
            <Link
              href="/api/auth/signout"
              className="hover:bg-error/10 hover:text-error rounded-lg"
            >
              Sign Out
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default UserButton;
