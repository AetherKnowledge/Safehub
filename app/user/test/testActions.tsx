"use server";

import ActionResult from "@/app/components/ActionResult";
import { AppointmentStatus } from "@/app/generated/prisma";
import { auth } from "@/auth";
import { prisma } from "@/prisma/client";

export async function testAction(): Promise<ActionResult<void>> {
  try {
    function getRandomAppointmentStatus(): AppointmentStatus {
      const statuses = Object.values(AppointmentStatus);
      const randomIndex = Math.floor(Math.random() * statuses.length);
      return statuses[randomIndex];
    }

    const session = await auth();
    if (!session?.user || !session.user.id) {
      return {
        success: false,
        message: "You must be logged in to perform this action.",
      };
    }

    const appointment = await prisma.appointment.findFirst({});
    if (!appointment) {
      return {
        success: false,
        message: "No appointment found.",
      };
    }

    for (let i = 0; i < 100; i++) {
      await prisma.appointmentLog.create({
        data: {
          appointmentId: appointment.id,
          changedBy: session.user.id,
          from: getRandomAppointmentStatus(),
          to: getRandomAppointmentStatus(),
        },
      });
    }

    console.log("Appointment:", appointment);

    return { success: true };
  } catch (error) {
    console.error("Error in testAction:", error);
    return {
      success: false,
      message: "Error in testAction " + (error as Error).message,
    };
  }
}
