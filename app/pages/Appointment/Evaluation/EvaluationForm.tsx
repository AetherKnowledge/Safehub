"use client";

import { BuiltFormData } from "@/app/components/Forms/EditableFormBuilder";
import FormBuilder from "@/app/components/Forms/FormBuilder";
import { usePopup } from "@/app/components/Popup/PopupProvider";
import { useRouter } from "next/navigation";
import { createEvaluation } from "./EvaluationActions";

const EvaluationForm = ({
  appointmentId,
  form,
  defaultValues,
  readOnly = false,
}: {
  appointmentId: string;
  form: BuiltFormData;
  defaultValues?: Record<string, any>;
  readOnly?: boolean;
}) => {
  const statusPopup = usePopup();
  const router = useRouter();

  async function handleSubmit(formData: FormData) {
    statusPopup.showLoading("Submitting evaluation...");
    const confirmed =
      await statusPopup.showYesNo(`Are you sure you would like to submit?
It cannot be changed once submitted.`);

    if (!confirmed) {
      return;
    }

    const result = await createEvaluation(appointmentId, formData);
    if (!result.success) {
      statusPopup.showError(result.message || "An unknown error occurred.");
      return;
    }
    statusPopup.showSuccess("Evaluation submitted successfully.");
    router.push("/user/appointments");
  }

  return (
    <FormBuilder
      form={form}
      defaultValues={defaultValues}
      readOnly={readOnly}
      onSubmit={handleSubmit}
      backHref="/user/appointments"
    />
  );
};

export default EvaluationForm;
