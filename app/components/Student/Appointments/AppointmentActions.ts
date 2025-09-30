"use server";
import { UserType } from "@/app/generated/prisma";
import { auth } from "@/auth";
import { NewAppointmentData, newAppointmentSchema } from "@/lib/schemas";
import { authenticateUser } from "@/lib/utils";
import { prisma } from "@/prisma/client";
import { NextResponse } from "next/server";
import { AppointmentData } from "./AppointmentTable/AppointmentsTable";

export async function getAppointments(): Promise<AppointmentData[]> {
  const session = await auth();

  if (!session || !authenticateUser(session, UserType.Student)) {
    throw new Error("Unauthorized");
  }

  const appointments = await prisma.appointment.findMany({
    where:
      session.user.type === UserType.Student
        ? { studentId: session.user.id }
        : { counselorId: session.user.id },
    orderBy: {
      createdAt: "asc",
    },
    select: {
      id: true,
      schedule: true,
      status: true,
      student: {
        select: {
          studentId: true,
          user: {
            select: {
              name: true,
              email: true,
              image: true,
            },
          },
        },
      },
      counselor: {
        select: {
          counselorId: true,
          user: {
            select: {
              name: true,
              email: true,
              image: true,
            },
          },
        },
      },
    },
  });

  return appointments.map(
    (appointment) =>
      ({
        id: appointment.id.toString(),
        schedule: appointment.schedule,
        status: appointment.status,
        student: {
          studentId: appointment.student.studentId,
          user: {
            name: appointment.student.user.name,
            image: appointment.student.user.image,
          },
        },
        counselor: {
          counselorId: appointment.counselor.counselorId,
          user: {
            name: appointment.counselor.user.name,
            image: appointment.counselor.user.image,
          },
        },
      }) as AppointmentData
  );
}

export async function createNewAppointment(
  appointmentData: NewAppointmentData
) {
  const session = await auth();

  if (
    !session ||
    !authenticateUser(session, UserType.Student) ||
    !session.user?.id
  ) {
    throw new Error("Unauthorized");
  }

  const validation = newAppointmentSchema.safeParse(appointmentData);
  if (!validation.success) {
    throw new Error("Invalid appointment data");
  }

  const counselor = await getCounselorBasedOnSchedule(appointmentData.schedule);

  if (!counselor) {
    throw new Error("No counselor available at the selected time");
  }

  const appointment = await prisma.appointment.create({
    data: {
      counselorId: counselor.counselorId,
      studentId: session.user.id,

      focus: appointmentData.focus,
      hadCounselingBefore: appointmentData.hadCounselingBefore,
      sessionPreference: appointmentData.sessionPreference,
      urgencyLevel: appointmentData.urgencyLevel,
      schedule: appointmentData.schedule,
      notes: appointmentData.notes,
    },
  });

  if (!appointment) {
    throw new Error("Failed to create appointment");
  }
}

async function getCounselorBasedOnSchedule(schedule: Date) {
  // TODO: Implement logic to find an available counselor based on the schedule
  // Find a counselor who is available at the given schedule
  // for now just get the first counselor
  const counselor = await prisma.counselor.findFirst({});

  return counselor;
}

export async function cancelAppointment(appointmentId: string) {
  const session = await auth();

  if (!session || !session.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!appointmentId || typeof appointmentId !== "string") {
    throw new Error("Appointment ID is required");
  }

  const appointment = await prisma.appointment.findUnique({
    where: {
      id: appointmentId,
      studentId: session.user.id, // Ensure the student owns the appointment
    },
  });

  if (!appointment) {
    throw new Error("Appointment doesn't exist");
  }

  await prisma.appointment.delete({
    where: { id: appointmentId },
  });
  console.log("Deleted appointment with ID:", appointmentId);
}
