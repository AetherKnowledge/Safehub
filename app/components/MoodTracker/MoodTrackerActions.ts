"use server";

import { DailyMood, MoodType, UserType } from "@/app/generated/prisma";
import { auth } from "@/auth";
import { prisma } from "@/prisma/client";
import ActionResult from "../ActionResult";

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
