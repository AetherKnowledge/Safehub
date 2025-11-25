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

    // for (let i = 0; i < 100; i++) {
    //   if (!appointment) {
    //     throw new Error("Failed to create appointment");
    //   }

    //   const result = await createAppointmentNotification(
    //     appointment,
    //     NotificationType.AppointmentCreated,
    //     { appointmentId: appointment.id } as AppointmentCreateNotification
    //   );
    //   if (!result.success) {
    //     console.error(
    //       "Failed to create appointment notification:",
    //       result.message
    //     );
    //   }
    // }

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
