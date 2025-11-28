import { BuiltFormData } from "@/app/components/Forms/EditableFormBuilder";
import { FormComponentType } from "@/app/components/Forms/FormBuilder";
import { DateSelectorProps } from "@/app/components/Input/Date/DateSelector";
import { DateTimeSelectorProps } from "@/app/components/Input/Date/DateTimeSelector";
import { TimeSelectorProps } from "@/app/components/Input/Date/TimeSelector";
import {
  setTimeToDate,
  stringToTime,
  timeToMinutes,
} from "@/app/components/Input/Date/utils";
import { Option } from "@/app/components/Input/InputInterface";
import { LinearScaleProps } from "@/app/components/Input/LinearScale";
import { RadioBoxProps } from "@/app/components/Input/RadioBox";
import { ExtraOptions } from "@/app/components/Input/schema";
import { SelectBoxProps } from "@/app/components/Input/SelectBox";
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
        if (
          (props as SelectBoxProps).extraOptions === ExtraOptions.COUNSELOR_LIST
        ) {
          field = z.uuid();
          break;
        }

        field = z.enum(
          (props as SelectBoxProps).options.map((o: any) => o.value),
          "Invalid selection"
        );
        break;

      case FormComponentType.RADIO: {
        const options = (props as RadioBoxProps).options as Option[];

        const normalValues = options
          .filter((o) => !o.other)
          .map((o) => o.value);

        const hasOther = options.some((o) => o.other);

        // If "other" exists → allow any string
        if (hasOther) {
          field = z.union([z.enum(normalValues), z.string().min(1)]);
        } else {
          // Normal behavior: enum only
          field = z.enum(normalValues);
        }

        break;
      }

      case FormComponentType.LINEAR_SCALE:
        // Accept string or number, coerce to number
        field = z.coerce
          .number() // converts string to number if possible
          .min((props as LinearScaleProps).min || 1)
          .max((props as LinearScaleProps).max || 5);
        break;

      case FormComponentType.DATE: {
        let dateField = z.coerce.date();
        const dateProps = props as DateSelectorProps;

        if (dateProps.minDate) {
          const min =
            dateProps.minDate === "now"
              ? new Date()
              : new Date(dateProps.minDate);
          min.setHours(0, 0, 0, 0);
          dateField = dateField.min(min, { message: "Date is too early" });
        }

        if (dateProps.maxDate) {
          const max = new Date(dateProps.maxDate);
          max.setHours(23, 59, 59, 999);
          dateField = dateField.max(max, { message: "Date is too late" });
        }

        if (dateProps.disableSunday) {
          field = dateField.refine((date: any) => date.getDay() !== 0, {
            message: "Sundays are not allowed",
          });
        } else {
          field = dateField;
        }
        break;
      }

      case FormComponentType.DATETIME: {
        let dateTimeField = z.coerce.date();
        const dateTimeProps = props as DateTimeSelectorProps;

        if (dateTimeProps.minDate) {
          let min =
            dateTimeProps.minDate === "now"
              ? new Date()
              : new Date(dateTimeProps.minDate);

          if (dateTimeProps.minTime) {
            if (dateTimeProps.minTime === "now") {
              const now = new Date();
              min.setHours(now.getHours(), now.getMinutes(), 0, 0);
            } else {
              min = setTimeToDate(min, dateTimeProps.minTime);
            }
          }

          dateTimeField = dateTimeField.min(min, {
            message: "Date is too early",
          });
        }

        if (dateTimeProps.maxDate) {
          let max = new Date(dateTimeProps.maxDate);

          if (dateTimeProps.maxTime) {
            max = setTimeToDate(max, dateTimeProps.maxTime);
          }

          dateTimeField = dateTimeField.max(max, {
            message: "Date is too late",
          });
        }

        if (dateTimeProps.disableSunday) {
          field = dateTimeField.refine((date: any) => date.getDay() !== 0, {
            message: "Sundays are not allowed",
          });
        } else {
          field = dateTimeField;
        }
        break;
      }

      case FormComponentType.TIME: {
        field = z
          .string()
          .regex(
            /^([01]\d|2[0-3]):([0-5]\d)(:[0-5]\d)?$/,
            "Invalid time format (expected HH:MM or HH:MM:SS)"
          );

        const timeProps = props as TimeSelectorProps;

        if (timeProps.minTime) {
          field = field.refine(
            (val: any) => {
              const t = stringToTime(val);
              return timeToMinutes(t) >= timeToMinutes(timeProps.minTime!);
            },
            { message: "Time is too early" }
          );
        }

        if (timeProps.maxTime) {
          field = field.refine(
            (val: any) => {
              const t = stringToTime(val);
              return timeToMinutes(t) <= timeToMinutes(timeProps.maxTime!);
            },
            { message: "Time is too late" }
          );
        }
        break;
      }

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
