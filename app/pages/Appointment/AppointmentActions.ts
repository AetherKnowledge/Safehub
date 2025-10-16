"use server";
import {
  Appointment,
  AppointmentStatus,
  Feedback,
  User,
  UserType,
} from "@/app/generated/prisma";
import { auth } from "@/auth";
import {
  NewAppointmentData,
  newAppointmentSchema,
  UpdateAppointmentData,
  updateAppointmentSchema,
} from "@/lib/schemas";
import { addMinutes } from "@/lib/utils";
import { prisma } from "@/prisma/client";

export type AppointmentData = Appointment & {
  student: {
    user: Pick<
      User,
      "id" | "name" | "email" | "section" | "program" | "year" | "image"
    >;
  };
  counselor: {
    user: Pick<User, "id" | "name" | "email" | "image">;
  };
  feedback: Feedback | null;
};

export async function getAppointments(): Promise<AppointmentData[]> {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const appointments: AppointmentData[] = await prisma.appointment.findMany({
    where:
      session.user.type === UserType.Student
        ? { studentId: session.user.id }
        : { counselorId: session.user.id },
    orderBy: {
      createdAt: "asc",
    },
    include: {
      student: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              section: true,
              program: true,
              year: true,
              image: true,
            },
          },
        },
      },
      counselor: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
            },
          },
        },
      },
      feedback: true,
    },
  });

  return appointments;
}

export async function getAppointmentById(
  appointmentId: string
): Promise<AppointmentData | null> {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const appointment: AppointmentData | null = await prisma.appointment
    .findFirst({
      where:
        session.user.type === UserType.Student
          ? { studentId: session.user.id, id: appointmentId }
          : { counselorId: session.user.id, id: appointmentId },
      include: {
        student: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                section: true,
                program: true,
                year: true,
                image: true,
              },
            },
          },
        },
        counselor: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                image: true,
              },
            },
          },
        },
        feedback: true,
      },
    })
    .catch(() => {
      return null;
    });

  return appointment;
}

export async function createNewAppointment(
  appointmentData: NewAppointmentData
) {
  const session = await auth();

  if (
    !session ||
    !(session.user.type === UserType.Student) ||
    !session.user?.id
  ) {
    throw new Error("Unauthorized");
  }

  const validation = newAppointmentSchema.safeParse(appointmentData);
  if (!validation.success) {
    throw new Error("Invalid appointment data");
  }

  const counselor = await getCounselorBasedOnSchedule(
    appointmentData.startTime
  );

  if (!counselor) {
    throw new Error("No counselor available at the selected time");
  }

  if (validation.data.startTime < new Date()) {
    throw new Error("Cannot book appointment in the past");
  }

  const appointment = await prisma.appointment.create({
    data: {
      counselorId: counselor.counselorId,
      studentId: session.user.id,
      focus: appointmentData.focus,
      hadCounselingBefore: appointmentData.hadCounselingBefore,
      sessionPreference: appointmentData.sessionPreference,
      urgencyLevel: appointmentData.urgencyLevel,
      startTime: appointmentData.startTime,
      endTime: addMinutes(appointmentData.startTime, 60), // Default to 60 minutes if endTime not provided
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

export async function updateAppointment(
  appointmentId: string,
  appointmentData: UpdateAppointmentData
): Promise<AppointmentData> {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  // Verify the appointment belongs to this user
  const appointment = await prisma.appointment.findFirst({
    where:
      session.user.type === UserType.Student
        ? { studentId: session.user.id, id: appointmentId }
        : { counselorId: session.user.id, id: appointmentId },
  });

  if (!appointment) {
    throw new Error("Appointment not found");
  }

  const validation = updateAppointmentSchema.safeParse(appointmentData);

  if (!validation.success) {
    throw new Error("Invalid appointment data");
  }

  if (validation.data.endTime && session.user.type === UserType.Student) {
    throw new Error("Students cannot update end time");
  }

  if (validation.data.startTime && validation.data.startTime < new Date()) {
    throw new Error("Cannot book appointment in the past");
  }

  if (
    validation.data.endTime &&
    validation.data.startTime &&
    validation.data.endTime <= validation.data.startTime
  ) {
    throw new Error("End time must be greater than start time");
  }

  // If a student changes the start time, set status to Pending and adjust end time
  // to be 60 minutes after the new start time
  let status: AppointmentStatus | undefined = undefined;
  if (
    session.user.type === UserType.Student &&
    validation.data.startTime &&
    validation.data.startTime !== appointment.startTime
  ) {
    status = AppointmentStatus.Pending;
    validation.data.endTime = addMinutes(validation.data.startTime, 60);
  }

  // Update the appointment status
  const updatedAppointment = await prisma.appointment.update({
    where: { id: appointmentId },
    data: validation.data as UpdateAppointmentData,
    include: {
      student: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              section: true,
              program: true,
              year: true,
              image: true,
            },
          },
        },
      },
      counselor: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
            },
          },
        },
      },
      feedback: true,
    },
  });

  return updatedAppointment;
}

