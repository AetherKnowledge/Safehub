import { auth } from "@/auth";
import NotificationProvider from "@/lib/NotificationProvider";
import type { Metadata } from "next";
import { PublicEnvScript } from "next-runtime-env";
import { Inter, Manrope } from "next/font/google";
import AuthProvider from "../lib/auth/AuthProvider";
import SocketProvider from "../lib/socket/SocketProvider";
import ChatBotProvider from "./components/ChatBot/ChatBotProvider";
import CallPopupProvider from "./components/Chats/ChatBox/CallPopupProvider";
import PopupProvider from "./components/Popup/PopupProvider";
import "./globals.css";

// change await auth() to <Await resolve={await auth()}>
// then use it in a child component

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Safehub",
  description: "A safe space for your conversations",
};

// TODO: make all padding consistent

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  const darkMode = session?.user?.darkMode ?? false;

  return (
    <html lang="en" data-theme={darkMode ? "lcup-dark" : "light"}>
      <head>
        <PublicEnvScript />
      </head>
      <body className={`${inter.variable} antialiased`}>
        <div className="h-screen text-base-content">
          <PopupProvider>
            <AuthProvider>
              <SocketProvider>
                <CallPopupProvider>
                  <NotificationProvider>
                    <ChatBotProvider>{children}</ChatBotProvider>
                  </NotificationProvider>
                </CallPopupProvider>
              </SocketProvider>
            </AuthProvider>
          </PopupProvider>
        </div>
      </body>
    </html>
  );
}
