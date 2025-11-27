"use server";
import ActionResult from "@/app/components/ActionResult";
import { BuiltFormData } from "@/app/components/Forms/EditableFormBuilder";
import { createAppointmentNotification } from "@/app/components/Notifications/NotificationActions";
import {
  AppointmentCreateNotification,
  AppointmentDidNotAttendNotification,
  AppointmentUpdateScheduleNotification,
  AppointmentUpdateStatusNotification,
} from "@/app/components/Notifications/schema";
import {
  Appointment,
  AppointmentStatus,
  FormType,
  NotificationType,
  SessionPreference,
  User,
  UserType,
} from "@/app/generated/prisma";
import { auth } from "@/auth";
import { addMinutes, prettifyZodErrorMessage } from "@/lib/utils";
import { prisma } from "@/prisma/client";
import { buildZodSchema } from "../Forms/schema";
import {
  actionsTakenSchema,
  AppointmentFormData,
  cancelAppointmentSchema,
  didNotAttendReasonSchema,
  FollowUpAppointmentData,
  followUpAppointmentSchema,
  NotesData,
  notesSchema,
  UpdateAppointmentStatusData,
  updateAppointmentStatusSchema,
} from "./schema";

export type AppointmentData = Appointment & {
  chatId: string;
  student: {
    user: StudentDetailsData;
  };
  counselor: {
    user: Pick<User, "id" | "name" | "email" | "image">;
  };
  parentId?: string;
  followUpId?: string | null;
};

export interface StudentDetailsData {
  id: string;
  name: string | null;
  email: string;
  image: string | null;

  firstName: string | null;
  middleName: string | null;
  lastName: string | null;
  suffix: string | null;

  birthDate: Date | null;
  gender: string | null;

  department: string | null;
  program: string | null;
  year: number | null;
  section: string | null;

  phoneNumber: string | null;

  guardianName: string | null;
  guardianFirstName: string | null;
  guardianMiddleName: string | null;
  guardianLastName: string | null;
  guardianSuffix: string | null;

  guardianContact: string | null;
  guardianEmail: string | null;
  relationToGuardian: string | null;
}

const appointmentInclude = (userType: UserType) => {
  return {
    include: {
      parent: {
        select: { id: true },
      },
      followUp: { select: { id: true } },
      student: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,

              firstName: true,
              middleName: true,
              lastName: true,
              suffix: true,

              birthDate: true,
              gender: true,

              department: true,
              program: true,
              year: true,
              section: true,

              phoneNumber: true,

              guardianName: true,
              guardianFirstName: true,
              guardianMiddleName: true,
              guardianLastName: true,
              guardianSuffix: true,

              guardianContact: true,
              guardianEmail: true,
              relationToGuardian: true,
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
    },
    omit: {
      notes: userType === UserType.Student,
    },
  };
};

export async function getAppointments(): Promise<AppointmentData[]> {
  const session = await auth();
  if (!session?.user?.id || !session.user.type || session.user.deactivated) {
    throw new Error("Unauthorized");
  }

  const appointments = await prisma.appointment.findMany({
    where:
      session.user.type === UserType.Student
        ? { studentId: session.user.id }
        : { counselorId: session.user.id },
    orderBy: {
      startTime: "desc" as const,
    },
    ...appointmentInclude(session.user.type),
  });

  const chats = await prisma.chat.findMany({
    where: {
      members: {
        some: {
          userId: session.user.id,
        },
      },
    },
    select: {
      id: true,
      members: {
        select: {
          userId: true,
        },
      },
    },
  });

  return appointments.map((appointment) => {
    const chat = chats.find((chat) =>
      chat.members.some((member) => member.userId === appointment.studentId)
    );
    return {
      ...appointment,
      chatId: chat ? chat.id : "",
      parentId: appointment.parent ? appointment.parent.id : undefined,
      followUpId: appointment.followUp?.id || null,
    };
  });
}

