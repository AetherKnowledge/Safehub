"use server";

import ActionResult from "@/app/components/ActionResult";
import { buildZodSchema } from "@/app/pages/Forms/schema";
import { prettifyError } from "zod";
import { testForm } from "./question";

export async function testAction(
  formData: FormData
): Promise<ActionResult<void>> {
  try {
    const data = Object.fromEntries(formData.entries());
    // data["termsAndConditions"] = "off"; // to simulate unchecked box
    console.log("Form data submitted:", data);
    const schema = buildZodSchema(testForm);
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
