"use client";

import { Notification, NotificationType } from "@/app/generated/prisma";
import { ReactNode, useEffect, useState } from "react";

import { createClient } from "@/lib/supabase/client";
import { getRelativeTime } from "@/lib/utils";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { CiCalendarDate, CiImageOn } from "react-icons/ci";
import { MdNotificationsNone } from "react-icons/md";
import { fetchNotificationsForUser } from "./NotificationActions";
import {
  AppointmentCreateNotification,
  AppointmentUpdateNotification,
  PostNotification,
} from "./schema";

const NotificationsButton = () => {
  const drawerId = "notifications-drawer";
  const session = useSession();
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    async function fetchNotifications() {
      const result = await fetchNotificationsForUser();
      if (result.success && result.data) {
        setNotifications(result.data);
      }
    }

    fetchNotifications();
  }, []);

  useEffect(() => {
    if (!session.data?.supabaseAccessToken) return;
    const supabase = createClient(session.data?.supabaseAccessToken);
    const subscription = supabase
      .channel("notifications-channel")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "Notification" },
        (payload) => {
          if (payload.eventType === "INSERT") {
            setNotifications((prevNotifications) => [
              ...prevNotifications,
              payload.new as Notification,
            ]);
          } else if (payload.eventType === "UPDATE") {
            setNotifications((prevNotifications) =>
              prevNotifications.map((notification) =>
                notification.id === (payload.new as Notification).id
                  ? (payload.new as Notification)
                  : notification
              )
            );
          } else if (payload.eventType === "DELETE") {
            setNotifications((prevNotifications) =>
              prevNotifications.filter(
                (notification) =>
                  notification.id !== (payload.old as Notification).id
              )
            );
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, [session.data?.supabaseAccessToken]);

  return (
    <div className="drawer drawer-end w-auto">
      <input id={drawerId} type="checkbox" className="drawer-toggle" />
      <div className="drawer-content">
        {/* Page content here */}
        <label htmlFor={drawerId} className="drawer-button btn btn-ghost p-2">
          <MdNotificationsNone className="w-7 h-7" />
        </label>
      </div>
      <div className="drawer-side">
        <label
          htmlFor={drawerId}
          aria-label="close sidebar"
          className="drawer-overlay"
        />

        <div className="menu bg-base-200 min-h-full w-100 p-0">
          {/* Sidebar content here */}
          <h2 className="text-xl font-bold p-4">Notifications</h2>
          {notifications.map((notification) => (
            <NotificationBox
              key={notification.id}
              notification={notification}
              isFirst={notifications[0].id === notification.id}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export const NotificationBox = ({
  notification,
  isFirst,
}: {
  notification: Notification;
  isFirst?: boolean;
}) => {
  const notificationData = parseNotificationData(notification);
  if (!notificationData) {
    return null;
  }

  return (
    <Link
      className={`border border-b border-base-300 text-left cursor-pointer 
        hover:bg-base-300/50 active:bg-base-300 transition-all 
        ${isFirst ? "border-t" : ""}
        ${notification.isRead ? "" : "border-l-primary border-l-2"}`}
      href={notificationTypeToLink(notification.type)}
    >
      <div className="flex flex-row p-2 gap-2">
        <div className={`flex items-center justify-center m-2`}>
          {notificationTypeToImage(notification.type)}
        </div>
        <div className="flex flex-col gap-1">
          <p>{notificationTypeToMessage(notification, notificationData)}</p>
          <p className="font-light">
            {getRelativeTime(new Date(notification.createdAt))}
          </p>
        </div>
      </div>
    </Link>
  );
};

function notificationTypeToMessage(
  notification: Notification,
  data: AppointmentCreateNotification | PostNotification
): string {
  switch (notification.type) {
    case NotificationType.AppointmentCreated:
      return "An appointment has been created";
    case NotificationType.AppointmentUpdated:
      return `An appointment has been updated to ${
        (data as AppointmentUpdateNotification).to
      }`;
    case NotificationType.AppointmentReminder:
      return "This is a reminder for your upcoming appointment.";
    case NotificationType.NewPost:
      return "A new post has been published.";
    default:
      return "You have a new notification.";
  }
}

function parseNotificationData(
  notification: Notification
):
  | AppointmentCreateNotification
  | AppointmentUpdateNotification
  | PostNotification
  | null {
  switch (notification.type) {
    case NotificationType.AppointmentCreated ||
      NotificationType.AppointmentReminder:
      return JSON.parse(
        JSON.stringify(notification.data)
      ) as AppointmentCreateNotification;
    case NotificationType.AppointmentUpdated:
      return JSON.parse(
        JSON.stringify(notification.data)
      ) as AppointmentUpdateNotification;
    case NotificationType.NewPost:
      return JSON.parse(JSON.stringify(notification.data)) as PostNotification;
    default:
      return null;
  }
}

function notificationTypeToImage(type: NotificationType): ReactNode {
  switch (type) {
    case NotificationType.AppointmentCreated ||
      NotificationType.AppointmentReminder ||
      NotificationType.AppointmentUpdated:
      return <CiCalendarDate className="w-5 h-5" />;
    default:
      return <CiImageOn className="w-5 h-5" />;
  }
}

function notificationTypeToLink(type: NotificationType): string {
  switch (type) {
    case NotificationType.AppointmentCreated ||
      NotificationType.AppointmentReminder ||
      NotificationType.AppointmentUpdated:
      return "/user/appointments";
    default:
      return "/";
  }
}

export default NotificationsButton;