export async function getAppointmentHistory(
  appointmentId: string
): Promise<ActionResult<AppointmentData[]>> {
  try {
    const session = await auth();
    if (!session?.user?.id || !session.user.type || session.user.deactivated) {
      return { success: false, message: "Unauthorized" };
    }

    const appointment = await prisma.appointment.findUnique({
      where: {
        id: appointmentId,
        OR: [{ studentId: session.user.id }, { counselorId: session.user.id }],
      },
    });

    if (!appointment) {
      return { success: false, message: "Appointment not found" };
    }

    // Find the root appointment (the one without a parent)
    let rootAppointment = appointment;
    let currentId = appointment.followUpId;

    while (currentId) {
      const parent = await prisma.appointment.findUnique({
        where: { id: currentId },
        select: { id: true, followUpId: true },
      });

      if (!parent) break;
      rootAppointment = {
        ...appointment,
        id: parent.id,
        followUpId: parent.followUpId,
      };
      currentId = parent.followUpId;
    }

    // Now traverse from root to get all appointments in the chain
    const appointmentChain: string[] = [];
    const queue: string[] = [rootAppointment.id];

    while (queue.length > 0) {
      const currentAppointmentId = queue.shift()!;
      appointmentChain.push(currentAppointmentId);

      // Find all follow-ups of the current appointment
      const followUps = await prisma.appointment.findMany({
        where: { followUpId: currentAppointmentId },
        select: { id: true },
      });

      queue.push(...followUps.map((f) => f.id));
    }

    // Fetch full appointment data for all appointments in the chain
    const appointments = await prisma.appointment.findMany({
      where: {
        id: { in: appointmentChain },
        OR: [{ studentId: session.user.id }, { counselorId: session.user.id }],
      },
      orderBy: {
        startTime: "asc",
      },
      ...appointmentInclude(session.user.type),
    });

    const chats = await prisma.chat.findMany({
      where: {
        members: {
          some: {
            userId: session.user.id,
          },
        },
      },
      select: {
        id: true,
        members: {
          select: {
            userId: true,
          },
        },
      },
    });

    const appointmentsWithChat = appointments.map((appointment) => {
      const chat = chats.find((chat) =>
        chat.members.some((member) => member.userId === appointment.studentId)
      );
      return {
        ...appointment,
        chatId: chat ? chat.id : "",
        parentId: appointment.parent ? appointment.parent.id : undefined,
        followUpId: appointment.followUp?.id || null,
      };
    });

    return { success: true, data: appointmentsWithChat };
  } catch (error) {
    console.error((error as Error).message);
    return { success: false, message: (error as Error).message };
  }
}

