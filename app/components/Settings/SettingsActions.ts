"use server";
import { User } from "@/app/generated/prisma";
import { auth } from "@/auth";
import { prisma } from "@/prisma/client";
import z from "zod";

export type SettingsUser = Pick<
  User,
  | "id"
  | "email"
  | "name"
  | "firstName"
  | "lastName"
  | "image"
  | "department"
  | "program"
  | "year"
  | "section"
  | "recoveryEmail"
  | "phoneNumber"
>;

const updateUserInfoSchema = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  image: z.instanceof(File).optional(),
  department: z.string().optional(),
  program: z.string().optional(),
  year: z
    .string()
    .transform((val) => parseInt(val))
    .optional(),
  section: z.string().optional(),
  recoveryEmail: z.email().optional(),
  phoneNumber: z.string().optional(),
});

export type UpdateUserInfoData = z.infer<typeof updateUserInfoSchema>;

export async function getUser() {
  const session = await auth();
  if (!session) {
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

export async function changeUserInfo(formData: FormData) {
  const session = await auth();
  if (!session) {
    throw new Error("Unauthorized");
  }
  const data = Object.fromEntries(formData.entries());

  const filteredData = Object.fromEntries(
    Object.entries(data).filter(([key, value]) => {
      if (typeof value === "string" && value.trim() === "") {
        return false;
      }
      return true;
    })
  );
  const parsedData = updateUserInfoSchema.parse(filteredData);

  const updatedUser = await prisma.user.update({
    where: { id: session.user.id },
    data: {
      firstName: parsedData.firstName,
      lastName: parsedData.lastName,
      name:
        parsedData.firstName && parsedData.lastName
          ? `${parsedData.firstName} ${parsedData.lastName}`
          : undefined,
      department: parsedData.department,
      program: parsedData.program,
      year: parsedData.year,
      section: parsedData.section,
      recoveryEmail: parsedData.recoveryEmail,
      phoneNumber: parsedData.phoneNumber,
    },
  });

  if (!updatedUser) {
    throw new Error("Failed to update user");
  }

  console.log("Updated user:", updatedUser);
}
