"use server";

import ActionResult from "@/app/components/ActionResult";
import { BuiltFormData } from "@/app/components/Forms/EditableFormBuilder";
import { FormType, UserType } from "@/app/generated/prisma";
import { auth } from "@/auth";
import { prisma } from "@/prisma/client";
import { formTypeSchema } from "./schema";

export async function fetchForms(
  formType: FormType
): Promise<ActionResult<BuiltFormData | undefined>> {
  try {
    const session = await auth();
    if (!session?.user) {
      return { success: false, message: "Unauthorized" };
    }
    const validation = formTypeSchema.safeParse(formType);
    if (!validation.success) {
      return { success: false, message: "Invalid form type" };
    }

    const formData = await prisma.formSchema.findUnique({
      where: { type: validation.data },
    });
    if (!formData) {
      return { success: true, data: undefined };
    }

    const builtFormData: BuiltFormData | undefined = JSON.parse(
      JSON.stringify(formData.schema)
    );

    return { success: true, data: builtFormData };
  } catch (error) {
    console.error("Error fetching forms:", error);
    return { success: false, message: "Failed to fetch forms" };
  }
}

export async function saveForms(
  formType: FormType,
  builtFormData: BuiltFormData
): Promise<ActionResult<void>> {
  try {
    const session = await auth();
    if (!session?.user || session.user.type !== UserType.Admin) {
      return { success: false, message: "Unauthorized" };
    }
    const validation = formTypeSchema.safeParse(formType);
    if (!validation.success) {
      return { success: false, message: "Invalid form type" };
    }

    const jsonFormData = JSON.parse(JSON.stringify(builtFormData));

    await prisma.formSchema.upsert({
      where: { type: validation.data },
      update: { schema: jsonFormData },
      create: { type: validation.data, schema: jsonFormData },
    });

    return { success: true };
  } catch (error) {
    console.error("Error fetching forms:", error);
    return { success: false, message: "Failed to fetch forms" };
  }
}
