import { Fragment } from "react";
import DatePickerSelector, {
  DatePickerSelectorProps,
} from "../Input/Date/DatePickerSelector";
import TimePickerSelector, {
  TimePickerSelectorProps,
} from "../Input/Date/TimePickerSelector";
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
}

export type QuestionBox = {
  questionType: QuestionType;
  props:
    | SeparatorProps
    | TextBoxProps
    | TextAreaProps
    | HorizontalItemsBoxProps
    | SelectBoxProps
    | RadioBoxProps
    | LinkedSelectorProps
    | DatePickerSelectorProps
    | TimePickerSelectorProps;
  version: string;
};

const FormsBuilder = ({
  header,
  questions,
  hasTermsAndConditions = false,
  onSubmit,
  onBack,
}: {
  header: FormsHeaderProps;
  questions: QuestionBox[];
  hasTermsAndConditions?: boolean;
  onBack?: () => void;
  onSubmit?: (formData: FormData) => void;
}) => {
  return (
    <FormBG onSubmit={onSubmit}>
      <FormsHeader {...header} />
      {questions.map((question, index) => {
        return (
          <Fragment key={header.title + "-question-fragment-" + index}>
            {question.questionType === QuestionType.LINKED_SELECTOR &&
            !(question.props as LinkedSelectorProps).horizontal ? (
              <QuestionBuilder question={question} />
            ) : (
              <QuestionBG>
                <QuestionBuilder question={question} />
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

const QuestionBuilder = ({ question }: { question: QuestionBox }) => {
  switch (question.questionType) {
    case QuestionType.SEPARATOR:
      return <Separator {...(question.props as SeparatorProps)} />;
    case QuestionType.TEXT:
      return <TextBox {...(question.props as TextBoxProps)} />;
    case QuestionType.HORIZONTAL_ITEMS:
      return (
        <HorizontalItemsBox {...(question.props as HorizontalItemsBoxProps)} />
      );
    case QuestionType.TEXTAREA:
      return <TextArea {...(question.props as TextAreaProps)} />;
    case QuestionType.RADIO:
      return <RadioBox {...(question.props as RadioBoxProps)} />;
    case QuestionType.SELECT:
      return <SelectBox {...(question.props as SelectBoxProps)} />;
    case QuestionType.DATE:
      return (
        <DatePickerSelector {...(question.props as DatePickerSelectorProps)} />
      );
    case QuestionType.TIME:
      return (
        <TimePickerSelector {...(question.props as TimePickerSelectorProps)} />
      );
    case QuestionType.LINKED_SELECTOR:
      return <LinkedSelector {...(question.props as LinkedSelectorProps)} />;

    default:
      return <div>Unknown Question Type</div>;
  }
};

export default FormsBuilder;
