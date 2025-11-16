import { FormType, UserType } from "@/app/generated/prisma";
import Booking from "@/app/pages/Booking";
import { fetchForms } from "@/app/pages/Forms/formsActions";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

const AppointmentPage = async () => {
  const session = await auth();
  if (!session || session.user.type !== UserType.Student)
    return redirect("/user/dashboard");

  const result = await fetchForms(FormType.BOOKING);
  if (!result.success) {
    throw new Error(result.message);
  }
  if (!result.data) {
    throw new Error("Booking form not found");
  }

  return <Booking form={result.data} />;
};

export default AppointmentPage;
