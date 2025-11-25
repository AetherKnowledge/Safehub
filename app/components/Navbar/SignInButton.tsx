"use client";

import { signIn } from "next-auth/react";

const SignInButton = () => {
  return (
    <button
      className="btn btn-primary w-25 font-semibold duration-150 ease-in-out hover:scale-105"
      onClick={() => signIn("google", { redirectTo: "/user/dashboard" })}
    >
      Sign in
    </button>
  );
};

export default SignInButton;
