"use server";

import ActionResult from "@/app/components/ActionResult";
import { UserType } from "@/app/generated/prisma";
import { AppointmentLogSortBy } from "@/app/user/appointment-logs/page";
import { auth } from "@/auth";
import { prisma } from "@/prisma/client";
import { Order } from "../../Dashboard/Student/Dashboard";
import { ParsedAppointmentLog } from "./schema";

export async function getLogs({
  perPage = 5,
  page = 1,
  sortBy = AppointmentLogSortBy.AppointmentDate,
  order = Order.Asc,
}: {
  perPage: number;
  page: number;
  sortBy: AppointmentLogSortBy;
  order: Order;
}): Promise<
  ActionResult<{ logs: ParsedAppointmentLog[]; totalCount: number }>
> {
  try {
    if (perPage <= 0 || page <= 0) {
      return { success: false, message: "Invalid pagination parameters." };
    }

    if (isNaN(perPage) || isNaN(page)) {
      return {
        success: false,
        message: "Pagination parameters must be numbers.",
      };
    }

    const session = await auth();
    if (!session?.user || session.user.type !== UserType.Admin) {
      return { success: false, message: "Unauthorized access." };
    }

    const logs = await prisma.appointmentLog.findMany({
      skip: (page - 1) * perPage,
      take: perPage,
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

    const sortedLogs = parsedLogs.sort((a, b) => {
      const aValue = a[sortBy];
      const bValue = b[sortBy];
      if (aValue < bValue) return order === Order.Asc ? -1 : 1;
      if (aValue > bValue) return order === Order.Asc ? 1 : -1;
      return 0;
    });

    const count = await prisma.appointmentLog.count();

    return { success: true, data: { logs: sortedLogs, totalCount: count } };
  } catch (error) {
    console.error(error);
    return { success: false, message: "Failed to fetch logs." };
  }
}
