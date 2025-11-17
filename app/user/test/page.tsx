"use client";
import EditableFormBuilder from "@/app/components/Forms/EditableFormBuilder";
import FormsBuilder from "@/app/components/Forms/FormBuilder";
import { usePopup } from "@/app/components/Popup/PopupProvider";
import { useState } from "react";
import { testForm } from "./question";
import { testAction } from "./testActions";

const Test = () => {
  const statusPopup = usePopup();

  async function handleSubmit(formData: FormData) {
    statusPopup.showLoading("Submitting form...");
    const result = await testAction(formData);
    if (result.success) {
      statusPopup.showSuccess("Form submitted successfully!");
    } else {
      statusPopup.showError("Failed to submit form. " + (result.message || ""));
    }
  }

  const [form, setForm] = useState(testForm);

  return (
    <div className="flex flex-col min-h-0 h-full">
      <EditableFormBuilder form={form} onChange={setForm} />
      <FormsBuilder
        form={form}
        onSubmit={handleSubmit}
        defaultValues={{ radioQuestion: "wew" }}
      />
    </div>
  );
};

export default Test;
