"use server";

import { Days, UserStatus, UserType } from "@/app/generated/prisma";
import authOptions from "@/lib/auth/authOptions";
import { isUserOnline } from "@/lib/redis";
import { authenticateUser } from "@/lib/utils";
import { prisma } from "@/prisma/client";
import { getServerSession } from "next-auth";

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
  const session = await getServerSession(authOptions);

  if (!session || !authenticateUser(session, UserType.Student)) {
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
