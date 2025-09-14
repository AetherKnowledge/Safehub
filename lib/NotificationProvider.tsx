"use client";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { useCallback, useEffect } from "react";
import { useSocket } from "./socket/SocketProvider";
import { Message } from "./socket/hooks/useMessaging";

interface Props {
  children: React.ReactNode;
}

const NotificationProvider = ({ children }: Props) => {
  const onRecieveData = useSocket().onRecieveData;
  const session = useSession();
  const pathname = usePathname();

  useEffect(() => {
    // Request notification permission on mount
    if ("Notification" in window && Notification.permission !== "granted") {
      Notification.requestPermission();
    }
  }, []);

  const showNotification = useCallback(
    (title: string, options?: NotificationOptions) => {
      if (Notification.permission === "granted") {
        new Notification(title, options);
      }
    },
    []
  );

  useEffect(() => {
    const receiveMessage = onRecieveData((data) => {
      // Don't show notification if user is in /user/chats/*

      const message = data.payload as Message;
      if (
        message.userId !== session.data?.user.id &&
        !(pathname && pathname.startsWith("/user/chats/"))
      ) {
        console.log("Showing notification for message:", message);
        showNotification(message.name, {
          icon: message.src,
          body: message.content,
        });
      }
    });

    return () => {
      receiveMessage();
    };
  }, [onRecieveData, pathname, session.data?.user.id]);

  return <>{children}</>;
};

export default NotificationProvider;
