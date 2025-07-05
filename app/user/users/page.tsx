import React from "react";
import AdminUsersPage from "@/app/components/Admin/Users/UsersPage";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { UserType } from "@/app/generated/prisma";
import { redirect } from "next/navigation";

const UsersPage = async () => {
  const session = await getServerSession(authOptions);

  if (!session || session.user.type !== UserType.Admin) {
    redirect("/user/dashboard");
  }

  return <AdminUsersPage />;
};

export default UsersPage;
