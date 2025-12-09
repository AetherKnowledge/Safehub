"use server";

import { UserType } from "@/app/generated/prisma/browser";
import { auth } from "@/auth";
import { prisma } from "@/prisma/client";

export type TimeRange = "day" | "week" | "month" | "alltime";

export type AppointmentStatsData = {
  week: number;
  month: number;
  allTime: number;
};

export type StatusDataPoint = {
  date: string;
  Approved: number;
  Pending: number;
  Completed: number;
  Cancelled: number;
  DidNotAttend: number;
};

export type TimeSeriesData = {
  dataPoints: StatusDataPoint[];
};

export async function getAppointmentStats(): Promise<AppointmentStatsData> {
  const session = await auth();
  if (!session?.user?.id || session.user.deactivated) {
    throw new Error("Unauthorized");
  }

  const now = new Date();
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - now.getDay());
  startOfWeek.setHours(0, 0, 0, 0);

  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  startOfMonth.setHours(0, 0, 0, 0);

  const whereClause =
    session.user.type === UserType.Counselor
      ? { counselorId: session.user.id }
      : {};

  const [weekCount, monthCount, allTimeCount] = await Promise.all([
    prisma.appointment.count({
      where: {
        ...whereClause,
        createdAt: {
          gte: startOfWeek,
        },
      },
    }),
    prisma.appointment.count({
      where: {
        ...whereClause,
        createdAt: {
          gte: startOfMonth,
        },
      },
    }),
    prisma.appointment.count({
      where: whereClause,
    }),
  ]);

  return {
    week: weekCount,
    month: monthCount,
    allTime: allTimeCount,
  };
}

export async function getAppointmentTimeSeries(
  timeRange: TimeRange,
  department?: string
): Promise<TimeSeriesData> {
  const session = await auth();
  if (!session?.user?.id || session.user.deactivated) {
    throw new Error("Unauthorized");
  }

  const now = new Date();
  let startDate: Date;
  let groupByFormat: string;
  let dateLabels: string[];

  // Calculate date range and labels based on timeRange
  switch (timeRange) {
    case "day":
      // Last 24 hours, grouped by hour
      startDate = new Date(now);
      startDate.setHours(now.getHours() - 24, 0, 0, 0);
      groupByFormat = "hour";
      dateLabels = Array.from({ length: 24 }, (_, i) => {
        const date = new Date(startDate);
        date.setHours(startDate.getHours() + i);
        return date.toLocaleTimeString("en-US", {
          hour: "numeric",
          hour12: true,
        });
      });
      break;

    case "week":
      // Last 7 days including today
      startDate = new Date(now);
      startDate.setDate(now.getDate() - 6);
      startDate.setHours(0, 0, 0, 0);
      groupByFormat = "day";
      dateLabels = Array.from({ length: 7 }, (_, i) => {
        const date = new Date(startDate);
        date.setDate(startDate.getDate() + i);
        return date.toLocaleDateString("en-US", { weekday: "short" });
      });
      break;

    case "month":
      // Last 30 days including today
      startDate = new Date(now);
      startDate.setDate(now.getDate() - 29);
      startDate.setHours(0, 0, 0, 0);
      groupByFormat = "day";
      dateLabels = Array.from({ length: 30 }, (_, i) => {
        const date = new Date(startDate);
        date.setDate(startDate.getDate() + i);
        return date.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        });
      });
      break;

    case "alltime":
      // Get the earliest appointment date
      const earliest = await prisma.appointment.findFirst({
        orderBy: { createdAt: "asc" },
        select: { createdAt: true },
      });

      if (!earliest) {
        return { dataPoints: [] };
      }

      startDate = new Date(earliest.createdAt);
      startDate.setHours(0, 0, 0, 0);

      // Calculate months between earliest and now (inclusive)
      const monthsDiff =
        (now.getFullYear() - startDate.getFullYear()) * 12 +
        (now.getMonth() - startDate.getMonth()) +
        1;

      groupByFormat = "month";
      dateLabels = Array.from({ length: monthsDiff }, (_, i) => {
        const date = new Date(startDate);
        date.setMonth(startDate.getMonth() + i);
        return date.toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
        });
      });
      break;
  }

  // Build where clause
  const whereClause: any = {
    createdAt: {
      gte: startDate,
    },
  };

  // Filter by counselor if counselor role
  if (session.user.type === UserType.Counselor) {
    whereClause.counselorId = session.user.id;
  }

  // Filter by department if provided
  if (department && department !== "all") {
    whereClause.student = {
      user: {
        department: department,
      },
    };
  }

  // Fetch all appointments in the range
  const appointments = await prisma.appointment.findMany({
    where: whereClause,
    select: {
      createdAt: true,
      status: true,
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  // Group appointments by time period and status
  const dataPoints: StatusDataPoint[] = [];

  for (let i = 0; i < dateLabels.length; i++) {
    const periodStart = new Date(startDate);
    const periodEnd = new Date(startDate);

    switch (groupByFormat) {
      case "hour":
        periodStart.setHours(startDate.getHours() + i);
        periodEnd.setHours(startDate.getHours() + i + 1);
        break;
      case "day":
        periodStart.setDate(startDate.getDate() + i);
        periodEnd.setDate(startDate.getDate() + i + 1);
        break;
      case "month":
        periodStart.setMonth(startDate.getMonth() + i);
        periodEnd.setMonth(startDate.getMonth() + i + 1);
        break;
    }

    const periodAppointments = appointments.filter(
      (apt) => apt.createdAt >= periodStart && apt.createdAt < periodEnd
    );

    const statusCounts = {
      Approved: 0,
      Pending: 0,
      Completed: 0,
      Cancelled: 0,
      DidNotAttend: 0,
    };

    periodAppointments.forEach((apt) => {
      statusCounts[apt.status]++;
    });

    dataPoints.push({
      date: dateLabels[i],
      ...statusCounts,
    });
  }

  return { dataPoints };
}
