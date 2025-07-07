import React from "react";
import AdminUsersPage from "@/app/components/Admin/Users/UsersPage";
import { getServerSession } from "next-auth";
import AuthOptions from "@/app/components/AuthOptions";
import { UserType } from "@/app/generated/prisma";
import { redirect } from "next/navigation";

const UsersPage = async () => {
  const session = await getServerSession(AuthOptions);

  if (!session || session.user.type !== UserType.Admin) {
    redirect("/user/dashboard");
  }

  return <AdminUsersPage />;
};

export default UsersPage;
