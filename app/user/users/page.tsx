import { UserType } from "@/app/generated/prisma";
import AdminUsersPage from "@/app/pages/UserList";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

const UsersPage = async () => {
  const session = await auth();

  if (!session || session.user.type !== UserType.Admin) {
    redirect("/user/dashboard");
  }

  return <AdminUsersPage />;
};

export default UsersPage;
