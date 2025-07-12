"use client";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { useCallback, useEffect } from "react";
import { useSocket } from "./socket/SocketProvider";

interface Props {
  children: React.ReactNode;
}

const NotificationProvider = ({ children }: Props) => {
  const onMessage = useSocket().onMessage;
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
    const receiveMessage = onMessage((data) => {
      // Don't show notification if user is in /user/chats/*
      if (
        data.userId !== session.data?.user.id &&
        !(pathname && pathname.startsWith("/user/chats/"))
      ) {
        console.log("Showing notification for message:", data);
        showNotification(data.name, {
          icon: data.src,
          body: data.content,
        });
      }
    });

    return () => {
      receiveMessage();
    };
  }, [onMessage, pathname, session.data?.user.id]);

  return <>{children}</>;
};

export default NotificationProvider;
