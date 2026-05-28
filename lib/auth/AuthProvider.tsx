"use client";

import React, { ReactNode } from "react";
import { SessionProvider } from "next-auth/react";
import type { Session } from "next-auth";

interface Prop {
  children: ReactNode;
  session?: Session | null;
}

const AuthProvider = ({ children, session }: Prop) => {
  return <SessionProvider session={session}>{children}</SessionProvider>;
};

export default AuthProvider;
