"use server";
import ActionResult from "@/app/components/ActionResult";
import { auth } from "@/auth";
import { prisma } from "@/prisma/client";
import { onboardingSchema } from "./schema";

export async function hasOnboarded() {
  const session = await auth();
  if (!session?.user) {
    return false;
  }

  const hasOnboarded = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { completedOnboarding: true },
  });

  return hasOnboarded?.completedOnboarding ?? false;
}

export async function completeOnboarding(
  data: FormData
): Promise<ActionResult<void>> {
  try {
    const session = await auth();
    if (!session?.user) {
      throw new Error("Unauthorized");
    }

    console.log("Form Data:", Object.fromEntries(data));

    const validation = onboardingSchema.safeParse(Object.fromEntries(data));

    if (!validation.success) {
      throw new Error("Invalid form data" + validation.error.message);
    }

    const {
      firstName,
      lastName,
      middleName,
      suffix,
      birthDate,
      department,
      program,
      year,
      section,
      gender,
      contact,
      guardianFirstName,
      guardianMiddleName,
      guardianLastName,
      guardianSuffix,
      guardianContact,
      guardianRelationship,
      guardianEmail,
    } = validation.data;

    const fullName =
      firstName +
      " " +
      (middleName ? middleName + " " : "") +
      lastName +
      (suffix ? ", " + suffix : "");

    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        completedOnboarding: true,
        name: fullName,
        firstName,
        lastName,
        middleName,
        suffix,
        birthDate,
        department,
        program,
        year,
        section,
        gender,
        phoneNumber: contact,
        guardianFirstName,
        guardianMiddleName,
        guardianLastName,
        guardianSuffix,
        guardianContact,
        relationToGuardian: guardianRelationship,
        guardianEmail,
      },
    });
  } catch (error: any) {
    return {
      success: false,
      message: error.message,
      cause: error.cause,
    };
  }

  return { success: true, data: undefined };
}
