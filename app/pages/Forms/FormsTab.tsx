"use client";

import EditableFormBuilder, {
  BuiltFormData,
} from "@/app/components/Forms/EditableFormBuilder";
import { createFormComponent } from "@/app/components/Forms/EditableInput/utils";
import {
  FormComponent,
  FormComponentType,
} from "@/app/components/Forms/FormBuilder";
import { FormsHeaderProps } from "@/app/components/Forms/FormsHeader";
import { usePopup } from "@/app/components/Popup/PopupProvider";
import { FormType } from "@/app/generated/prisma";
import { useEffect, useState } from "react";
import { IoDocumentTextOutline } from "react-icons/io5";
import { fetchForms, saveForms } from "./formsActions";
import FormsLoading from "./FormsLoading";

const FormsTab = ({
  title,
  formType,
  groupName,
  defaultChecked = false,
}: {
  title: string;
  formType: FormType;
  groupName: string;
  header?: FormsHeaderProps;
  components?: FormComponent[];
  defaultChecked?: boolean;
}) => {
  const statusPopup = usePopup();
  const [loading, setLoading] = useState(true);

  const defaultForm: BuiltFormData = {
    header: {
      name: title,
      title: title,
      description: "",
    },
    components: [
      createFormComponent({
        type: FormComponentType.TEXT,
        name: "text",
      }),
    ],
  };

  const [form, setForm] = useState<BuiltFormData>(defaultForm);

  useEffect(() => {
    async function fetchInitialData() {
      setLoading(true);
      const result = await fetchForms(formType);
      if (!result.success) {
        statusPopup.showError(result.message || "Failed to fetch form data");
        return;
      }
      if (result.data) {
        setForm(result.data || defaultForm);
      }

      setLoading(false);
    }
    fetchInitialData();
  }, []);

  async function onSave(builtFormData: BuiltFormData) {
    statusPopup.showLoading("Saving form...");
    const result = await saveForms(formType, builtFormData);
    if (!result.success) {
      statusPopup.showError(result.message || "Failed to fetch form data");
      return;
    }
    statusPopup.showSuccess("Form saved successfully");
  }

  return (
    <>
      <label className="tab gap-2">
        <input
          type="radio"
          name={groupName}
          className="tab "
          defaultChecked={defaultChecked}
        />
        <IoDocumentTextOutline />
        {title}
      </label>
      <div className="tab-content bg-base-200 border-base-300 p-0 shadow-br h-full min-h-0">
        <div className="flex flex-col h-full">
          {loading ? (
            <FormsLoading />
          ) : (
            <EditableFormBuilder
              form={form}
              onChange={(updatedForm) => setForm(updatedForm)}
              onSave={() => onSave(form)}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default FormsTab;
