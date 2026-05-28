"use client";

import Link from "next/link";

const SignInButton = () => {
  return (
    <Link
      href="/sign-in"
      className="btn btn-primary w-25 font-semibold duration-150 ease-in-out hover:scale-105"
    >
      Sign in
    </Link>
  );
};

export default SignInButton;
