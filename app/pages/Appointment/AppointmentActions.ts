"use server";
import ActionResult from "@/app/components/ActionResult";
import {
  Appointment,
  AppointmentStatus,
  Feedback,
  FormType,
  User,
  UserType,
} from "@/app/generated/prisma";
import { auth } from "@/auth";
import { addMinutes, prettifyZodErrorMessage } from "@/lib/utils";
import { prisma } from "@/prisma/client";
import { buildZodSchema } from "../Forms/schema";
import { AppointmentFormData } from "./schema";

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
  formData: FormData
): Promise<ActionResult<void>> {
  const data = Object.fromEntries(formData.entries());
  console.log("Form Data Submitted:", data);

  try {
    const session = await auth();

    if (
      !session ||
      !(session.user.type === UserType.Student) ||
      !session.user?.id
    ) {
      throw new Error("Unauthorized");
    }

    const counselor = await getCounselorBasedOnSchedule();

    const questions = await prisma.formSchema.findUnique({
      where: { type: FormType.BOOKING },
    });

    if (!questions) {
      throw new Error("Booking form not found");
    }

    const questionsData = JSON.parse(
      JSON.stringify(questions.schema)
    ) as AppointmentFormData["questions"];

    const validation = buildZodSchema(questionsData).safeParse(data);

    if (!validation.success) {
      throw new Error(
        "Invalid appointment data: " + prettifyZodErrorMessage(validation.error)
      );
    }

    if (
      !validation.data.startTime ||
      !(validation.data.startTime instanceof Date) ||
      isNaN(validation.data.startTime.getTime())
    ) {
      throw new Error("Start time is required and must be a valid date");
    }

    const startOfDay = new Date(validation.data.startTime);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(validation.data.startTime);
    endOfDay.setHours(23, 59, 59, 999);

    const hasAppointmentToday = await prisma.appointment.findFirst({
      where: {
        studentId: session.user.id,
        status: AppointmentStatus.Pending || AppointmentStatus.Approved,
        startTime: {
          gte: startOfDay,
          lt: endOfDay,
        },
      },
    });
    if (hasAppointmentToday) {
      throw new Error("You can only book one appointment per day");
    }

    if (!counselor) {
      throw new Error("No counselor available at the selected time");
    }

    if (validation.data.startTime < new Date()) {
      throw new Error("Cannot book appointment in the past");
    }

    const bookingForms = await prisma.formSchema.findUnique({
      where: { type: FormType.BOOKING },
    });

    if (!bookingForms) {
      throw new Error("Booking form not found");
    }

    const appointment = await prisma.appointment.create({
      data: {
        counselorId: counselor.counselorId,
        studentId: session.user.id,
        startTime: validation.data.startTime,
        endTime: addMinutes(validation.data.startTime, 60), // Default to 60 minutes if endTime not provided
        appointmentData: {
          questions: bookingForms.schema,
          answers: JSON.parse(JSON.stringify(validation.data)),
        },
      },
    });

    if (!appointment) {
      throw new Error("Failed to create appointment");
    }
  } catch (error) {
    return { success: false, message: (error as Error).message };
  }

  return { success: true };
}

async function getCounselorBasedOnSchedule() {
  // TODO: Implement logic to find an available counselor based on the schedule
  // Find a counselor who is available at the given schedule
  // for now just get the first counselor
  const counselor = await prisma.counselor.findFirst({});

  return counselor;
}

export async function updateAppointment(
  appointmentId: string,
  formData: FormData
): Promise<ActionResult<AppointmentData>> {
  const data = Object.fromEntries(formData.entries());
  try {
    const session = await auth();
    if (!session?.user?.id || session.user.type !== UserType.Student) {
      throw new Error("Unauthorized");
    }

    // Verify the appointment belongs to this user
    const appointment = await prisma.appointment.findFirst({
      where: { studentId: session.user.id, id: appointmentId },
    });

    if (!appointment) {
      throw new Error("Appointment not found");
    }

    const oldAppointmentFormData = JSON.parse(
      JSON.stringify(appointment.appointmentData)
    ) as AppointmentFormData;

    const questions = JSON.parse(
      JSON.stringify(oldAppointmentFormData.questions)
    ) as AppointmentFormData["questions"];

    if (!questions) {
      throw new Error("Appointment questions not found");
    }

    const validation = buildZodSchema(questions).safeParse(data);

    if (!validation.success) {
      throw new Error(
        "Invalid appointment data: " + prettifyZodErrorMessage(validation.error)
      );
    }

    if (
      !validation.data.startTime ||
      !(validation.data.startTime instanceof Date) ||
      isNaN(validation.data.startTime.getTime())
    ) {
      throw new Error("Start time is required and must be a valid date");
    }

    if (!validation.data.startTime || validation.data.startTime === null) {
      throw new Error("Start time is required");
    }

    if (validation.data.endTime) {
      throw new Error("Students cannot update end time");
    }

    if (validation.data.startTime && validation.data.startTime < new Date()) {
      throw new Error("Cannot book appointment in the past");
    }

    // If a student changes the start time, set status to Pending and adjust end time
    // to be 60 minutes after the new start time
    let status: AppointmentStatus | undefined = undefined;
    const startTime: Date = validation.data.startTime || appointment.startTime;
    let endTime: Date | undefined = undefined;

    if (
      validation.data.startTime &&
      validation.data.startTime !== appointment.startTime
    ) {
      status = AppointmentStatus.Pending;
      endTime = addMinutes(startTime, 60);
    }

    const updatedAppointmentFormData: AppointmentFormData = {
      questions: oldAppointmentFormData.questions,
      answers: {
        ...oldAppointmentFormData.answers,
        ...validation.data,
        startTime: startTime,
      },
    };

    // Update the appointment status
    await prisma.appointment.update({
      where: { id: appointmentId },
      data: {
        startTime,
        endTime,
        status,
        appointmentData: JSON.parse(JSON.stringify(updatedAppointmentFormData)),
      },
    });

    return { success: true };
  } catch (error) {
    return { success: false, message: (error as Error).message };
  }
}

export async function rescheduleAppointment(
  appointmentId: string,
  startTime: Date,
  endTime: Date
): Promise<ActionResult<void>> {
  try {
    const session = await auth();
    if (!session?.user?.id || session.user.type !== UserType.Counselor) {
      throw new Error("Unauthorized");
    }

    const appointment = await prisma.appointment.findFirst({
      where: { counselorId: session.user.id, id: appointmentId },
    });

    if (!appointment) {
      throw new Error("Appointment not found");
    }

    if (startTime < new Date()) {
      throw new Error("Cannot reschedule to a past time");
    }

    if (endTime <= startTime) {
      throw new Error("End time must be after start time");
    }

    await prisma.appointment.update({
      where: { id: appointmentId },
      data: { startTime, endTime },
    });
    return { success: true };
  } catch (error) {
    return { success: false, message: (error as Error).message };
  }
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
