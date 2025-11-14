"use client";
import FormsBuilder, { QuestionBox } from "@/app/components/Forms/FormBuilder";
import { FormsHeaderProps } from "@/app/components/Forms/FormsHeader";
import { usePopup } from "@/app/components/Popup/PopupProvider";
import {
  guardianQuestions,
  studentQuestions,
} from "@/app/pages/Onboarding/Questions";
import { redirect } from "next/navigation";
import { completeOnboarding } from "./OnboardingActions";

const Onboarding = () => {
  const statusPopup = usePopup();

  async function onSubmit(formData: FormData) {
    statusPopup.showLoading("Submitting your responses...");
    const result = await completeOnboarding(formData);

    if (!result.success) {
      statusPopup.showError(result.message || "An unknown error occurred.");
      return;
    }

    statusPopup.showSuccess("Onboarding completed successfully.");
    redirect("user/dashboard");
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
      onBack={() => redirect("/")}
    />
  );
};

export default Onboarding;
