"use server";

import { Days, UserStatus, UserType } from "@/app/generated/prisma";
import { auth } from "@/auth";
import { isUserOnline } from "@/lib/redis";

import { prisma } from "@/prisma/client";

export type CounselorData = {
  name: string | null;
  type: UserType;
  Counselor: {
    AvailableSlots: {
      counselorId: string;
      id: string;
      day: Days;
      startTime: string;
      endTime: string;
    }[];
  } | null;
  id: string;
  email: string;
  image: string | null;
  status: UserStatus;
};

export async function getCounselors() {
  const session = await auth();

  if (!session || !(session.user.type === UserType.Student)) {
    throw new Error("Unauthorized");
  }

  const counselors = await prisma.user.findMany({
    where: {
      type: UserType.Counselor,
    },
    orderBy: {
      createdAt: "asc",
    },
    select: {
      id: true,
      name: true,
      type: true,
      image: true,
      email: true,
      Counselor: {
        select: {
          AvailableSlots: true,
        },
      },
      status: true,
    },
  });

  const counselorsWithStatus = await Promise.all(
    counselors.map(async (counselor) =>
      (await isUserOnline(counselor.id))
        ? { ...counselor, status: UserStatus.Online }
        : { ...counselor, status: UserStatus.Offline }
    )
  );

  return counselorsWithStatus as CounselorData[];
}
