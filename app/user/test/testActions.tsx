"use server";

import ActionResult from "@/app/components/ActionResult";
import { BuiltFormData } from "@/app/components/Forms/EditableFormBuilder";
import { FormComponentType } from "@/app/components/Forms/FormBuilder";
import { bookingQuestions } from "@/app/pages/Appointment/Question";
import { buildZodSchema } from "@/app/pages/Forms/schema";
import { prettifyError } from "zod";

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

export async function testAction(
  formData: FormData
): Promise<ActionResult<void>> {
  try {
    const data = Object.fromEntries(formData.entries());
    data["termsAndConditions"] = "off"; // to simulate unchecked box
    console.log("Form data submitted:", data);
    const schema = buildZodSchema(form);
    const validation = schema.safeParse(data);
    if (!validation.success) {
      console.error("Validation errors:", prettifyError(validation.error));
      throw new Error("Validation errors: " + prettifyError(validation.error));
    }
    console.log("Successful validation:", validation.data);
    return { success: true };
  } catch (error) {
    console.error("Error in testAction:", error);
    return {
      success: false,
      message: "Error in testAction " + (error as Error).message,
    };
  }
}
