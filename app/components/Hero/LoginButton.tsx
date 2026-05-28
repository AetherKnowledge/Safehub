"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";

const LoginButton = () => {
  const session = useSession().data;

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
        <Link
          href="/sign-in"
          className="flex items-center justify-center btn btn-primary gap-3 min-w-50 mx-auto lg:mx-0 py-[clamp(1.25rem,2vw,2.5rem)]"
        >
          <p className="text-step-1 font-medium">Sign in</p>
        </Link>
      )}
    </>
  );
};

export default LoginButton;
