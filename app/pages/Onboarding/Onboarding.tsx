"use client";
import FormsBuilder, {
  FormComponent,
} from "@/app/components/Forms/FormBuilder";
import { FormsHeaderProps } from "@/app/components/Forms/FormsHeader";
import { usePopup } from "@/app/components/Popup/PopupProvider";
import {
  guardianQuestions,
  studentQuestions,
} from "@/app/pages/Onboarding/Questions";
import { useRouter } from "next/navigation";
import { completeOnboarding } from "./OnboardingActions";

const Onboarding = () => {
  const statusPopup = usePopup();
  const router = useRouter();

  async function onSubmit(formData: FormData) {
    statusPopup.showLoading("Submitting your responses...");
    const result = await completeOnboarding(formData);

    if (!result.success) {
      statusPopup.showError(result.message || "An unknown error occurred.");
      return;
    }

    statusPopup.showSuccess("Onboarding completed successfully.");
    router.push("user/dashboard");
  }

  const header: FormsHeaderProps = {
    name: "onboardingHeader",
    title: "Registration Form",
    description:
      "Answer the registration form truthfully to complete the initial account setup.",
  };

  const questions: FormComponent[] = [
    ...studentQuestions,
    ...guardianQuestions,
  ];

  return (
    <FormsBuilder
      form={{
        header,
        components: questions,
        termsAndConditions: true,
      }}
      onSubmit={onSubmit}
      backHref="/"
    />
  );
};

export default Onboarding;
