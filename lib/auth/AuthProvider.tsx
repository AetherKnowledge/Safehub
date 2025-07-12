"use client";

import React, { ReactNode } from "react";
import { SessionProvider } from "next-auth/react";

interface Prop {
  children: ReactNode;
}

const AuthProvider = ({ children }: Prop) => {
  return <SessionProvider>{children}</SessionProvider>;
};

export default AuthProvider;