export async function getAppointmentById(
  appointmentId: string
): Promise<AppointmentData | null> {
  const session = await auth();
  if (!session?.user?.id || !session.user.type || session.user.deactivated) {
    throw new Error("Unauthorized");
  }

  const appointment = await prisma.appointment
    .findFirst({
      where:
        session.user.type === UserType.Student
          ? { studentId: session.user.id, id: appointmentId }
          : { counselorId: session.user.id, id: appointmentId },
      ...appointmentInclude(session.user.type),
    })
    .catch(() => {
      return null;
    });

  const chat = appointment
    ? await prisma.chat
        .findFirst({
          where: {
            members: {
              some: {
                userId: session.user.id,
              },
            },
          },
        })
        .catch(() => {
          return null;
        })
    : null;

  return appointment
    ? {
        ...appointment,
        chatId: chat ? chat.id : "",
        parentId: appointment.parent ? appointment.parent.id : undefined,
        followUpId: appointment.followUp?.id || null,
      }
    : null;
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
      !session.user?.id ||
      session.user.deactivated
    ) {
      throw new Error("Unauthorized");
    }

    const questions = await prisma.formSchema.findUnique({
      where: { type: FormType.BOOKING },
    });

    if (!questions) {
      throw new Error("Booking form not found");
    }

    const questionsData = JSON.parse(
      JSON.stringify(questions.schema)
    ) as BuiltFormData;

    const validation = buildZodSchema(questionsData).safeParse(data);

    if (!validation.success) {
      throw new Error(
        "Invalid appointment data: " + prettifyZodErrorMessage(validation.error)
      );
    }

    if (
      !validation.data.counselorId ||
      !(typeof validation.data.counselorId === "string")
    ) {
      throw new Error("Counselor ID is required and must be a valid string");
    }

    const counselor = await prisma.user.findUnique({
      where: { id: validation.data.counselorId },
    });

    if (!counselor) {
      throw new Error("Counselor not found");
    }

    if (
      !validation.data.startTime ||
      !(validation.data.startTime instanceof Date) ||
      isNaN(validation.data.startTime.getTime())
    ) {
      throw new Error("Start time is required and must be a valid date");
    }

    if (
      !validation.data.sessionPreference ||
      !Object.values(SessionPreference).includes(
        validation.data.sessionPreference as SessionPreference
      )
    ) {
      throw new Error("Invalid Session Preference");
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
        sessionPreference: validation.data
          .sessionPreference as SessionPreference,
        counselorId: counselor.id,
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

    const result = await createAppointmentNotification(
      appointment,
      NotificationType.AppointmentCreated,
      { appointmentId: appointment.id } as AppointmentCreateNotification
    );
    if (!result.success) {
      console.error(
        "Failed to create appointment notification:",
        result.message
      );
    }
  } catch (error) {
    return { success: false, message: (error as Error).message };
  }

  return { success: true };
}

