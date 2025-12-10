import { BuiltFormData } from "@/app/components/Forms/EditableFormBuilder";
import { FormComponentType } from "@/app/components/Forms/FormBuilder.types";

export const testForm: BuiltFormData = {
  header: {
    name: "testForm",
    title: "Test Form",
    description: "This is a test form.",
  },
  components: [
    {
      type: FormComponentType.RADIO,
      props: {
        name: "radioQuestion",
        legend: "Select a time:",
        options: [
          { label: "Morning", value: "morning" },
          { label: "Afternoon", value: "afternoon" },
          { label: "Evening", value: "evening" },
          { label: "Other", value: "other", other: true },
        ],
        required: true,
      },
      version: "1",
    },
  ],
};
