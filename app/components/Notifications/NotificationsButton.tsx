"use client";

import {
  Notification,
  NotificationType,
  UserType,
} from "@/app/generated/prisma/browser";
import { ReactNode, useEffect, useState } from "react";
import { createPortal } from "react-dom";

import { formatDateDisplay, getRelativeTime } from "@/lib/client-utils";
import { createClient } from "@/lib/supabase/client";
import { motion } from "motion/react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { CiCalendarDate, CiImageOn } from "react-icons/ci";
import { IoMdClose } from "react-icons/io";
import { MdNotificationsNone } from "react-icons/md";
import { formatTimeDisplay } from "../Input/Date/utils";
import {
  deleteNotification,
  fetchNotificationsForUser,
  markNotificationAsRead,
} from "./NotificationActions";
import {
  AppointmentCreateNotification,
  AppointmentDidNotAttendNotification,
  AppointmentReminderNotification,
  AppointmentUpdateScheduleNotification,
  AppointmentUpdateStatusNotification,
  PostNotification,
} from "./schema";

const NotificationsButton = () => {
  const drawerId = "notifications-drawer";
  const session = useSession();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [mounted, setMounted] = useState(false);

  const hasUnread = notifications.some((n) => !n.isRead);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    async function fetchNotifications() {
      const result = await fetchNotificationsForUser();
      if (result.success && result.data) {
        setNotifications(result.data);
        console.log("Fetched notifications:", result.data);
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
    if (!session.data?.supabaseAccessToken || session.data?.user.deactivated)
      return;
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
              payload.new as Notification,
              ...prevNotifications,
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

  async function handleDeleteNotification(notificationId: string) {
    await deleteNotification(notificationId);
    setNotifications((prevNotifications) =>
      prevNotifications.filter((n) => n.id !== notificationId)
    );
  }

  return (
    <>
      {/* Button only - no drawer wrapper */}
      <label htmlFor={drawerId} className="drawer-button">
        <div className="btn btn-ghost btn-circle hover:bg-base-200/50 relative">
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
              className={`w-6 h-6 transition-colors duration-300 ${
                hasUnread ? "text-primary" : "text-base-content/70"
              }`}
            />
          </motion.div>
          {hasUnread && (
            <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full animate-pulse"></span>
          )}
        </div>
      </label>

      {/* Drawer - portalled to document body */}
      {mounted &&
        createPortal(
          <div className="drawer drawer-end fixed inset-0 z-50 pointer-events-none">
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
            <div className="drawer-side pointer-events-auto">
              <label
                htmlFor={drawerId}
                aria-label="close sidebar"
                className="drawer-overlay"
              />

              <div className="menu bg-gradient-to-b from-base-100 to-base-200 min-h-full w-100 p-0 shadow-xl border-l border-base-content/5">
                {/* Sidebar content here */}
                <div className="flex flex-row items-center bg-base-100/50 border-b border-base-content/5 backdrop-blur-sm sticky top-0 z-10 text-base-content">
                  <h2 className="text-xl font-bold p-4 pb-3 w-full">
                    Notifications
                  </h2>
                  <label
                    htmlFor={drawerId}
                    className="btn btn-ghost btn-sm btn-circle m-2 cursor-pointer hover:bg-base-200"
                  >
                    <IoMdClose className="w-5 h-5" />
                  </label>
                </div>
                <div className="px-4 pb-3">
                  <button
                    className="text-error hover:underline text-sm cursor-pointer transition-all hover:text-error/80"
                    onClick={handleDeleteAll}
                  >
                    Clear All
                  </button>
                </div>
                <div className="overflow-y-auto flex-1">
                  {notifications.map((notification) => (
                    <NotificationBox
                      key={notification.id}
                      notification={notification}
                      isFirst={notifications[0].id === notification.id}
                      onCloseAction={() =>
                        handleDeleteNotification(notification.id)
                      }
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
          </div>,
          document.body
        )}
    </>
  );
};

export const NotificationBoxSkeleton = () => {
  return (
    <div className="skeleton h-[87px] border-l-4 border-primary/50 mx-2 my-1 rounded-lg" />
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
      className={`border-l-4 mx-2 my-1 rounded-lg bg-base-100/80 hover:bg-base-100 transition-all duration-200 text-base-content ${
        notification.isRead ? "border-base-300" : "border-primary shadow-sm"
      }`}
    >
      <div className="flex flex-row p-3 gap-3">
        <div className={`flex items-center justify-center flex-shrink-0`}>
          {notificationTypeToImage(notification.type)}
        </div>
        <div className="flex flex-col gap-1.5 w-full items-start">
          <p className="text-sm font-medium text-base-content">
            {notificationTypeToMessage(notification, notificationData)}
          </p>
          <p className="text-xs text-base-content/60">
            {getRelativeTime(new Date(notification.createdAt))}
          </p>
          <Link
            className="text-primary hover:underline w-fit text-sm font-medium transition-colors"
            href={notificationTypeToLink(notification.type, notificationData)}
            onCanPlay={onCloseAction}
          >
            View Details →
          </Link>
        </div>
        <div className="flex-shrink-0">
          <button
            className="btn btn-ghost btn-sm btn-circle hover:bg-error/10 hover:text-error"
            onClick={onCloseAction}
          >
            <IoMdClose className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

function notificationTypeToMessage(
  notification: Notification,
  data:
    | AppointmentCreateNotification
    | AppointmentDidNotAttendNotification
    | PostNotification
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
    case NotificationType.AppointmentDidNotAttend:
      const notificationData = data as AppointmentDidNotAttendNotification;
      if (!notificationData.date) {
        return "You did not attend your appointment.";
      }
      const date = new Date(notificationData.date);
      return `You did not attend your appointment on ${formatDateDisplay(
        date
      )} at ${formatTimeDisplay(date)}.`;

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
    case NotificationType.AppointmentCreated:
    case NotificationType.AppointmentReminder:
      return JSON.parse(
        JSON.stringify(notification.data)
      ) as AppointmentCreateNotification;
    case NotificationType.AppointmentUpdatedStatus:
      return JSON.parse(
        JSON.stringify(notification.data)
      ) as AppointmentUpdateStatusNotification;
    case NotificationType.AppointmentUpdatedSchedule:
      return JSON.parse(
        JSON.stringify(notification.data)
      ) as AppointmentUpdateScheduleNotification;
    case NotificationType.AppointmentReminder:
      return JSON.parse(
        JSON.stringify(notification.data)
      ) as AppointmentReminderNotification;
    case NotificationType.AppointmentDidNotAttend:
      return JSON.parse(
        JSON.stringify(notification.data)
      ) as AppointmentDidNotAttendNotification;
    case NotificationType.NewPost:
      return JSON.parse(JSON.stringify(notification.data)) as PostNotification;
    default:
      return null;
  }
}

function notificationTypeToImage(type: NotificationType): ReactNode {
  switch (type) {
    case NotificationType.AppointmentCreated:
    case NotificationType.AppointmentReminder:
    case NotificationType.AppointmentUpdatedSchedule:
    case NotificationType.AppointmentUpdatedStatus:
    case NotificationType.AppointmentDidNotAttend:
      return <CiCalendarDate className="w-5 h-5" />;
    default:
      return <CiImageOn className="w-5 h-5" />;
  }
}

function notificationTypeToLink(
  type: NotificationType,
  data:
    | AppointmentCreateNotification
    | AppointmentUpdateStatusNotification
    | AppointmentReminderNotification
    | AppointmentUpdateScheduleNotification
    | PostNotification
    | null,
  userType?: UserType
): string {
  switch (type) {
    case NotificationType.AppointmentCreated:
    case NotificationType.AppointmentReminder:
    case NotificationType.AppointmentUpdatedSchedule:
    case NotificationType.AppointmentUpdatedStatus:
    case NotificationType.AppointmentDidNotAttend:
      const params = new URLSearchParams({
        appointmentId: (
          data as AppointmentCreateNotification
        ).appointmentId.toString(),
      });
      const url = `/user/appointments?${params.toString()}`;

      return url;

    case NotificationType.NewPost:
      const postParams = new URLSearchParams({
        postId: (data as PostNotification).postId.toString(),
      });
      const postUrl = `/user/${
        userType === UserType.Admin ? "events" : "dashboard"
      }?${postParams.toString()}`;

      return postUrl;

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
