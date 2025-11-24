"use server";

import ActionResult from "@/app/components/ActionResult";
import { UserStatus, UserType } from "@/app/generated/prisma";
import { auth } from "@/auth";
import { isUserOnline } from "@/lib/redis";
import { UpdateUserTypeData, updateUserSchema } from "@/lib/schemas";
import { createManyChatsWithOthers } from "@/lib/utils";
import { prisma } from "@/prisma/client";

export type UserWithStatus = {
  id: string;
  name: string;
  email: string;
  image: string | null;
  type: UserType;
  createdAt: Date;
  updatedAt: Date;
  status: UserStatus;
  deactivated: boolean;
};

export async function getUsers() {
  const session = await auth();

  if (!session || !(session.user.type === UserType.Admin)) {
    throw new Error("Unauthorized");
  }

  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      type: true,
      createdAt: true,
      updatedAt: true,
      status: true,
      deactivated: true,
    },
    orderBy: {
      name: "asc",
    },
  });

  const usersWithStatus = (await Promise.all(
    users.map(async (user) =>
      (await isUserOnline(user.id))
        ? { ...user, status: UserStatus.Online }
        : { ...user, status: UserStatus.Offline }
    )
  )) as UserWithStatus[];

  return usersWithStatus;
}

export async function updateUserType(
  data: UpdateUserTypeData
): Promise<ActionResult<void>> {
  try {
    const session = await auth();

    if (!session || !(session.user.type === UserType.Admin)) {
      throw new Error("Unauthorized");
    }

    const validation = updateUserSchema.safeParse(data);
    if (!validation.success) {
      throw new Error("Invalid request data");
    }

    const { id, type } = validation.data;

    if (id === session.user.id) {
      throw new Error("Cannot change your own user type");
    }

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        type: true,
      },
    });

    if (!user) {
      throw new Error("User not found");
    }

    if (user.type === type) {
      throw new Error("User is already of this type");
    }

    if (user.type === UserType.Admin) {
      await prisma.admin.delete({ where: { adminId: id } });
    } else if (user.type === UserType.Counselor) {
      await prisma.counselor.delete({ where: { counselorId: id } });
    } else if (user.type === UserType.Student) {
      await prisma.student.delete({ where: { studentId: id } });
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: { type },
      select: {
        id: true,
        name: true,
        type: true,
      },
    });

    if (!updatedUser) {
      throw new Error("Failed to update user type");
    }

    const deleted = await prisma.chat.deleteMany({
      where: { members: { some: { userId: id } } },
    });
    console.log(`Deleted ${deleted.count} chats for user ${updatedUser.name}`);
    if (updatedUser.type === UserType.Admin) {
      await prisma.admin.create({
        data: {
          adminId: updatedUser.id,
        },
      });

      await createManyChatsWithOthers(UserType.Admin, updatedUser.id);
      await createManyChatsWithOthers(UserType.Counselor, updatedUser.id);
    } else if (updatedUser.type === UserType.Counselor) {
      await prisma.counselor.create({
        data: {
          counselorId: updatedUser.id,
        },
      });

      await createManyChatsWithOthers(UserType.Admin, updatedUser.id);
      await createManyChatsWithOthers(UserType.Counselor, updatedUser.id);
      await createManyChatsWithOthers(UserType.Student, updatedUser.id);
    } else if (updatedUser.type === UserType.Student) {
      await prisma.student.create({
        data: {
          studentId: updatedUser.id,
        },
      });

      await createManyChatsWithOthers(UserType.Counselor, updatedUser.id);
    }
  } catch (error) {
    console.error(
      "Error updating user type: " + (error as Error).message,
      error
    );
    return { success: false, message: (error as Error).message };
  }

  return { success: true };
}

export async function changeUserDeactivationStatus(
  userId: string,
  deactivate: boolean
): Promise<ActionResult<void>> {
  try {
    const session = await auth();
    if (!session || session.user.type !== UserType.Admin) {
      throw new Error("Unauthorized");
    }

    if (userId === session.user.id) {
      throw new Error("Cannot change your own deactivation status");
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });
    if (!user) {
      throw new Error("User not found");
    }

    if (user.deactivated === deactivate) {
      throw new Error(
        `User is already ${deactivate ? "deactivated" : "activated"}`
      );
    }

    await prisma.user.update({
      where: { id: userId },
      data: { deactivated: deactivate },
    });
  } catch (error) {
    console.error(
      "Error changing user deactivation status: " + (error as Error).message,
      error
    );
    return { success: false, message: (error as Error).message };
  }
  return { success: true };
}

export async function deleteUser(userId: string): Promise<ActionResult<void>> {
  try {
    const session = await auth();
    if (!session || session.user.type !== UserType.Admin) {
      throw new Error("Unauthorized");
    }

    if (userId === session.user.id) {
      throw new Error("Cannot delete your own account");
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new Error("User not found");
    }

    await prisma.user.delete({
      where: { id: userId },
    });
  } catch (error) {
    console.error("Error deleting user: " + (error as Error).message, error);
    return { success: false, message: (error as Error).message };
  }
  return { success: true };
}
