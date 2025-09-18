import AdminUsersPage from "@/app/components/Admin/Users/UsersPage";
import { UserType } from "@/app/generated/prisma";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

const UsersPage = async () => {
  const session = await auth();

  if (!session || session.user.type !== UserType.Admin) {
    redirect("/user/dashboard");
  }

  return (
    <div className="flex-1">
      <div className="bg-base-100 shadow-br rounded-xl">
        <AdminUsersPage />
      </div>
    </div>
  );
};

export default UsersPage;
