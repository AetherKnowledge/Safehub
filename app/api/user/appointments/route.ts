import { NextResponse } from "next/server";
import { prisma } from "@/prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { Appointment, chathistory } from "@/app/generated/prisma";
import { z } from "zod";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const appointments: Appointment[] = await prisma.appointment.findMany({
    where:
      session.user.type === "student"
        ? { studentId: session.user.id }
        : { counselorId: session.user.id },
    orderBy: {
      createdAt: "asc",
    },
    include: {
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

  return NextResponse.json(appointments, { status: 200 });
}

const newAppointmentSchema = z.object({
  counselorId: z.string(),
  schedule: z.string(),
  concerns: z.array(z.string()),
});

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const validation = newAppointmentSchema.safeParse(body);

  if (!validation.success) {
    console.log(validation);
    return NextResponse.json(
      { error: "Invalid appointment data" },
      { status: 400 }
    );
  }

  const { counselorId, schedule, concerns } = validation.data;
  console.log("Creating appointment with data:", {
    counselorId,
    schedule,
    concerns,
  });

  if (
    !counselorId ||
    !session.user.id ||
    !schedule ||
    !concerns ||
    concerns.length === 0
  ) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }

  const appointment = await prisma.appointment.create({
    data: {
      counselorId,
      studentId: session.user.id,
      schedule,
      concerns: concerns.join(","),
    },
  });

  if (!appointment) {
    return NextResponse.json(
      { error: "Failed to create appointment" },
      { status: 500 }
    );
  }

  return NextResponse.json(
    { message: "Appointment created successfully" },
    { status: 201 }
  );
}

const deleteAppointmentSchema = z.object({
  appointmentId: z.number(),
});

export async function DELETE(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();

  const validation = deleteAppointmentSchema.safeParse(body);
  if (!validation.success || !validation.data.appointmentId) {
    return NextResponse.json(
      { error: "Invalid appointment data" },
      { status: 400 }
    );
  }

  const { appointmentId } = validation.data;
  const appointment = await prisma.appointment.findUnique({
    where: {
      id: appointmentId,
      studentId: session.user.id, // Ensure the student owns the appointment
    },
  });

  if (!appointment) {
    return NextResponse.json(
      { error: "Appointment doesn't exist" },
      { status: 500 }
    );
  }

  await prisma.appointment.delete({ where: { id: appointmentId } });
  console.log("Deleted appointment with ID:", appointmentId);

  return NextResponse.json({ message: "Deleted Appointment" }, { status: 200 });
}
