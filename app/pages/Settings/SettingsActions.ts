"use server";
import ActionResult from "@/app/components/ActionResult";
import { User } from "@/app/generated/prisma";
import { auth } from "@/auth";
import { prettifyZodErrorMessage } from "@/lib/utils";
import { prisma } from "@/prisma/client";
import z from "zod";
import {
  Department,
  Gender,
  GuardianRelationship,
  Program,
  Section,
} from "../Onboarding/schema";

export type SettingsUser = Omit<
  User,
  "password" | "emailVerified" | "createdAt" | "updatedAt"
>;

const updateUserInfoSchema = z.object({
  // Student details
  firstName: z.string().min(1, "First name is required").optional(),
  middleName: z.string().optional(),
  lastName: z.string().min(1, "Last name is required").optional(),
  suffix: z.string().optional(),

  // birth date - accept string or Date, coerce to Date
  birthDate: z
    .preprocess((arg) => {
      if (typeof arg === "string" || arg instanceof Date)
        return new Date(arg as any);
      return undefined;
    }, z.date())
    .optional(),

  // department & program
  department: z.enum(Department).optional(),
  program: z.enum(Program).optional(),

  // year & section
  year: z
    .string()
    .transform((val) => Number(val))
    .pipe(
      z
        .number()
        .min(1, "Year must be at least 1")
        .max(4, "Year must be at most 4")
    )
    .optional(),
  section: z.enum(Section).optional(),

  // gender
  gender: z.enum(Gender).optional(),

  // contact
  contact: z
    .string()
    .min(10, "Contact number must be at least 10 digits")
    .max(15, "Contact number must be at most 15 digits")
    .optional(),

  // Guardian details
  guardianFirstName: z
    .string()
    .min(1, "Guardian first name is required")
    .optional(),
  guardianMiddleName: z.string().optional(),
  guardianLastName: z
    .string()
    .min(1, "Guardian last name is required")
    .optional(),
  guardianSuffix: z.string().optional(),

  guardianContact: z
    .string()
    .min(10, "Guardian contact must be at least 10 digits")
    .max(15, "Guardian contact must be at most 15 digits")
    .optional(),

  guardianRelationship: z.enum(GuardianRelationship).optional(),

  guardianEmail: z.email("Invalid guardian email address").optional(),
});

export type UpdateUserInfoData = z.infer<typeof updateUserInfoSchema>;

export async function getUser() {
  const session = await auth();
  if (!session || session.user.deactivated) {
    throw new Error("Unauthorized");
  }

  const user = await prisma.user.findUnique({
    where: {
      id: session.user.id,
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  return user as SettingsUser;
}

export async function changeUserInfo(
  data: FormData
): Promise<ActionResult<void>> {
  try {
    const session = await auth();
    if (!session?.user || session.user.deactivated) {
      throw new Error("Unauthorized");
    }

    console.log("Form Data:", Object.fromEntries(data));

    const validation = updateUserInfoSchema.safeParse(Object.fromEntries(data));

    if (!validation.success) {
      throw new Error(prettifyZodErrorMessage(validation.error));
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
