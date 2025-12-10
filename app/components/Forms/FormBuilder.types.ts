import { DateSelectorProps } from "../Input/Date/DateSelector";
import { DateTimeSelectorProps } from "../Input/Date/DateTimeSelector";
import { TimeSelectorProps } from "../Input/Date/TimeSelector";
import { HorizontalItemsBoxProps } from "../Input/HorizontalItemsBox";
import { LinearScaleProps } from "../Input/LinearScale";
import { LinkedSelectorProps } from "../Input/LinkedSelector";
import { RadioBoxProps } from "../Input/RadioBox";
import { SelectBoxProps } from "../Input/SelectBox";
import { TextAreaProps } from "../Input/TextArea";
import { TextBoxProps } from "../Input/TextBox";
import { SeparatorProps } from "./Separator";

export enum FormComponentType {
  SEPARATOR = "SEPARATOR",
  TEXT = "TEXT",
  HORIZONTAL_ITEMS = "HORIZONTAL_ITEMS",
  TEXTAREA = "TEXTAREA",
  RADIO = "RADIO",
  SELECT = "SELECT",
  LINKED_SELECTOR = "LINKED_SELECTOR",
  DATE = "DATE",
  TIME = "TIME",
  DATETIME = "DATETIME",
  LINEAR_SCALE = "LINEAR_SCALE",
}

export type FormComponent =
  | {
      type: FormComponentType.SEPARATOR;
      props: SeparatorProps;
      version: string;
    }
  | {
      type: FormComponentType.TEXT;
      props: TextBoxProps;
      version: string;
    }
  | {
      type: FormComponentType.TEXTAREA;
      props: TextAreaProps;
      version: string;
    }
  | {
      type: FormComponentType.HORIZONTAL_ITEMS;
      props: HorizontalItemsBoxProps;
      version: string;
    }
  | {
      type: FormComponentType.RADIO;
      props: RadioBoxProps;
      version: string;
    }
  | {
      type: FormComponentType.SELECT;
      props: SelectBoxProps;
      version: string;
    }
  | {
      type: FormComponentType.LINKED_SELECTOR;
      props: LinkedSelectorProps;
      version: string;
    }
  | {
      type: FormComponentType.DATE;
      props: DateSelectorProps;
      version: string;
    }
  | {
      type: FormComponentType.TIME;
      props: TimeSelectorProps;
      version: string;
    }
  | {
      type: FormComponentType.DATETIME;
      props: DateTimeSelectorProps;
      version: string;
    }
  | {
      type: FormComponentType.LINEAR_SCALE;
      props: LinearScaleProps;
      version: string;
    };
