"use server";

import { DailyMood, MoodType, UserType } from "@/app/generated/prisma";
import { auth } from "@/auth";
import { prisma } from "@/prisma/client";
import ActionResult from "../ActionResult";

export type TimeRange = "day" | "week" | "month" | "alltime";

export type MoodDataPoint = {
  date: string;
  Angry: number;
  Sad: number;
  Disgust: number;
  Joy: number;
  Fear: number;
};

export type MoodTimeSeriesData = {
  dataPoints: MoodDataPoint[];
};

export async function upsertMood(mood: MoodType): Promise<ActionResult<void>> {
  try {
    const session = await auth();
    if (!session?.user?.id || !session.supabaseAccessToken) {
      throw new Error("Unauthorized");
    }

    const today = new Date();

    const moodId = `${session.user.id}-${today.getFullYear()}-${
      today.getMonth() + 1
    }-${today.getDate()}`;

    const existing = await prisma.dailyMood.findUnique({
      where: { id: moodId },
    });

    await prisma.dailyMood.upsert({
      where: { id: moodId },
      create: {
        id: moodId,
        userId: session.user.id,
        mood,
      },
      update: {
        mood,
      },
    });

    return {
      success: true,
    };
  } catch (error) {
    console.error("Error upserting mood:", error);
    return {
      success: false,
      message:
        (error as Error).message || "An error occurred while upserting mood.",
    };
  }
}

export type MoodWithDate = {
  date: Date;
  mood: MoodType;
};

export async function getCurrentUserMoodThisWeek(): Promise<
  ActionResult<MoodWithDate[]>
> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      throw new Error("Unauthorized");
    }
    const today = new Date();
    const startOfWeek = new Date(
      today.setDate(today.getDate() - today.getDay())
    );
    const endOfWeek = new Date(today.setDate(startOfWeek.getDate() + 6));
    const moods = await prisma.dailyMood.findMany({
      where: {
        userId: session.user.id,
        createdAt: {
          gte: startOfWeek,
          lte: endOfWeek,
        },
      },
      orderBy: {
        createdAt: "asc",
      },
    });
    return {
      success: true,
      data: moods.map((mood) => ({ date: mood.createdAt, mood: mood.mood })),
    };
  } catch (error) {
    console.error("Error fetching this week's moods:", error);
    return {
      success: false,
      message:
        (error as Error).message ||
        "An error occurred while fetching this week's moods.",
    };
  }
}

export async function getMoodsThisWeek(): Promise<ActionResult<DailyMood[]>> {
  try {
    const session = await auth();
    if (!session?.user?.id || session.user.type === UserType.Student) {
      throw new Error("Unauthorized");
    }
    const today = new Date(new Date().setHours(0, 0, 0, 0));
    const startOfWeek = new Date(
      today.setDate(today.getDate() - today.getDay())
    );
    const endOfWeek = new Date(today.setDate(startOfWeek.getDate() + 6));
    const moods = await prisma.dailyMood.findMany({
      where: {
        createdAt: {
          gte: startOfWeek,
          lte: endOfWeek,
        },
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    return {
      success: true,
      data: moods,
    };
  } catch (error) {
    console.error("Error fetching this week's moods:", error);
    return {
      success: false,
      message:
        (error as Error).message ||
        "An error occurred while fetching this week's moods.",
    };
  }
}

export async function getMoodTimeSeries(
  timeRange: TimeRange,
  department?: string
): Promise<MoodTimeSeriesData> {
  const session = await auth();
  if (!session?.user?.id || session.user.type === UserType.Student) {
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
      // Last 7 days
      startDate = new Date(now);
      startDate.setDate(now.getDate() - 7);
      startDate.setHours(0, 0, 0, 0);
      groupByFormat = "day";
      dateLabels = Array.from({ length: 7 }, (_, i) => {
        const date = new Date(startDate);
        date.setDate(startDate.getDate() + i);
        return date.toLocaleDateString("en-US", { weekday: "short" });
      });
      break;

    case "month":
      // Last 30 days
      startDate = new Date(now);
      startDate.setDate(now.getDate() - 30);
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
      // Get the earliest mood date
      const earliest = await prisma.dailyMood.findFirst({
        orderBy: { createdAt: "asc" },
        select: { createdAt: true },
      });

      if (!earliest) {
        return { dataPoints: [] };
      }

      startDate = new Date(earliest.createdAt);
      startDate.setHours(0, 0, 0, 0);

      // Calculate months between earliest and now
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
    mood: {
      not: MoodType.Skip,
    },
  };

  // Filter by department if provided
  if (department && department !== "all") {
    whereClause.user = {
      department: department,
    };
  }

  // Fetch all moods in the range
  const moods = await prisma.dailyMood.findMany({
    where: whereClause,
    select: {
      createdAt: true,
      mood: true,
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  // Group moods by time period and type
  const dataPoints: MoodDataPoint[] = [];

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

    const periodMoods = moods.filter(
      (mood) => mood.createdAt >= periodStart && mood.createdAt < periodEnd
    );

    const moodCounts = {
      Angry: 0,
      Sad: 0,
      Disgust: 0,
      Joy: 0,
      Fear: 0,
    };

    periodMoods.forEach((mood) => {
      if (mood.mood !== MoodType.Skip) {
        moodCounts[mood.mood]++;
      }
    });

    dataPoints.push({
      date: dateLabels[i],
      ...moodCounts,
    });
  }

  return { dataPoints };
}
