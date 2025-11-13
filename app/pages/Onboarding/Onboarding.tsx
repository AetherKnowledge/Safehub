"use client";
import FormsBuilder, { QuestionBox } from "@/app/components/Forms/FormBuilder";
import { FormsHeaderProps } from "@/app/components/Forms/FormsHeader";
import { usePopup } from "@/app/components/Popup/PopupProvider";
import {
  guardianQuestions,
  studentQuestions,
} from "@/app/pages/Onboarding/Questions";
import { completeOnboarding } from "./OnboardingActions";

const Onboarding = () => {
  const statusPopup = usePopup();

  async function onSubmit(formData: FormData) {
    statusPopup.showLoading("Submitting your responses...");
    const result = await completeOnboarding(formData);

    if (!result.success) {
      statusPopup.showError(
        result.error.message || "An unknown error occurred."
      );
      return;
    }

    statusPopup.showSuccess("Onboarding completed successfully.");
  }

  const header: FormsHeaderProps = {
    title: "Registration Form",
    description:
      "Answer the registration form truthfully to complete the initial account setup.",
  };

  const question: QuestionBox[] = [...studentQuestions, ...guardianQuestions];

  return (
    <FormsBuilder
      header={header}
      questions={question}
      hasTermsAndConditions
      onSubmit={onSubmit}
    />
  );
};

export default Onboarding;
