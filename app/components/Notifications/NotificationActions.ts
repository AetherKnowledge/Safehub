"use server";

import {
  Appointment,
  AppointmentStatus,
  Notification,
  NotificationType,
} from "@/app/generated/prisma";
import { auth } from "@/auth";
import { formatDateDisplay } from "@/lib/utils";
import { prisma } from "@/prisma/client";
import { env } from "next-runtime-env";
import ActionResult from "../ActionResult";
import { formatTimeDisplay } from "../Input/Date/utils";
import {
  AppointmentCreateNotification,
  AppointmentUpdateScheduleNotification,
  AppointmentUpdateStatusNotification,
} from "./schema";

export async function createAppointmentNotification(
  appointment: Appointment,
  type: NotificationType,
  data:
    | AppointmentCreateNotification
    | AppointmentUpdateStatusNotification
    | AppointmentUpdateScheduleNotification
): Promise<ActionResult<void>> {
  try {
    console.log("Creating notification of type:", type, "with data:", data);
    const session = await auth();
    if (!session?.user?.id) {
      return {
        success: false,
        message: "User is not authenticated.",
      };
    }

    if (!appointment.counselorId || !appointment.studentId) {
      return {
        success: false,
        message: "Appointment must have both counselor and student assigned.",
      };
    }

    await prisma.notification.create({
      data: {
        userId: appointment.counselorId,
        type: type,
        data: {
          ...data,
        },
      },
    });

    await prisma.notification.create({
      data: {
        userId: appointment.studentId,
        type: type,
        data: {
          ...data,
        },
      },
    });

    if (!session.supabaseAccessToken) {
      return {
        success: false,
        message: "Supabase access token is missing.",
      };
    }

    const appointmentData = await prisma.appointment.findUnique({
      where: { id: appointment.id },
      include: {
        student: { include: { user: true } },
        counselor: { include: { user: true } },
        parent: { select: { id: true } },
      },
    });
    const n8nWebhookUrl = process.env.N8N_EMAIL_URL!;

    function appointmentStatusToTitle(status: AppointmentStatus) {
      switch (status) {
        case AppointmentStatus.Approved:
          return "Approved";
        case AppointmentStatus.Completed:
          return "Completed";
        case AppointmentStatus.Cancelled:
          return "Cancelled";
        case AppointmentStatus.Pending:
          return "Pending";
        default:
          return "Updated";
      }
    }

    function notificationTypeToTitle(type: NotificationType) {
      if (appointmentData?.parent) {
        return `Appointment Follow-up for Student`;
      }

      switch (type) {
        case NotificationType.AppointmentCreated:
          return "New Appointment Created";
        case NotificationType.AppointmentUpdatedSchedule:
          return "Appointment Rescheduled";
        case NotificationType.AppointmentUpdatedStatus:
          return `Appointment "${
            appointmentData
              ? appointmentStatusToTitle(appointmentData.status)
              : "Updated"
          }"`;
        case NotificationType.AppointmentReminder:
          return "Appointment Reminder";
        case NotificationType.NewPost:
          return "New Post Created";
        default:
          return "Appointment Notification";
      }
    }

    // reminders are handled differently
    console.log(n8nWebhookUrl);
    if (type !== NotificationType.AppointmentReminder && appointmentData) {
      console.log(
        "Sending notification to n8n for appointment:",
        appointment.id
      );
      await fetch(n8nWebhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.supabaseAccessToken}`,
        },
        body: JSON.stringify({
          data: {
            type: type,
            url: env("NEXT_PUBLIC_URL")!,
            title: notificationTypeToTitle(type),
            cancelText: "Cancelled",
            schedDate: formatDateDisplay(appointmentData.startTime),
            schedTime: formatTimeDisplay(appointmentData.startTime),
            studentEmail: appointmentData.student.user.email!,
            counselorEmail: appointmentData.counselor.user.email!,
            mode: appointmentData.sessionPreference,
            studentName: appointmentData.student.user.name,
            counselorName: appointmentData.counselor.user.name,
            ...appointmentData,
          },
        }),
      });
    }

    return {
      success: true,
    };
  } catch (error) {
    console.error("Error creating notification:", (error as Error).message);
    return {
      success: false,
      message: "Failed to create notification. " + (error as Error).message,
    };
  }
}

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
