"use server";

import { Notification } from "@/app/generated/prisma";
import { auth } from "@/auth";
import { prisma } from "@/prisma/client";
import ActionResult from "../ActionResult";

export async function fetchNotificationsForUser(): Promise<
  ActionResult<Notification[]>
> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return {
        success: false,
        message: "User is not authenticated.",
      };
    }

    const notifications = await prisma.notification.findMany({
      where: {
        userId: session.user.id,
      },
    });

    return {
      success: true,
      data: notifications,
    };
  } catch (error) {
    console.error("Error fetching notifications:", (error as Error).message);
    return {
      success: false,
      message: "Failed to fetch notifications. " + (error as Error).message,
    };
  }
}

export async function markNotificationAsRead(
  notificationId: string
): Promise<ActionResult<null>> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return {
        success: false,
        message: "User is not authenticated.",
      };
    }

    await prisma.notification.updateMany({
      where: {
        id: notificationId,
        userId: session.user.id,
      },
      data: {
        isRead: true,
      },
    });

    return {
      success: true,
      data: null,
    };
  } catch (error) {
    console.error(
      "Error marking notification as read:",
      (error as Error).message
    );
    return {
      success: false,
      message:
        "Failed to mark notification as read. " + (error as Error).message,
    };
  }
}

export async function deleteNotification(
  notificationId: string
): Promise<ActionResult<null>> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return {
        success: false,
        message: "User is not authenticated.",
      };
    }

    await prisma.notification.deleteMany({
      where: {
        id: notificationId,
        userId: session.user.id,
      },
    });

    return {
      success: true,
      data: null,
    };
  } catch (error) {
    console.error("Error deleting notification:", (error as Error).message);
    return {
      success: false,
      message: "Failed to delete notification. " + (error as Error).message,
    };
  }
}
