import { BuiltFormData } from "@/app/components/Forms/EditableFormBuilder";
import { FormComponentType } from "@/app/components/Forms/FormBuilder";
import { FormType } from "@/app/generated/prisma";
import z from "zod";

export const formTypeSchema = z.enum(FormType);

export function buildZodSchema(form: BuiltFormData) {
  const shape: Record<string, z.ZodTypeAny> = {};

  form.components.forEach((component) => {
    const { type, props } = component;
    const { name, required } = props as any;

    let field: z.ZodTypeAny;

    switch (type) {
      case FormComponentType.TEXT:
      case FormComponentType.TEXTAREA:
        field = z.string();
        break;

      case FormComponentType.SELECT:
        field = z.enum(
          (props as any).options.map((o: any) => o.value),
          "Invalid selection"
        );
        break;

      case FormComponentType.RADIO:
        field = z.enum((props as any).options.map((o: any) => o.value));
        break;

      case FormComponentType.LINEAR_SCALE:
        // Accept string or number, coerce to number
        field = z.coerce
          .number() // converts string to number if possible
          .min(props.min || 1)
          .max(props.max || 5);
        break;

      case FormComponentType.DATE:
        field = z.coerce.date(); // accepts string but converts to Date
        break;

      case FormComponentType.DATETIME:
        field = z.coerce.date(); // accepts string but converts to Date
        break;

      case FormComponentType.TIME:
        field = z
          .string()
          .regex(
            /^([01]\d|2[0-3]):([0-5]\d)(:[0-5]\d)?$/,
            "Invalid time format (expected HH:MM or HH:MM:SS)"
          );
        break;

      default:
        return; // ignore unsupported components
    }

    shape[name] = required ? field : field.optional();
  });

  if (form.termsAndConditions) {
    shape["termsAndConditions"] = z
      .string()
      .optional()
      .transform((val) => (val === "on" ? "on" : "off"))
      .refine((val) => val === "on", {
        message: "You must accept the terms and conditions",
      });
  }

  return z.object(shape);
}
