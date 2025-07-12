import { Appointment, UserType } from "@/app/generated/prisma";
import authOptions from "@/lib/auth/authOptions";
import { deleteAppointmentSchema, newAppointmentSchema } from "@/lib/schemas";
import { prisma } from "@/prisma/client";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const appointments: Appointment[] = await prisma.appointment.findMany({
    where:
      session.user.type === UserType.Student
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
