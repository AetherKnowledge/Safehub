"use server";

import ActionResult from "@/app/components/ActionResult";
import { NotificationType } from "@/app/generated/prisma";
import { auth } from "@/auth";
import { prisma } from "@/prisma/client";

export async function testAction(): Promise<ActionResult<void>> {
  try {
    function getRandom(): NotificationType {
      const statuses = Object.values(NotificationType);
      const randomIndex = Math.floor(Math.random() * statuses.length);
      return statuses[randomIndex];
    }

    const session = await auth();
    if (!session?.user || !session.user.id) {
      return {
        success: false,
        message: "You must be logged in to perform this action.",
      };
    }

    const appointment = await prisma.appointment.findFirst({});
    if (!appointment) {
      return {
        success: false,
        message: "No appointment found.",
      };
    }

    const n8nWebhookUrl = process.env.N8N_EMAIL_URL!;

    // reminders are handled differently
    // console.log(n8nWebhookUrl);
    // console.log("Sending notification to n8n for appointment:", appointment.id);
    // const result = await fetch(n8nWebhookUrl, {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //     Authorization: `Bearer ${session.supabaseAccessToken}`,
    //   },
    //   body: JSON.stringify({
    //     data: {
    //       message: "tang ina mo gumana ka",
    //     },
    //   }),
    // });

    // console.log("Result from n8n:", result);

    return { success: true };
  } catch (error) {
    console.error("Error in testAction:", error);
    return {
      success: false,
      message: "Error in testAction " + (error as Error).message,
    };
  }
}

export async function clearNotifications(): Promise<ActionResult<void>> {
  try {
    const session = await auth();
    if (!session?.user || !session.user.id) {
      return {
        success: false,
        message: "You must be logged in to perform this action.",
      };
    }

    await prisma.notification.deleteMany({
      where: {
        userId: session.user.id,
      },
    });

    return { success: true };
  } catch (error) {
    console.error("Error in clearNotifications:", error);
    return {
      success: false,
      message: "Error in clearNotifications " + (error as Error).message,
    };
  }
}

export async function updateFirstNotification(): Promise<ActionResult<void>> {
  try {
    const session = await auth();
    if (!session?.user || !session.user.id) {
      return {
        success: false,
        message: "You must be logged in to perform this action.",
      };
    }
    const notification = await prisma.notification.findFirst({
      where: {
        userId: session.user.id,
      },
    });
    if (!notification) {
      return {
        success: false,
        message: "No notification found.",
      };
    }
    await prisma.notification.update({
      where: {
        id: notification.id,
      },
      data: {
        isRead: false,
      },
    });
    return { success: true };
  } catch (error) {
    console.error("Error in updateFirstNotification:", error);
    return {
      success: false,
      message: "Error in updateFirstNotification " + (error as Error).message,
    };
  }
}
