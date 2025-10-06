import { auth, signIn } from "@/auth";
import Link from "next/link";
import { FcGoogle } from "react-icons/fc";

const LoginButton = async () => {
  const session = await auth();

  return (
    <>
      {session ? (
        <Link
          href="/user/dashboard"
          className="btn btn-primary min-w-50 mx-auto lg:mx-0 py-[clamp(1.25rem,2vw,2.5rem)] text-step-1 font-medium"
        >
          Go To Dashboard
        </Link>
      ) : (
        <form
          action={async () => {
            "use server";
            await signIn();
          }}
        >
          <button
            className="flex items-center justify-center btn btn-primary gap-3 min-w-50 mx-auto lg:mx-0 py-[clamp(1.25rem,2vw,2.5rem)]"
            type="submit"
          >
            <div className="bg-base-100 rounded-full w-[clamp(1.25rem,2vw,2.5rem)] h-[clamp(1.25rem,2vw,2.5rem)] flex items-center justify-center">
              <FcGoogle className="w-[clamp(1.25rem,2vw,2.5rem)] h-[clamp(1.25rem,2vw,2.5rem)]" />
            </div>
            <p className="text-step-1 font-medium">Register Now</p>
          </button>
        </form>
      )}
    </>
  );
};

export default LoginButton;
