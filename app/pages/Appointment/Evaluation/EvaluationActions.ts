"use server";

import ActionResult from "@/app/components/ActionResult";
import { BuiltFormData } from "@/app/components/Forms/EditableFormBuilder";
import { AppointmentStatus, FormType, UserType } from "@/app/generated/prisma";
import { buildZodSchema } from "@/app/pages/Forms/schema";
import { auth } from "@/auth";
import { prettifyZodErrorMessage } from "@/lib/utils";
import { prisma } from "@/prisma/client";

export type EvaluationTableData = {
  appointmentId: string;
  studentName: string | null;
  studentEmail: string;
  studentImageUrl: string | null;
  startTime: Date;
  endTime: Date | null;
  rating: number | null;
};

export async function createEvaluation(
  appointmentId: string,
  formData: FormData
): Promise<ActionResult<void>> {
  const data = Object.fromEntries(formData.entries());
  try {
    const session = await auth();
    if (!session?.user?.id || session.user.type !== UserType.Student) {
      throw new Error("Unauthorized");
    }

    const appointment = await prisma.appointment.findFirst({
      where: { studentId: session.user.id, id: appointmentId },
    });
    if (!appointment) {
      throw new Error("Appointment not found");
    }

    if (appointment.status !== AppointmentStatus.Completed) {
      throw new Error("Can only submit evaluation for completed sessions");
    }

    if (appointment.evaluationData) {
      throw new Error("Evaluation has already been submitted");
    }

    const questions = await prisma.formSchema.findUnique({
      where: { type: FormType.EVALUATION },
    });

    if (!questions) {
      throw new Error("Evaluation form not found");
    }

    const questionsData = JSON.parse(
      JSON.stringify(questions.schema)
    ) as BuiltFormData;

    const validation = buildZodSchema(questionsData).safeParse(data);

    if (!validation.success) {
      throw new Error(
        "Invalid evaluation data: " + prettifyZodErrorMessage(validation.error)
      );
    }

    if (
      !validation.data.rating ||
      typeof validation.data.rating !== "number" ||
      isNaN(validation.data.rating) ||
      validation.data.rating < 1 ||
      validation.data.rating > 5
    ) {
      throw new Error("Rating is required and must be a valid number");
    }

    await prisma.appointment.update({
      where: { id: appointmentId },
      data: {
        rating: validation.data.rating,
        evaluationData: {
          answers: JSON.parse(JSON.stringify(validation.data)),
          questions: questions.schema,
        },
      },
    });

    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false, message: (error as Error).message };
  }
}

export async function getEvaluationTableData(): Promise<
  ActionResult<EvaluationTableData[]>
> {
  try {
    const session = await auth();
    if (!session?.user?.id || session.user.type !== UserType.Counselor) {
      throw new Error("Unauthorized");
    }
    const appointments = await prisma.appointment.findMany({
      where: {
        counselorId: session.user.id,
        NOT: { rating: null },
      },
      select: {
        id: true,
        startTime: true,
        endTime: true,
        rating: true,
        student: {
          select: {
            user: {
              select: {
                name: true,
                image: true,
                email: true,
              },
            },
          },
        },
      },
    });

    return {
      success: true,
      data: appointments.map((appointment) => ({
        appointmentId: appointment.id,
        studentName: appointment.student.user.name,
        studentEmail: appointment.student.user.email,
        studentImageUrl: appointment.student.user.image,
        startTime: appointment.startTime,
        endTime: appointment.endTime,
        rating: appointment.rating,
      })),
    };
  } catch (error) {
    console.error(error);
    return { success: false, message: (error as Error).message };
  }
}
