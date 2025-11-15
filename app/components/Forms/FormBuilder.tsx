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
import LinkedSelector, { LinkedSelectorProps } from "../Input/LinkedSelector";
import RadioBox, { RadioBoxProps } from "../Input/RadioBox";
import SelectBox, { SelectBoxProps } from "../Input/SelectBox";
import TermsAndConditions from "../Input/TermsAndConditions";
import TextArea, { TextAreaProps } from "../Input/TextArea";
import TextBox, { TextBoxProps } from "../Input/TextBox";
import FormBG from "./FormBG";
import FormsHeader, { FormsHeaderProps } from "./FormsHeader";
import QuestionBG from "./QuestionBG";
import Separator, { SeparatorProps } from "./Separator";
import Submit from "./Submit";

export enum QuestionType {
  SEPARATOR,
  TEXT,
  HORIZONTAL_ITEMS,
  TEXTAREA,
  RADIO,
  SELECT,
  LINKED_SELECTOR,
  DATE,
  TIME,
  DATETIME,
}

export type QuestionBox =
  | {
      questionType: QuestionType.SEPARATOR;
      props: SeparatorProps;
      version: string;
    }
  | { questionType: QuestionType.TEXT; props: TextBoxProps; version: string }
  | {
      questionType: QuestionType.TEXTAREA;
      props: TextAreaProps;
      version: string;
    }
  | {
      questionType: QuestionType.HORIZONTAL_ITEMS;
      props: HorizontalItemsBoxProps;
      version: string;
    }
  | { questionType: QuestionType.RADIO; props: RadioBoxProps; version: string }
  | {
      questionType: QuestionType.SELECT;
      props: SelectBoxProps;
      version: string;
    }
  | {
      questionType: QuestionType.LINKED_SELECTOR;
      props: LinkedSelectorProps;
      version: string;
    }
  | {
      questionType: QuestionType.DATE;
      props: DateSelectorProps;
      version: string;
    }
  | {
      questionType: QuestionType.TIME;
      props: TimeSelectorProps;
      version: string;
    }
  | {
      questionType: QuestionType.DATETIME;
      props: DateTimeSelectorProps;
      version: string;
    };

const FormsBuilder = ({
  header,
  questions,
  defaultValues,
  hasTermsAndConditions = false,
  onSubmit,
  onBack,
}: {
  header: FormsHeaderProps;
  questions: QuestionBox[];
  hasTermsAndConditions?: boolean;
  onBack?: () => void;
  onSubmit?: (formData: FormData) => void;
  defaultValues?: Record<string, any>;
}) => {
  return (
    <FormBG onSubmit={onSubmit}>
      <FormsHeader {...header} />
      {questions.map((question, index) => {
        return (
          <Fragment key={header.title + "-question-fragment-" + index}>
            {question.questionType === QuestionType.LINKED_SELECTOR &&
            !(question.props as LinkedSelectorProps).horizontal ? (
              <QuestionBuilder
                question={question}
                answer={
                  defaultValues ? defaultValues[question.props.name] : undefined
                }
              />
            ) : (
              <QuestionBG>
                <QuestionBuilder
                  question={question}
                  answer={
                    defaultValues
                      ? defaultValues[question.props.name]
                      : undefined
                  }
                />
              </QuestionBG>
            )}
          </Fragment>
        );
      })}
      {hasTermsAndConditions && (
        <QuestionBG className="py-5">
          <TermsAndConditions />
        </QuestionBG>
      )}

      <Submit onBack={onBack} />
    </FormBG>
  );
};

const QuestionBuilder = ({
  question,
  answer,
}: {
  question: QuestionBox;
  answer?: any;
}) => {
  switch (question.questionType) {
    case QuestionType.SEPARATOR:
      return <Separator {...(question.props as SeparatorProps)} />;
    case QuestionType.TEXT:
      return (
        <TextBox {...(question.props as TextBoxProps)} defaultValue={answer} />
      );
    case QuestionType.HORIZONTAL_ITEMS:
      return (
        <HorizontalItemsBox {...(question.props as HorizontalItemsBoxProps)} />
      );
    case QuestionType.TEXTAREA:
      return (
        <TextArea
          {...(question.props as TextAreaProps)}
          defaultValue={answer}
        />
      );
    case QuestionType.RADIO:
      return (
        <RadioBox
          {...(question.props as RadioBoxProps)}
          defaultValue={answer ? (answer as Object).toString() : undefined}
        />
      );
    case QuestionType.SELECT:
      return (
        <SelectBox
          {...(question.props as SelectBoxProps)}
          defaultValue={answer ? (answer as Object).toString() : undefined}
        />
      );
    case QuestionType.DATE:
      return (
        <DateSelector
          {...(question.props as DateSelectorProps)}
          value={
            answer
              ? answer === "now"
                ? new Date()
                : new Date(answer)
              : undefined
          }
        />
      );
    case QuestionType.TIME:
      return (
        <TimeSelector
          {...(question.props as TimeSelectorProps)}
          value={
            answer
              ? answer === "now"
                ? getTimeFromDate(new Date())
                : stringToTime(answer)
              : undefined
          }
        />
      );
    case QuestionType.LINKED_SELECTOR:
      return <LinkedSelector {...(question.props as LinkedSelectorProps)} />;
    case QuestionType.DATETIME:
      return (
        <DateTimeSelector
          {...(question.props as DateTimeSelectorProps)}
          defaultValue={
            answer
              ? answer === "now"
                ? new Date()
                : new Date(answer)
              : undefined
          }
        />
      );

    default:
      return <div>Unknown Question Type</div>;
  }
};

export default FormsBuilder;