export async function updateAppointment(
  appointmentId: string,
  formData: FormData
): Promise<ActionResult<AppointmentData>> {
  const data = Object.fromEntries(formData.entries());
  try {
    const session = await auth();
    if (
      !session?.user?.id ||
      session.user.type !== UserType.Student ||
      session.user.deactivated
    ) {
      throw new Error("Unauthorized");
    }

    // Verify the appointment belongs to this user
    const appointment = await prisma.appointment.findFirst({
      where: { studentId: session.user.id, id: appointmentId },
      include: { parent: true },
    });

    if (!appointment) {
      throw new Error("Appointment not found");
    }

    const oldAppointmentFormData = JSON.parse(
      JSON.stringify(appointment.appointmentData)
    ) as AppointmentFormData;

    const questions = JSON.parse(
      JSON.stringify(oldAppointmentFormData.questions)
    ) as BuiltFormData;

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
      !validation.data.counselorId ||
      !(typeof validation.data.counselorId === "string")
    ) {
      throw new Error("Counselor ID is required and must be a valid string");
    }

    const counselor = await prisma.user.findUnique({
      where: { id: validation.data.counselorId },
    });

    if (!counselor) {
      throw new Error("Counselor not found");
    }

    if (appointment.parent) {
      throw new Error("Cannot update follow-up appointment");
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
    let status: AppointmentStatus = appointment.status;
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
    const updatedAppointment = await prisma.appointment.update({
      where: { id: appointmentId },
      data: {
        counselorId: counselor.id,
        startTime,
        endTime,
        status,
        appointmentData: JSON.parse(JSON.stringify(updatedAppointmentFormData)),
      },
    });

    if (!updatedAppointment) {
      throw new Error("Failed to create appointment");
    }

    if (appointment.startTime !== updatedAppointment.startTime) {
      const result = await createAppointmentNotification(
        updatedAppointment,
        NotificationType.AppointmentUpdatedSchedule,
        {
          appointmentId: updatedAppointment.id,
          from: appointment.startTime,
          to: updatedAppointment.startTime,
        } as AppointmentUpdateScheduleNotification
      );
      if (!result.success) {
        console.error(
          "Failed to create appointment notification:",
          result.message
        );
      }
    }

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
    if (
      !session?.user?.id ||
      session.user.type !== UserType.Counselor ||
      session.user.deactivated
    ) {
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

    const updatedAppointment = await prisma.appointment.update({
      where: { id: appointmentId },
      data: { startTime, endTime },
    });

    const result = await createAppointmentNotification(
      updatedAppointment,
      NotificationType.AppointmentUpdatedSchedule,
      {
        appointmentId: updatedAppointment.id,
        from: appointment.startTime,
        to: updatedAppointment.startTime,
      } as AppointmentUpdateScheduleNotification
    );
    if (!result.success) {
      console.error(
        "Failed to create appointment notification:",
        result.message
      );
    }

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
  if (
    !session?.user?.id ||
    session.user.type !== UserType.Counselor ||
    session.user.deactivated
  ) {
    throw new Error("Unauthorized");
  }

  const conflictingAppointments = await prisma.appointment.findMany({
    where: {
      id: {
        not: appointmentId,
      },
      status: {
        in: [AppointmentStatus.Pending, AppointmentStatus.Approved],
      },
      counselorId: session.user.id,
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
  data: UpdateAppointmentStatusData
): Promise<ActionResult<void>> {
  try {
    const session = await auth();
    if (
      !session?.user?.id ||
      session.user.type !== UserType.Counselor ||
      session.user.deactivated
    ) {
      throw new Error("Unauthorized");
    }

    const validation = updateAppointmentStatusSchema.safeParse(data);
    if (!validation.success) {
      throw new Error("Invalid data");
    }
    const { appointmentId, status } = validation.data;

    // Verify the appointment belongs to this counselor
    const appointment = await prisma.appointment.findFirst({
      where: { counselorId: session.user.id, id: appointmentId },
      include: { parent: true },
    });

    if (!appointment) {
      throw new Error("Appointment not found");
    }

    if (appointment.parent && status === AppointmentStatus.Approved) {
      throw new Error("Counselors cannot approve follow-up appointment");
    }

    if (appointment.status === AppointmentStatus.Cancelled) {
      throw new Error("Cannot update cancelled appointment");
    }

    if (appointment.status === AppointmentStatus.DidNotAttend) {
      throw new Error("Cannot update 'Did Not Attend' appointment");
    }

    if (appointment.status === AppointmentStatus.Completed) {
      throw new Error("Cannot update completed appointment");
    }

    if (status === AppointmentStatus.Cancelled) {
      throw new Error(
        "Only students can cancel appointments, counselors can only reject them."
      );
    }

    // Update the appointment status
    const updatedAppointment = await prisma.appointment.update({
      where: { id: appointmentId },
      data: { status },
    });

    await prisma.appointmentLog.create({
      data: {
        appointmentId: appointmentId,
        changedBy: session.user.id,
        from: appointment.status,
        to: status,
      },
    });

    const result = await createAppointmentNotification(
      updatedAppointment,
      NotificationType.AppointmentUpdatedStatus,
      {
        appointmentId: updatedAppointment.id,
        from: appointment.status,
        to: updatedAppointment.status,
      } as AppointmentUpdateStatusNotification
    );
    if (!result.success) {
      console.error(
        "Failed to create appointment notification:",
        result.message
      );
    }

    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false, message: (error as Error).message };
  }
}

export async function getAppointmentsForDateRange(
  startDate: Date,
  endDate: Date
): Promise<AppointmentData[]> {
  const session = await auth();
  if (!session?.user?.id || !session.user.type || session.user.deactivated) {
    throw new Error("Unauthorized");
  }

  const appointments = await prisma.appointment.findMany({
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

    ...appointmentInclude(session.user.type),
  });

  const chats = await prisma.chat.findMany({
    where: {
      members: {
        some: {
          userId: session.user.id,
        },
      },
    },
    select: {
      id: true,
      members: {
        select: {
          userId: true,
        },
      },
    },
  });

  return appointments.map((appointment) => {
    const chat = chats.find((chat) =>
      chat.members.some((member) => member.userId === appointment.studentId)
    );
    return {
      ...appointment,
      chatId: chat ? chat.id : "",
      parentId: appointment.parent ? appointment.parent.id : undefined,
      followUpId: appointment.followUp?.id || null,
    };
  });
}

export async function getAppointmentsForDate(
  date: Date
): Promise<AppointmentData[]> {
  const session = await auth();
  if (!session?.user?.id || !session.user.type || session.user.deactivated) {
    throw new Error("Unauthorized");
  }

  const startDate = new Date(date);
  startDate.setHours(0, 0, 0, 0);
  const endDate = new Date(date);
  endDate.setHours(23, 59, 59, 999);

  const appointments = await prisma.appointment.findMany({
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
    ...appointmentInclude(session.user.type),
  });

  const chats = await prisma.chat.findMany({
    where: {
      members: {
        some: {
          userId: session.user.id,
        },
      },
    },
    select: {
      id: true,
      members: {
        select: {
          userId: true,
        },
      },
    },
  });

  return appointments.map((appointment) => {
    const chat = chats.find((chat) =>
      chat.members.some((member) => member.userId === appointment.studentId)
    );
    return {
      ...appointment,
      chatId: chat ? chat.id : "",
      parentId: appointment.parent ? appointment.parent.id : undefined,
      followUpId: appointment.followUp?.id || null,
    };
  });
}

export async function getTodayAppointmentsCount(date: Date): Promise<number> {
  const session = await auth();
  if (!session?.user?.id || session.user.deactivated) {
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

export async function cancelAppointmentStudent(
  formData: FormData
): Promise<ActionResult<void>> {
  const data = Object.fromEntries(formData.entries());
  try {
    const session = await auth();
    if (
      !session?.user?.id ||
      session.user.type !== UserType.Student ||
      session.user.deactivated
    ) {
      throw new Error("Unauthorized");
    }
    console.log("Cancel Data:", data);
    const validation = cancelAppointmentSchema.safeParse(data);
    if (!validation.success) {
      throw new Error(
        "Invalid data: " + prettifyZodErrorMessage(validation.error)
      );
    }
    const { appointmentId, reason } = validation.data;

    // Verify the appointment belongs to this user
    const appointment = await prisma.appointment.findFirst({
      where: { studentId: session.user.id, id: appointmentId },
    });
    if (!appointment) {
      throw new Error("Appointment not found");
    }

    const updatedAppointment = await prisma.appointment.update({
      where: { id: appointmentId },
      data: {
        status: AppointmentStatus.Cancelled,
        cancellationReason: reason,
      },
    });

    await prisma.appointmentLog.create({
      data: {
        appointmentId: appointmentId,
        changedBy: session.user.id,
        from: appointment.status,
        to: AppointmentStatus.Cancelled,
      },
    });

    const result = await createAppointmentNotification(
      updatedAppointment,
      NotificationType.AppointmentUpdatedStatus,
      {
        appointmentId: updatedAppointment.id,
        from: appointment.status,
        to: updatedAppointment.status,
      } as AppointmentUpdateStatusNotification
    );
    if (!result.success) {
      console.error(
        "Failed to create appointment notification:",
        result.message
      );
    }

    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false, message: (error as Error).message };
  }
}

export async function createActionsTaken(
  formData: FormData
): Promise<ActionResult<void>> {
  const data = Object.fromEntries(formData.entries());
  try {
    const session = await auth();
    if (
      !session?.user?.id ||
      session.user.type !== UserType.Counselor ||
      session.user.deactivated
    ) {
      throw new Error("Unauthorized");
    }

    const validation = actionsTakenSchema.safeParse(data);
    if (!validation.success) {
      throw new Error(
        "Invalid data: " + prettifyZodErrorMessage(validation.error)
      );
    }
    const { appointmentId, actionsTaken } = validation.data;

    // Verify the appointment belongs to this counselor
    const appointment = await prisma.appointment.findFirst({
      where: { counselorId: session.user.id, id: String(appointmentId) },
    });
    if (!appointment) {
      throw new Error("Appointment not found");
    }

    if (appointment.actionsTaken) {
      throw new Error("Session actions have already been submitted");
    }

    await prisma.appointment.update({
      where: { id: String(appointmentId) },
      data: {
        actionsTaken: String(actionsTaken),
      },
    });

    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false, message: (error as Error).message };
  }
}

export async function createFollowUpAppointment(
  data: FollowUpAppointmentData
): Promise<ActionResult<void>> {
  try {
    const session = await auth();
    if (
      !session?.user?.id ||
      session.user.type !== UserType.Counselor ||
      session.user.deactivated
    ) {
      throw new Error("Unauthorized");
    }
    const validation = followUpAppointmentSchema.safeParse(data);
    if (!validation.success) {
      throw new Error(
        "Invalid data: " + prettifyZodErrorMessage(validation.error)
      );
    }

    const { appointmentId, startTime, endTime, reason } = validation.data;

    // Verify the appointment belongs to this counselor
    const appointment = await prisma.appointment.findFirst({
      where: { counselorId: session.user.id, id: appointmentId },
    });
    if (!appointment) {
      throw new Error("Appointment not found");
    }

    if (appointment.status !== AppointmentStatus.Completed) {
      throw new Error(
        "Can only create follow-up appointment for completed sessions"
      );
    }

    if (appointment.followUpId) {
      throw new Error("Follow-up appointment already exists for this session");
    }

    if (startTime < new Date()) {
      throw new Error("Cannot schedule follow-up in the past");
    }

    if (startTime >= endTime) {
      throw new Error("End time must be after start time");
    }

    if (startTime <= (appointment.endTime || appointment.startTime)) {
      throw new Error(
        "Follow-up appointment must be scheduled after the original appointment"
      );
    }

    const followUp = await prisma.appointment.create({
      data: {
        appointmentData: JSON.parse(
          JSON.stringify(appointment.appointmentData)
        ),
        status: AppointmentStatus.Pending,
        sessionPreference: appointment.sessionPreference,
        followUpReason: reason,
        counselorId: appointment.counselorId,
        studentId: appointment.studentId,
        startTime,
        endTime,
      },
    });

    await prisma.appointment.update({
      where: { id: appointmentId },
      data: {
        followUpId: followUp.id,
      },
    });

    const result = await createAppointmentNotification(
      appointment,
      NotificationType.AppointmentCreated,
      { appointmentId: followUp.id } as AppointmentCreateNotification
    );
    if (!result.success) {
      console.error(
        "Failed to create appointment notification:",
        result.message
      );
    }

    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false, message: (error as Error).message };
  }
}

export async function approveFollowUpAppointment(
  appointmentId: string
): Promise<ActionResult<void>> {
  try {
    const session = await auth();
    if (
      !session?.user?.id ||
      session.user.type !== UserType.Student ||
      session.user.deactivated
    ) {
      throw new Error("Unauthorized");
    }

    const appointment = await prisma.appointment.findFirst({
      where: { studentId: session.user.id, id: appointmentId },
      include: { parent: true },
    });
    if (!appointment) {
      throw new Error("Appointment not found");
    }

    if (!appointment.parent) {
      throw new Error("Not a follow-up appointment");
    }

    const updatedAppointment = await prisma.appointment.update({
      where: { id: appointmentId },
      data: {
        status: AppointmentStatus.Approved,
      },
    });

    const result = await createAppointmentNotification(
      updatedAppointment,
      NotificationType.AppointmentUpdatedStatus,
      {
        appointmentId: updatedAppointment.id,
        from: appointment.status,
        to: updatedAppointment.status,
      } as AppointmentUpdateStatusNotification
    );
    if (!result.success) {
      console.error(
        "Failed to create appointment notification:",
        result.message
      );
    }

    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false, message: (error as Error).message };
  }
}

export async function updateToDidNotAttend(
  appointmentId: string
): Promise<ActionResult<void>> {
  try {
    const session = await auth();
    if (
      !session?.user?.id ||
      session.user.type !== UserType.Counselor ||
      session.user.deactivated
    ) {
      throw new Error("Unauthorized");
    }

    const appointment = await prisma.appointment.findFirst({
      where: { counselorId: session.user.id, id: appointmentId },
    });

    if (!appointment) {
      throw new Error("Appointment not found");
    }

    if (appointment.status !== AppointmentStatus.Approved) {
      throw new Error("Only approved appointments can be marked as D.N.A.");
    }

    const updatedAppointment = await prisma.appointment.update({
      where: { id: appointmentId },
      data: {
        status: AppointmentStatus.DidNotAttend,
      },
    });

    const result = await createAppointmentNotification(
      updatedAppointment,
      NotificationType.AppointmentDidNotAttend,
      {
        appointmentId: updatedAppointment.id,
        date: appointment.startTime,
      } as AppointmentDidNotAttendNotification
    );

    if (!result.success) {
      console.error(
        "Failed to create appointment notification:",
        result.message
      );
    }

    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false, message: (error as Error).message };
  }
}

export async function submitDidNotAttendReason(
  formData: FormData
): Promise<ActionResult<void>> {
  try {
    const session = await auth();
    if (
      !session?.user?.id ||
      session.user.type !== UserType.Student ||
      session.user.deactivated
    ) {
      throw new Error("Unauthorized");
    }

    const validation = didNotAttendReasonSchema.safeParse(
      Object.fromEntries(formData)
    );
    if (!validation.success) {
      throw new Error(
        "Invalid reason: " + prettifyZodErrorMessage(validation.error)
      );
    }
    const { appointmentId, reason } = validation.data;

    const appointment = await prisma.appointment.findFirst({
      where: { studentId: session.user.id, id: appointmentId },
    });
    if (!appointment) {
      throw new Error("Appointment not found");
    }

    if (appointment.status !== AppointmentStatus.DidNotAttend) {
      throw new Error("Appointment is not marked as Did Not Attend");
    }

    if (appointment.didNotAttendReason) {
      throw new Error("Did Not Attend reason has already been submitted");
    }

    await prisma.appointment.update({
      where: { id: appointmentId },
      data: {
        didNotAttendReason: reason,
      },
    });

    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false, message: (error as Error).message };
  }
}

