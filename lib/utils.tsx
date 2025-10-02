import { UserType } from "@/app/generated/prisma";
import { prisma } from "@/prisma/client";
import { Session } from "next-auth";
import Image from "next/image";
import { ReactNode } from "react";

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

export const authenticateUser = async (
  session: Session,
  userType?: UserType
): Promise<boolean> => {
  if (!session || !session.user?.email) {
    return false;
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { id: true, type: true },
  });

  if (!user) {
    return false;
  }

  if (userType && user.type !== userType.toString()) return false;

  return true;
};

export function imageGenerator(
  name: string,
  width: number,
  src?: string
): ReactNode {
  return (
    <>
      {src ? (
        <div className={`w-${width}`}>
          <Image
            src={src}
            alt={name ?? "counselor Avatar"}
            className={`w-${width} h-${width} rounded-full`}
            width={width * 2}
            height={width * 2}
          />
        </div>
      ) : (
        <div className={`w-${width}`}>
          <div
            role="button"
            tabIndex={0}
            className={`w-${width} h-${width} rounded-full bg-gray-500 text-white flex items-center justify-center font-bold hover:brightness-90 active:brightness-75 transition duration-150 select-none cursor-pointer`}
          >
            {name.charAt(0).toUpperCase()}
          </div>
        </div>
      )}
    </>
  );
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
