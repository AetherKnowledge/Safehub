"use server";
import { UserType } from "@/app/generated/prisma";
import authOptions from "@/lib/auth/authOptions";
import { NewAppointmentData, newAppointmentSchema } from "@/lib/schemas";
import { authenticateUser } from "@/lib/utils";
import { prisma } from "@/prisma/client";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { AppointmentData } from "./AppointmentTable/AppointmentTable";

export async function getAppointments(): Promise<AppointmentData[]> {
  const session = await getServerSession(authOptions);

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
  const session = await getServerSession(authOptions);

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

  const appointment = await prisma.appointment.create({
    data: {
      counselorId: appointmentData.counselorId,
      studentId: session.user.id,
      schedule: appointmentData.schedule,
      concerns: appointmentData.concerns.join(","),
    },
  });

  if (!appointment) {
    throw new Error("Failed to create appointment");
  }
}

export async function cancelAppointment(appointmentId: string) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!appointmentId || typeof appointmentId !== "string") {
    throw new Error("Appointment ID is required");
  }

  const id = parseInt(appointmentId, 10);
  if (isNaN(id)) {
    throw new Error("Invalid Appointment ID");
  }

  const appointment = await prisma.appointment.findUnique({
    where: {
      id,
      studentId: session.user.id, // Ensure the student owns the appointment
    },
  });

  if (!appointment) {
    throw new Error("Appointment doesn't exist");
  }

  await prisma.appointment.delete({
    where: { id },
  });
  console.log("Deleted appointment with ID:", id);
}