export async function updateNotes(
  data: NotesData
): Promise<ActionResult<void>> {
  try {
    const session = await auth();
    if (
      !session?.user?.id ||
      session.user.type !== UserType.Counselor ||
      session.user.deactivated
    ) {
      throw new Error("Unauthorized");
    }

    const validation = notesSchema.safeParse(data);
    if (!validation.success) {
      throw new Error(
        "Invalid data: " + prettifyZodErrorMessage(validation.error)
      );
    }

    const { appointmentId, notes } = validation.data;

    const appointment = await prisma.appointment.findFirst({
      where: { counselorId: session.user.id, id: appointmentId },
    });

    if (!appointment) {
      throw new Error("Appointment not found");
    }

    await prisma.appointment.update({
      where: { id: appointmentId },
      data: {
        notes,
      },
    });

    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false, message: (error as Error).message };
  }
}

export async function getAppointmentForCall(
  userId: string
): Promise<ActionResult<Appointment | null>> {
  try {
    const session = await auth();
    if (
      !session?.user?.id ||
      session.user.type !== UserType.Counselor ||
      session.user.deactivated
    ) {
      return { success: false, message: "Unauthorized" };
    }

    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999);

    const appointment = await prisma.appointment.findFirst({
      where: {
        studentId: userId,
        counselorId: session.user.id,
        status: AppointmentStatus.Approved,
        startTime: {
          gte: startOfToday,
          lte: endOfToday,
        },
      },
      orderBy: {
        startTime: "asc",
      },
    });

    if (!appointment) {
      return { success: false, message: "No approved appointment found" };
    }

    return { success: true, data: appointment };
  } catch (error) {
    console.error(error);
    return { success: false, message: (error as Error).message };
  }
}
