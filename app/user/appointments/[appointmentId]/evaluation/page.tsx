import { BuiltFormDataWithAnswers } from "@/app/components/Forms/EditableFormBuilder";
import ErrorPopup from "@/app/components/Popup/ErrorPopup";
import { FormType, UserType } from "@/app/generated/prisma/browser";
import { getAppointmentById } from "@/app/pages/Appointment/AppointmentActions";
import EvaluationForm from "@/app/pages/Appointment/Evaluation/EvaluationForm";
import { fetchForms } from "@/app/pages/Forms/formsActions";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

const page = async ({
  params,
}: {
  params: Promise<{ appointmentId: string }>;
}) => {
  const session = await auth();

  if (session?.user.type === UserType.Admin) {
    redirect("/user/dashboard");
  }

  const { appointmentId } = await params;

  const appointment = await getAppointmentById(appointmentId);
  const formDataWithAnswers = appointment?.evaluationData
    ? (JSON.parse(
        JSON.stringify(appointment.evaluationData)
      ) as BuiltFormDataWithAnswers)
    : undefined;

  if (formDataWithAnswers)
    return (
      <EvaluationForm
        appointmentId={appointmentId}
        form={formDataWithAnswers.questions}
        defaultValues={formDataWithAnswers.answers}
        readOnly
      />
    );

  const latestForms = await fetchForms(FormType.EVALUATION);

  if (!latestForms.success || !latestForms.data) {
    return <ErrorPopup message="Evaluation form is not set up..." />;
  }

  if (session?.user.type === UserType.Counselor) {
    return <ErrorPopup message="Students hasn't submitted evaluation yet." />;
  }

  return (
    <EvaluationForm form={latestForms.data} appointmentId={appointmentId} />
  );
};

export default page;
