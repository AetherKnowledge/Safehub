"use server";

import ActionResult from "@/app/components/ActionResult";
import { UserType } from "@/app/generated/prisma/browser";
import { auth } from "@/auth";
import { prisma } from "@/prisma/client";
import { Order } from "../../Dashboard/Student/Dashboard";
import { ParsedAppointmentLog } from "./schema";
import { AppointmentLogSortBy } from "./sort";

export async function getLogs({
  sortBy = AppointmentLogSortBy.AppointmentDate,
  order = Order.Asc,
}: {
  sortBy: AppointmentLogSortBy;
  order: Order;
}): Promise<ActionResult<ParsedAppointmentLog[]>> {
  try {
    const session = await auth();
    if (
      !session?.user ||
      session.user.type !== UserType.Admin ||
      session.user.deactivated
    ) {
      return { success: false, message: "Unauthorized access." };
    }

    const logs = await prisma.appointmentLog.findMany({
      include: {
        appointment: {
          select: {
            id: true,
            startTime: true,
            endTime: true,
            counselor: {
              select: {
                user: {
                  select: {
                    id: true,
                    name: true,
                  },
                },
              },
            },
            student: {
              select: {
                user: {
                  select: {
                    id: true,
                    name: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    const parsedLogs: ParsedAppointmentLog[] = logs.map((log) => ({
      ...log,
      appointmentId: log.appointment.id,
      counselorName: log.appointment.counselor.user.name || "Unknown Counselor",
      studentName: log.appointment.student.user.name || "Unknown Student",
      startTime: log.appointment.startTime,
      endTime: log.appointment.endTime,
    }));

    const keyMap: Record<
      AppointmentLogSortBy,
      (log: ParsedAppointmentLog) => any
    > = {
      [AppointmentLogSortBy.AppointmentDate]: (log) => log.startTime,
    };

    const sortedLogs = parsedLogs.sort((a, b) => {
      const aValue = keyMap[sortBy](a);
      const bValue = keyMap[sortBy](b);
      if (aValue < bValue) return order === Order.Asc ? -1 : 1;
      if (aValue > bValue) return order === Order.Asc ? 1 : -1;
      return 0;
    });

    return { success: true, data: sortedLogs };
  } catch (error) {
    console.error(error);
    return { success: false, message: "Failed to fetch logs." };
  }
}
