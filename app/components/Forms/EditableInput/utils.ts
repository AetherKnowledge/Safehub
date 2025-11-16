import { Time } from "../../Input/Date/utils";
import { Option } from "../../Input/InputInterface";
import { FormComponent, FormComponentType } from "../FormBuilder";

export const getNextOptionName = (options: Option[]) => {
  let num = options.length + 1;

  const existing = new Set(options.map((o) => o.label.toLowerCase().trim()));

  while (existing.has(`option ${num}`)) {
    num++;
  }

  return num;
};

export type SaveableSettings = {
  type: FormComponentType;
  name?: string;
  legend?: string;
  required?: boolean;
  options?: Option[];
  minTime?: Time;
  maxTime?: Time;
  minDate?: Date;
};

export function createFormComponent({
  type,
  name = crypto.randomUUID(),
  legend = "Edit your question here",
  required,
  options = [
    { label: "Option 1", value: "Option 1" },
    { label: "Option 2", value: "Option 2" },
  ],
  minTime,
  maxTime,
  minDate,
}: SaveableSettings): FormComponent {
  switch (type) {
    case FormComponentType.TEXT:
      return {
        type: FormComponentType.TEXT,
        props: { name, legend, required },
        version: "1",
      } as FormComponent;

    case FormComponentType.TEXTAREA:
      return {
        type: FormComponentType.TEXTAREA,
        props: { name, legend, required },
        version: "1",
      } as FormComponent;

    case FormComponentType.RADIO:
      return {
        type: FormComponentType.RADIO,
        props: { name, legend, required, options },
        version: "1",
      } as FormComponent;

    case FormComponentType.SELECT:
      return {
        type: FormComponentType.SELECT,
        props: { name, legend, required, options },
        version: "1",
      } as FormComponent;

    case FormComponentType.DATE:
      return {
        type: FormComponentType.DATE,
        props: { name, legend, required, minDate },
        version: "1",
      } as FormComponent;

    case FormComponentType.TIME:
      return {
        type: FormComponentType.TIME,
        props: { name, legend, required, minTime, maxTime },
        version: "1",
      } as FormComponent;

    case FormComponentType.DATETIME:
      return {
        type: FormComponentType.DATETIME,
        props: { name, legend, required, minDate, minTime, maxTime },
        version: "1",
      } as FormComponent;

    case FormComponentType.LINEAR_SCALE:
      return {
        type: FormComponentType.LINEAR_SCALE,
        props: {
          name,
          legend,
          required,
          min: 1,
          max: 5,
        },
        version: "1",
      } as FormComponent;

    case FormComponentType.SEPARATOR:
      return {
        type: FormComponentType.SEPARATOR,
        props: { name, legend: "Separator" },
        version: "1",
      } as FormComponent;

    default:
      return {
        type: FormComponentType.TEXT,
        props: { name, legend, required },
        version: "1",
      } as FormComponent;
  }
}
