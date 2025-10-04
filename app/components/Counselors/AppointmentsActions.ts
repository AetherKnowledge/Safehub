"use server";
import { AppointmentStatus } from "@/app/generated/prisma";
import { auth } from "@/auth";
import { prisma } from "@/prisma/client";

export async function getCounselorAppointments() {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  // Get the counselor record for the current user
  const counselor = await prisma.counselor.findUnique({
    where: { counselorId: session.user.id },
  });

  if (!counselor) {
    throw new Error("Counselor not found");
  }

  const today = new Date();
  const nextWeek = new Date(today);
  nextWeek.setDate(today.getDate() + 7);

  // Fetch all appointments for this counselor
  const appointments = await prisma.appointment.findMany({
    where: {
      counselorId: counselor.counselorId,
    },
    include: {
      student: {
        include: {
          user: {
            select: {
              name: true,
              email: true,
            },
          },
        },
      },
    },
    orderBy: {
      startTime: "asc",
    },
  });

  return appointments;
}

export async function updateAppointmentStatus(
  appointmentId: string,
  status: AppointmentStatus
) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  // Verify the appointment belongs to this counselor
  const appointment = await prisma.appointment.findFirst({
    where: {
      id: appointmentId,
      counselor: {
        counselorId: session.user.id,
      },
    },
  });

  if (!appointment) {
    throw new Error("Appointment not found or unauthorized");
  }

  // Update the appointment status
  const updatedAppointment = await prisma.appointment.update({
    where: { id: appointmentId },
    data: { status },
    include: {
      student: {
        include: {
          user: {
            select: {
              name: true,
              email: true,
            },
          },
        },
      },
    },
  });

  return updatedAppointment;
}

export async function getAppointmentsForDateRange(
  startDate: Date,
  endDate: Date
) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const counselor = await prisma.counselor.findUnique({
    where: { counselorId: session.user.id },
  });

  if (!counselor) {
    throw new Error("Counselor not found");
  }

  const appointments = await prisma.appointment.findMany({
    where: {
      counselorId: counselor.counselorId,
      startTime: {
        gte: startDate,
        lte: endDate,
      },
    },
    include: {
      student: {
        include: {
          user: {
            select: {
              name: true,
              email: true,
            },
          },
        },
      },
    },
    orderBy: {
      startTime: "asc",
    },
  });

  return appointments;
}
