"use server";

import { Feedback, UserType } from "@/app/generated/prisma";
import { auth } from "@/auth";
import { NewFeedbackData } from "@/lib/schemas";
import { prisma } from "@/prisma/client";

export async function getFeedback(
  appointmentId: string
): Promise<Feedback | null> {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const feedback = await prisma.feedback.findUnique({
    where: {
      appointmentId,
      appointment:
        session.user.type === UserType.Student
          ? { studentId: session.user.id }
          : { counselorId: session.user.id },
    },
  });

  return feedback;
}

export async function upsertFeedback(
  appointmentId: string,
  feedbackData: NewFeedbackData
): Promise<void> {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  if (session.user.type !== UserType.Student) {
    throw new Error("Only students can give feedback");
  }

  const appointment = await prisma.appointment.findUnique({
    where: { studentId: session.user.id, id: appointmentId },
  });

  if (!appointment) {
    throw new Error("Appointment not found");
  }

  if (appointment.status !== "Completed") {
    throw new Error("Cannot give feedback for incomplete appointment");
  }

  const feedback = await prisma.feedback.upsert({
    where: {
      appointmentId,
      appointment: { studentId: session.user.id, id: appointmentId },
    },
    update: {
      ...feedbackData,
    },
    create: {
      ...feedbackData,
    },
  });

  if (!feedback) {
    throw new Error("Failed to create or update feedback");
  }
}
