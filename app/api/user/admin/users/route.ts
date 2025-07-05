import { NextResponse } from "next/server";
import { prisma } from "@/prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { UserType, UserStatus } from "@/app/generated/prisma";
import { z } from "zod";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (
    !session ||
    !session.user?.email ||
    session.user.type !== UserType.Admin
  ) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
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
      lastActiveAt: true,
      status: true,
    },
    orderBy: {
      name: "asc",
    },
  });

  const usersWithStatus = users.map((user) => {
    const now = new Date();
    const lastActive = user.lastActiveAt ? new Date(user.lastActiveAt) : null;

    if (lastActive) {
      const diffInMinutes = Math.floor(
        (now.getTime() - lastActive.getTime()) / 60000
      );

      if (diffInMinutes < 1) {
        user.status = UserStatus.Online;
      }
    }

    return { ...user };
  });

  return NextResponse.json(usersWithStatus, { status: 200 });
}

const updateUserSchema = z.object({
  id: z.string(),
  type: z.nativeEnum(UserType),
});

export async function PUT(request: Request) {
  const session = await getServerSession(authOptions);

  if (
    !session ||
    !session.user?.email ||
    session.user.type !== UserType.Admin
  ) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const parsedBody = updateUserSchema.safeParse(body);
  if (!parsedBody.success) {
    return NextResponse.json(
      { error: "Invalid request data" },
      { status: 400 }
    );
  }

  const { id, type } = parsedBody.data;
  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      type: true,
    },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  if (user.type === type) {
    return NextResponse.json(
      { error: "User is already of this type" },
      { status: 400 }
    );
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
    return NextResponse.json(
      { error: "Failed to update user" },
      { status: 500 }
    );
  }

  if (updatedUser.type === UserType.Admin) {
    await prisma.admin.create({
      data: {
        adminId: updatedUser.id,
      },
    });
  } else if (updatedUser.type === UserType.Counselor) {
    await prisma.counselor.create({
      data: {
        counselorId: updatedUser.id,
      },
    });
  } else if (updatedUser.type === UserType.Student) {
    await prisma.student.create({
      data: {
        studentId: updatedUser.id,
      },
    });
  }

  return NextResponse.json(
    {
      message: `Update of user ${updatedUser.name} to ${updatedUser.type} successful`,
    },
    { status: 200 }
  );
}
