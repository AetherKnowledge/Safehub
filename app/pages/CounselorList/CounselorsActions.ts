"use server";

import {
  AvailableSlot,
  Counselor,
  User,
  UserStatus,
  UserType,
} from "@/app/generated/prisma";
import { auth } from "@/auth";
import { isUserOnline } from "@/lib/redis";

import { prisma } from "@/prisma/client";

export type CounselorData = Pick<
  User,
  "id" | "name" | "email" | "image" | "status"
> & {
  Counselor: Counselor & {
    availableSlots: AvailableSlot[];
  };
  rating: number;
};

export async function getCounselors() {
  const session = await auth();

  if (!session) {
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
      image: true,
      email: true,
      status: true,
      Counselor: {
        include: {
          availableSlots: true,
          feedbacks: { select: { rating: true } },
        },
      },
    },
  });

  const counselorsWithStatus = await Promise.all(
    counselors.map(async (counselor) =>
      (await isUserOnline(counselor.id))
        ? {
            ...counselor,
            status: UserStatus.Online,
            rating: calculateStarRating(counselor.Counselor!.feedbacks),
          }
        : {
            ...counselor,
            status: UserStatus.Offline,
            rating: calculateStarRating(counselor.Counselor!.feedbacks),
          }
    )
  );

  return counselorsWithStatus as CounselorData[];
}

function calculateStarRating(feedbacks: { rating: number }[]) {
  if (feedbacks.length === 0) return 0;
  const total = feedbacks.reduce((acc, feedback) => acc + feedback.rating, 0);
  return Math.round((total / feedbacks.length) * 100) / 100; // Round to 2 decimal place
}
