import { UserType } from "@/app/generated/prisma";
import { Order, SortBy } from "@/app/pages/Dashboard/Student/Dashboard";
import { PostData } from "@/app/pages/Post/PostActions";
import { prisma } from "@/prisma/client";
import { ZodError } from "zod";

export const createManyChatsWithOthers = async (
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

export function sortPosts(
  posts: PostData[],
  sortBy = SortBy.Date,
  order = Order.Desc
) {
  if (!posts) return [];
  if (!sortBy || !order) return posts;

  const sortedPosts = [...posts];

  if (sortBy === SortBy.Date) {
    sortedPosts.sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return order === Order.Asc ? dateA - dateB : dateB - dateA;
    });
  } else if (sortBy === SortBy.Likes) {
    sortedPosts.sort((a, b) => {
      const likesA = a.likeStats.count;
      const likesB = b.likeStats.count;
      return order === Order.Asc ? likesA - likesB : likesB - likesA;
    });
  } else if (sortBy === SortBy.Comments) {
    sortedPosts.sort((a, b) => {
      const commentsA = a.comments.length;
      const commentsB = b.comments.length;
      return order === Order.Asc
        ? commentsA - commentsB
        : commentsB - commentsA;
    });
  }

  return sortedPosts;
}

export function prettifyZodErrorMessage(error: ZodError<any>): string {
  return error.issues
    .map((issue) => {
      const path = issue.path.length ? issue.path.join(".") : "root";
      const expected = (issue as any).expected
        ? `, Expected: ${(issue as any).expected}`
        : "";
      return `Field: ${path}, Error: ${issue.message}${expected}`;
    })
    .join("\n---\n");
}

export function getRelativeTime(date: Date): string {
  const now = new Date();
  const diffInMs = now.getTime() - new Date(date).getTime();
  const diffInSeconds = Math.floor(diffInMs / 1000);
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);
  const diffInWeeks = Math.floor(diffInDays / 7);
  const diffInMonths = Math.floor(diffInDays / 30);
  const diffInYears = Math.floor(diffInDays / 365);

  if (diffInSeconds <= 0) return "now";
  if (diffInSeconds < 60) return `${diffInSeconds}s`;
  if (diffInMinutes < 60) return `${diffInMinutes}m`;
  if (diffInHours < 24) return `${diffInHours}h`;
  if (diffInDays < 7) return `${diffInDays}d`;
  if (diffInWeeks < 4) return `${diffInWeeks}w`;
  if (diffInMonths < 12) return `${diffInMonths}mo`;
  return `${diffInYears}yr`;
}
