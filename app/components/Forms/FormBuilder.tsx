import { Fragment } from "react";
import DateSelector, { DateSelectorProps } from "../Input/Date/DateSelector";
import DateTimeSelector, {
  DateTimeSelectorProps,
} from "../Input/Date/DateTimeSelector";
import TimeSelector, { TimeSelectorProps } from "../Input/Date/TimeSelector";
import { getTimeFromDate, stringToTime } from "../Input/Date/utils";
import HorizontalItemsBox, {
  HorizontalItemsBoxProps,
} from "../Input/HorizontalItemsBox";
import LinearScale, { LinearScaleProps } from "../Input/LinearScale";
import LinkedSelector, { LinkedSelectorProps } from "../Input/LinkedSelector";
import RadioBox, { RadioBoxProps } from "../Input/RadioBox";
import SelectBox, { SelectBoxProps } from "../Input/SelectBox";
import TermsAndConditions from "../Input/TermsAndConditions";
import TextArea, { TextAreaProps } from "../Input/TextArea";
import TextBox, { TextBoxProps } from "../Input/TextBox";
import { BuiltFormData } from "./EditableFormBuilder";
import FormBG from "./FormBG";
import FormComponentBG from "./FormComponentBG";
import FormsHeader from "./FormsHeader";
import Separator, { SeparatorProps } from "./Separator";
import Submit from "./Submit";

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

const FormsBuilder = ({
  form,
  defaultValues,
  onSubmit,
  onBack,
  readOnly = false,
}: {
  form: BuiltFormData;
  onBack?: () => void;
  onSubmit?: (formData: FormData) => void;
  defaultValues?: Record<string, any>;
  readOnly?: boolean;
}) => {
  const { header, components } = form;

  return (
    <FormBG onSubmit={onSubmit}>
      {!readOnly && (
        <FormComponentBG>
          <FormsHeader {...header} />
        </FormComponentBG>
      )}
      {components.map((component, index) => {
        return (
          <Fragment key={header.title + "-component-fragment-" + index}>
            {component.type === FormComponentType.LINKED_SELECTOR &&
            !(component.props as LinkedSelectorProps).horizontal ? (
              <FormComponentBuilder
                component={component}
                answer={
                  defaultValues
                    ? defaultValues[component.props.name]
                    : undefined
                }
                readOnly={readOnly}
              />
            ) : (
              <FormComponentBG>
                <FormComponentBuilder
                  component={component}
                  answer={
                    defaultValues
                      ? defaultValues[component.props.name]
                      : undefined
                  }
                  readOnly={readOnly}
                />
              </FormComponentBG>
            )}
          </Fragment>
        );
      })}
      {!readOnly && (
        <>
          {form.termsAndConditions && (
            <FormComponentBG className="py-5">
              <TermsAndConditions />
            </FormComponentBG>
          )}

          <FormComponentBG className="py-5 px-5">
            <Submit onBack={onBack} />
          </FormComponentBG>
        </>
      )}
    </FormBG>
  );
};

export const FormComponentBuilder = ({
  component,
  answer,
  readOnly,
}: {
  component: FormComponent;
  answer?: any;
  readOnly?: boolean;
}) => {
  switch (component.type) {
    case FormComponentType.SEPARATOR:
      return <Separator {...(component.props as SeparatorProps)} />;
    case FormComponentType.TEXT:
      return (
        <TextBox
          {...(component.props as TextBoxProps)}
          defaultValue={answer}
          readonly={readOnly}
        />
      );
    case FormComponentType.HORIZONTAL_ITEMS:
      return (
        <HorizontalItemsBox
          {...(component.props as HorizontalItemsBoxProps)}
          readonly={readOnly}
        />
      );
    case FormComponentType.TEXTAREA:
      return (
        <TextArea
          {...(component.props as TextAreaProps)}
          defaultValue={answer}
          readonly={readOnly}
        />
      );
    case FormComponentType.RADIO:
      return (
        <RadioBox
          {...(component.props as RadioBoxProps)}
          defaultValue={answer ? (answer as object).toString() : undefined}
          readonly={readOnly}
        />
      );
    case FormComponentType.SELECT:
      return (
        <SelectBox
          {...(component.props as SelectBoxProps)}
          defaultValue={answer ? (answer as object).toString() : undefined}
          readonly={readOnly}
        />
      );
    case FormComponentType.DATE:
      return (
        <DateSelector
          {...(component.props as DateSelectorProps)}
          value={
            answer
              ? answer === "now"
                ? new Date()
                : new Date(answer)
              : undefined
          }
          readonly={readOnly}
        />
      );
    case FormComponentType.TIME:
      return (
        <TimeSelector
          {...(component.props as TimeSelectorProps)}
          value={
            answer
              ? answer === "now"
                ? getTimeFromDate(new Date())
                : stringToTime(answer)
              : undefined
          }
          readonly={readOnly}
        />
      );
    case FormComponentType.LINKED_SELECTOR:
      return <LinkedSelector {...(component.props as LinkedSelectorProps)} />;
    case FormComponentType.DATETIME:
      return (
        <DateTimeSelector
          {...(component.props as DateTimeSelectorProps)}
          defaultValue={
            answer
              ? answer === "now"
                ? new Date()
                : new Date(answer)
              : undefined
          }
          readonly={readOnly}
        />
      );
    case FormComponentType.LINEAR_SCALE:
      return (
        <LinearScale
          {...(component.props as LinearScaleProps)}
          defaultValue={answer}
          readonly={readOnly}
        />
      );

    default:
      return <div>Unknown Component Type</div>;
  }
};

export default FormsBuilder;