export async function checkForConflictingDate(
  startTime: Date,
  endTime: Date,
  appointmentId: string
) {
  const session = await auth();
  if (!session?.user?.id || session.user.type !== UserType.Counselor) {
    throw new Error("Unauthorized");
  }

  const conflictingAppointments = await prisma.appointment.findMany({
    where: {
      id: {
        not: appointmentId,
      },
      startTime: {
        lte: endTime,
      },
      endTime: {
        gte: startTime,
      },
    },
  });

  if (conflictingAppointments.length > 0) {
    return conflictingAppointments;
  }
  return null;
}

export async function updateAppointmentStatus(
  appointmentId: string,
  status: AppointmentStatus
): Promise<void> {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  if (
    session.user.type === UserType.Student &&
    status !== AppointmentStatus.Rejected
  ) {
    throw new Error("Students can only cancel appointments");
  }

  // Verify the appointment belongs to this user
  const appointment = await prisma.appointment.findFirst({
    where:
      session.user.type === UserType.Student
        ? { studentId: session.user.id, id: appointmentId }
        : { counselorId: session.user.id, id: appointmentId },
  });

  if (!appointment) {
    throw new Error("Appointment not found");
  }

  if (appointment.status === AppointmentStatus.Rejected) {
    throw new Error("Cannot update rejected appointment");
  }

  // Update the appointment status
  await prisma.appointment.update({
    where: { id: appointmentId },
    data: { status },
  });
}

export async function getAppointmentsForDateRange(
  startDate: Date,
  endDate: Date
): Promise<AppointmentData[]> {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const appointments: AppointmentData[] = await prisma.appointment.findMany({
    where:
      session.user.type === UserType.Student
        ? {
            studentId: session.user.id,
            startTime: {
              gte: startDate,
              lte: endDate,
            },
          }
        : {
            counselorId: session.user.id,
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
              id: true,
              name: true,
              email: true,
              section: true,
              program: true,
              year: true,
              image: true,
            },
          },
        },
      },
      counselor: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
            },
          },
        },
      },
      feedback: true,
    },
    orderBy: {
      startTime: "asc",
    },
  });

  return appointments;
}

export async function getAppointmentsForDate(
  date: Date
): Promise<AppointmentData[]> {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const startDate = new Date(date);
  startDate.setHours(0, 0, 0, 0);
  const endDate = new Date(date);
  endDate.setHours(23, 59, 59, 999);

  const appointments: AppointmentData[] = await prisma.appointment.findMany({
    where:
      session.user.type === UserType.Student
        ? {
            studentId: session.user.id,
            startTime: {
              gte: startDate,
              lte: endDate,
            },
          }
        : {
            counselorId: session.user.id,
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
              id: true,
              name: true,
              email: true,
              section: true,
              program: true,
              year: true,
              image: true,
            },
          },
        },
      },
      counselor: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
            },
          },
        },
      },
      feedback: true,
    },
    orderBy: {
      startTime: "asc",
    },
  });

  return appointments;
}

export async function getTodayAppointmentsCount(date: Date): Promise<number> {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const startDate = new Date(date);
  startDate.setHours(0, 0, 0, 0);
  const endDate = new Date(date);
  endDate.setHours(23, 59, 59, 999);

  console.log(startDate.toLocaleString());
  console.log(endDate.toLocaleString());

  const appointments = await prisma.appointment.count({
    where: {
      counselorId: session.user.id,
      startTime: {
        gte: startDate,
        lte: endDate,
      },
    },
  });

  return appointments;
}
