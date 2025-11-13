"use client";
import { useState } from "react";
import { QuestionType } from "../Forms/FormBuilder";
import QuestionBG from "../Forms/QuestionBG";
import { Option } from "./InputInterface";
import Legend from "./Legend";
import RadioBox, { RadioBoxProps } from "./RadioBox";
import SelectBox, { SelectBoxProps } from "./SelectBox";

export interface LinkedOption {
  parentOption: Option;
  childOptions: Option[];
}

type LinkedQuestion =
  | {
      type: QuestionType.SELECT;
      props: SelectBoxProps;
    }
  | {
      type: QuestionType.RADIO;
      props: RadioBoxProps;
    };

export type LinkedSelectorProps = {
  name: string;
  parent: LinkedQuestion;
  child: LinkedQuestion;
  linkedOptions: LinkedOption[];
  horizontal?: boolean;
  // only works if horizontal is true
  legend?: string;
  required?: boolean;
  number?: number;
};

const LinkedSelector = ({
  parent,
  child,
  linkedOptions,
  horizontal = false,
  legend,
  required = false,
  number,
}: LinkedSelectorProps) => {
  const [parentOptions, setParentOptions] = useState<Option[]>(
    linkedOptions.map((lo) => lo.parentOption)
  );
  const [childOptions, setChildOptions] = useState<Option[]>([]);

  const handleParentChange = (option: Option) => {
    setChildOptions(
      linkedOptions.find((lo) => lo.parentOption.value === option.value)
        ?.childOptions || []
    );
  };

  return (
    <>
      {horizontal ? (
        <fieldset className="fieldset w-full">
          {legend && (
            <Legend legend={legend} required={required} number={number} />
          )}
          <div className="flex flex-row gap-2">
            <LinkedQuestionBuilder
              linkedQuestion={parent}
              options={parentOptions}
              onChange={handleParentChange}
            />
            <LinkedQuestionBuilder
              linkedQuestion={child}
              options={childOptions}
            />
          </div>
        </fieldset>
      ) : (
        <>
          <QuestionBG>
            <LinkedQuestionBuilder
              linkedQuestion={parent}
              options={parentOptions}
              onChange={handleParentChange}
            />
          </QuestionBG>
          <QuestionBG>
            <LinkedQuestionBuilder
              linkedQuestion={child}
              options={childOptions}
            />
          </QuestionBG>{" "}
        </>
      )}
    </>
  );
};

const LinkedQuestionBuilder = ({
  linkedQuestion,
  options,
  onChange,
}: {
  linkedQuestion: LinkedQuestion;
  options: Option[];
  onChange?: (value: Option) => void;
}) => {
  switch (linkedQuestion.type) {
    case QuestionType.SELECT:
      return (
        <SelectBox
          {...(linkedQuestion.props as SelectBoxProps)}
          options={options}
          onChange={onChange}
        />
      );
    case QuestionType.RADIO:
      return (
        <RadioBox
          {...(linkedQuestion.props as RadioBoxProps)}
          options={options}
          onChange={onChange}
        />
      );
    default:
      return <div>Unknown Question Type</div>;
  }
};

export default LinkedSelector;
