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
