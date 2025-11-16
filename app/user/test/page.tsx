"use client";
import { BuiltFormData } from "@/app/components/Forms/EditableFormBuilder";
import FormsBuilder, {
  FormComponentType,
} from "@/app/components/Forms/FormBuilder";
import { usePopup } from "@/app/components/Popup/PopupProvider";
import { bookingQuestions } from "@/app/pages/Appointment/Question";
import { testAction } from "./testActions";

const Test = () => {
  const statusPopup = usePopup();

  const form: BuiltFormData = {
    header: {
      name: "testForm",
      title: "Test Form",
      description: "This is a test form.",
    },
    components: [
      ...bookingQuestions,
      {
        type: FormComponentType.TIME,
        props: {
          name: "testTime",
          legend: "Select a time:",
          required: true,
        },
        version: "1",
      },
    ],
    termsAndConditions: true,
  };

  async function handleSubmit(formData: FormData) {
    statusPopup.showLoading("Submitting form...");
    const result = await testAction(formData);
    if (result.success) {
      statusPopup.showSuccess("Form submitted successfully!");
    } else {
      statusPopup.showError("Failed to submit form. " + (result.message || ""));
    }
  }

  return (
    <div className="flex flex-col min-h-0 h-full">
      <FormsBuilder form={form} onSubmit={handleSubmit} />
    </div>
  );
};

export default Test;
