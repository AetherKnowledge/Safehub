import { UserType } from "@/app/generated/prisma";
import { prisma } from "@/prisma/client";

export const createManyChatsWithOthers = async (
  userType: UserType,
  userId: string
) => {
  const users = await prisma.user.findMany({
    where: {
      type:
        userType === UserType.Student
          ? UserType.Counselor
          : { not: UserType.Student },
      AND: [
        { id: { not: userId } }, // Exclude the current user
      ],
    },
    select: { id: true },
  });

  users.forEach(async (user) => {
    await prisma.chat.create({
      data: {
        members: {
          create: [{ userId }, { userId: user.id }],
        },
      },
    });
  });
};

export const removeManyChatsWithOthers = async (
  userType: UserType,
  userId: string
) => {
  const users = await prisma.user.findMany({
    where: {
      type: userType,
      AND: [
        { id: { not: userId } }, // Exclude the current user
      ],
    },
    select: { id: true },
  });

  users.forEach(async (user) => {
    await prisma.chat.deleteMany({
      where: {
        members: {
          every: {
            userId: {
              in: [userId, user.id],
            },
          },
        },
      },
    });
  });
};

export function addMinutes(date: Date, minutes: number): Date {
  return new Date(date.getTime() + minutes * 60000);
}

export function formatDatetime(date: Date | string): string {
  // const date = new Date(datetimeStr + " UTC");
  date = new Date(date);

  const now = new Date();
  const currentYear = now.getFullYear();
  const isCurrentYear = date.getFullYear() === currentYear;

  const formatter = new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    ...(isCurrentYear ? {} : { year: "numeric" }),
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  return formatter.format(date).replace(",", "");
}

export function formatDateDisplay(
  date: Date | string,
  hasYear: boolean = true
): string {
  // const date = new Date(datetimeStr + " UTC");
  date = new Date(date);

  const formatter = new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: hasYear ? "numeric" : undefined,
  });

  return formatter.format(date);
}

export function formatDate(date: Date | string): string {
  date = new Date(date);
  const formattedDate = [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0"),
  ].join("-");
  return formattedDate;
}

export function convertLocalToUTC(
  date: Date | string,
  withTime?: boolean
): Date {
  date = new Date(date);
  const utcDate = new Date(
    Date.UTC(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      withTime ? date.getHours() : 0,
      withTime ? date.getMinutes() : 0,
      withTime ? date.getSeconds() : 0
    )
  );
  return utcDate;
}

export function convertUTCToLocal(
  date: Date | string,
  withTime?: boolean
): Date {
  date = new Date(date);
  const localDate = new Date(
    date.getUTCFullYear(),
    date.getUTCMonth(),
    date.getUTCDate(),
    withTime ? date.getUTCHours() : 0,
    withTime ? date.getUTCMinutes() : 0,
    withTime ? date.getUTCSeconds() : 0
  );
  return localDate;
}

export function formatTime(date: Date | string): string {
  // const date = new Date(datetimeStr + " UTC");
  date = new Date(date);

  const formatter = new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  return formatter.format(date);
}
