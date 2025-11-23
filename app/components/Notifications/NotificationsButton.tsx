"use client";

import { Notification, NotificationType } from "@/app/generated/prisma";
import { ReactNode, useEffect, useState } from "react";

import { createClient } from "@/lib/supabase/client";
import { getRelativeTime } from "@/lib/utils";
import { motion } from "motion/react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { CiCalendarDate, CiImageOn } from "react-icons/ci";
import { IoMdClose } from "react-icons/io";
import { MdNotificationsNone } from "react-icons/md";
import {
  deleteNotification,
  fetchNotificationsForUser,
  markNotificationAsRead,
} from "./NotificationActions";
import {
  AppointmentCreateNotification,
  AppointmentReminderNotification,
  AppointmentUpdateStatusNotification,
  PostNotification,
} from "./schema";

const NotificationsButton = () => {
  const drawerId = "notifications-drawer";
  const session = useSession();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const hasUnread = notifications.some((n) => !n.isRead);

  useEffect(() => {
    async function fetchNotifications() {
      const result = await fetchNotificationsForUser();
      if (result.success && result.data) {
        setNotifications(result.data);
      }
    }

    fetchNotifications().finally(() => setLoading(false));
  }, []);

  function handleReadAll() {
    const unreadNotifications = notifications.filter((n) => !n.isRead);
    unreadNotifications.forEach(async (notification) => {
      await markNotificationAsRead(notification.id);
      setNotifications((prevNotifications) =>
        prevNotifications.map((n) =>
          n.id === notification.id ? { ...n, isRead: true } : n
        )
      );
    });
  }

  function handleDeleteAll() {
    notifications.forEach(async (notification) => {
      await deleteNotification(notification.id);
    });
    setNotifications([]);
  }

  useEffect(() => {
    if (!session.data?.supabaseAccessToken) return;
    let supabase = null;

    // sometimes creating the client fails
    try {
      supabase = createClient(session.data?.supabaseAccessToken);
    } catch (error) {
      console.error("Error creating Supabase client:", error);
    }

    if (!supabase) return;

    const subscription = supabase
      .channel("notifications-channel")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "Notification" },
        (payload) => {
          console.log("Notification payload:", payload);
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
    <div className="drawer drawer-end w-full">
      <input
        id={drawerId}
        type="checkbox"
        className="drawer-toggle"
        onChange={(e) => {
          if (e.target.checked) {
            handleReadAll();
          }
        }}
      />
      <div className="drawer-content">
        {/* Page content here */}
        <label htmlFor={drawerId} className="drawer-button w-full">
          <div className="flex flex-row items-center justify-end w-full gap-2">
            <div className="btn btn-ghost p-1">
              <motion.div
                key={hasUnread ? "unread" : "read"}
                animate={
                  hasUnread
                    ? { rotate: [0, -15, 15, -10, 10, 0, 0, 0, 0, 0, 0, 0, 0] }
                    : { rotate: 0 }
                }
                transition={
                  hasUnread
                    ? { duration: 2, repeat: Infinity, ease: "easeInOut" }
                    : { duration: 0.3 }
                }
              >
                <MdNotificationsNone
                  className={`w-7 h-7 transition-colors duration-300 ${
                    hasUnread ? "text-primary" : ""
                  }`}
                />
              </motion.div>
            </div>
          </div>
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
          <h2 className="text-xl font-bold p-4 pb-0">Notifications</h2>
          <button
            className="text-error hover:underline p-4 pt-0 text-left cursor-pointer"
            onClick={handleDeleteAll}
          >
            Clear All
          </button>
          {notifications.map((notification) => (
            <NotificationBox
              key={notification.id}
              notification={notification}
              isFirst={notifications[0].id === notification.id}
              onCloseAction={() => {
                deleteNotification(notification.id);
              }}
            />
          ))}
          {loading && (
            <>
              <NotificationBoxSkeleton />
              <NotificationBoxSkeleton />
              <NotificationBoxSkeleton />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export const NotificationBoxSkeleton = () => {
  return (
    <div className="skeleton h-[87px] rounded-none border-l-2 border-primary" />
  );
};

export const NotificationBox = ({
  notification,
  isFirst,
  onCloseAction,
}: {
  notification: Notification;
  isFirst?: boolean;
  onCloseAction: () => void;
}) => {
  const notificationData = parseNotificationData(notification);
  if (!notificationData) {
    return null;
  }

  return (
    <div
      className={`border border-b border-base-300 text-left
        ${isFirst ? "border-t" : ""}
        ${notification.isRead ? "" : "border-l-primary border-l-2"}`}
    >
      <div className="flex flex-row p-2 gap-2">
        <div className={`flex items-center justify-center m-2`}>
          {notificationTypeToImage(notification.type)}
        </div>
        <div className="flex flex-col gap-1 w-full items-start">
          <p>{notificationTypeToMessage(notification, notificationData)}</p>
          <p className="font-light">
            {getRelativeTime(new Date(notification.createdAt))}
          </p>
          <Link
            className="text-primary hover:underline w-fit"
            href={notificationTypeToLink(notification.type)}
          >
            View
          </Link>
        </div>
        <div>
          <button className="btn btn-ghost p-0 h-5 w-5" onClick={onCloseAction}>
            <IoMdClose />
          </button>
        </div>
      </div>
    </div>
  );
};

function notificationTypeToMessage(
  notification: Notification,
  data: AppointmentCreateNotification | PostNotification
): string {
  switch (notification.type) {
    case NotificationType.AppointmentCreated:
      return "An appointment has been created";
    case NotificationType.AppointmentUpdatedStatus:
      return `An appointment has been updated to ${
        (data as AppointmentUpdateStatusNotification).to
      }`;
    case NotificationType.AppointmentUpdatedSchedule:
      return "An appointment's schedule has been updated.";
    case NotificationType.AppointmentReminder:
      return `This is a reminder for your upcoming appointment in ${reminderTypeToMessage(
        (data as AppointmentReminderNotification).type
      )}.`;
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
  | AppointmentUpdateStatusNotification
  | PostNotification
  | null {
  switch (notification.type) {
    case NotificationType.AppointmentCreated ||
      NotificationType.AppointmentReminder:
      return JSON.parse(
        JSON.stringify(notification.data)
      ) as AppointmentCreateNotification;
    case NotificationType.AppointmentUpdatedStatus:
      return JSON.parse(
        JSON.stringify(notification.data)
      ) as AppointmentUpdateStatusNotification;
    case NotificationType.AppointmentReminder:
      return JSON.parse(
        JSON.stringify(notification.data)
      ) as AppointmentReminderNotification;
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
      NotificationType.AppointmentUpdatedStatus:
      return <CiCalendarDate className="w-5 h-5" />;
    default:
      return <CiImageOn className="w-5 h-5" />;
  }
}

function notificationTypeToLink(type: NotificationType): string {
  switch (type) {
    case NotificationType.AppointmentCreated ||
      NotificationType.AppointmentReminder ||
      NotificationType.AppointmentUpdatedStatus:
      return "/user/appointments";
    default:
      return "/user/dashboard";
  }
}

function reminderTypeToMessage(type: string): string {
  switch (type) {
    case "ONE_WEEK":
      return "One Week";
    case "ONE_DAY":
      return "One Day";
    case "SIX_HOURS":
      return "Six Hours";
    case "ONE_HOUR":
      return "One Hour";
    default:
      return "";
  }
}

export default NotificationsButton;
