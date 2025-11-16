"use client";
import { useState } from "react";
import Divider from "../../Divider";
import Legend from "../../Input/Legend";
import SelectBox from "../../Input/SelectBox";
import TextArea from "../../Input/TextArea";
import TextBox from "../../Input/TextBox";
import Toggle from "../../Input/Toggle";
import { QuestionBox, QuestionType } from "../FormBuilder";
import QuestionBG from "../QuestionBG";
import EditableDateSelector from "./EditableDateSelector";
import EditableDateTimeSelector from "./EditableDateTimeSelector";
import EditableLinearScale from "./EditableLinearScale";
import EditableRadioBox from "./EditableRadioBox";
import EditableSelectBox from "./EditableSelectBox";
import { EditableTimeSettings } from "./EditableTimeSelector";

export type EditableQuestionBoxProps = {
  questionBox?: QuestionBox;
  selected?: boolean;
  onClick?: (id: string) => void;
};

const EditableQuestionBox = ({
  questionBox,
  onClick,
  selected = false,
}: EditableQuestionBoxProps) => {
  const [name, setName] = useState(
    questionBox && questionBox.props && questionBox.props.name
      ? questionBox.props.name
      : crypto.randomUUID()
  );
  const [required, setRequired] = useState(false);
  const [legend, setLegend] = useState(
    questionBox && questionBox.props && questionBox.props.legend
      ? questionBox.props.legend
      : "Edit your question here"
  );
  const [questionType, setQuestionType] = useState(
    questionBox && questionBox.questionType
      ? questionBox.questionType
      : QuestionType.TEXT
  );

  return (
    <QuestionBG
      className={`card w-full border-0 transition-all cursor-pointer 
          ${
            selected
              ? "border-primary border-l-4 shadow-lg"
              : "border-transparent"
          } p-4 py-4`}
      onClick={() => onClick?.(name)}
    >
      {/* Question Label */}
      {selected ? (
        <div className="flex flex-row w-full gap-2">
          <input
            className="p-2 bg-neutral border-b-1 border-primary no-outline w-full rounded-sm h-10"
            value={legend}
            onChange={(e) => setLegend(e.target.value)}
            placeholder="Edit question name here"
          />
          <SelectBox
            className="w-40 h-10 rounded-sm p-0 pl-1"
            bgColor="bg-neutral"
            name="questionType"
            options={[
              { label: "Short Answer", value: QuestionType.TEXT },
              { label: "Paragraph", value: QuestionType.TEXTAREA },
              {
                label: "Multiple Choice",
                value: QuestionType.RADIO,
              },
              { label: "Dropdown", value: QuestionType.SELECT },
              { label: "Date", value: QuestionType.DATE },
              { label: "Time", value: QuestionType.TIME },
              {
                label: "Date and Time",
                value: QuestionType.DATETIME,
              },
              {
                label: "Linear Scale",
                value: QuestionType.LINEAR_SCALE,
              },
            ]}
            value={questionType}
            onChange={(option) => setQuestionType(option.value as QuestionType)}
          />
        </div>
      ) : (
        <Legend legend={legend} required={!selected && required} />
      )}

      {/* Input Field */}
      <div className="mt-2 gap-2">
        {questionType === QuestionType.TEXT && (
          <TextBox name="preview" placeholder="Short answer text" readonly />
        )}
        {questionType === QuestionType.TEXTAREA && (
          <TextArea name="preview" placeholder="Long answer text" readonly />
        )}
        {questionType === QuestionType.RADIO && (
          <EditableRadioBox selected={selected} />
        )}
        {questionType === QuestionType.SELECT && (
          <EditableSelectBox selected={selected} />
        )}
        {questionType === QuestionType.DATE && (
          <EditableDateSelector selected={selected} />
        )}
        {questionType === QuestionType.TIME && (
          <EditableTimeSettings selected={selected} />
        )}
        {questionType === QuestionType.DATETIME && (
          <EditableDateTimeSelector selected={selected} />
        )}
        {questionType === QuestionType.LINEAR_SCALE && (
          <EditableLinearScale selected={selected} />
        )}
      </div>

      {/* Bottom Action Row */}
      {selected && (
        <>
          <Divider className="mt-2" />
          <div className="flex justify-between items-center mt-3">
            <div className="flex gap-2">
              <button className="btn btn-ghost btn-xs text-base-content/50">
                Duplicate
              </button>
              <button className="btn btn-ghost btn-xs text-error">
                Delete
              </button>
            </div>

            {/* Required Toggle */}
            <Toggle
              isChecked={required}
              onToggle={(value) => setRequired(value)}
              leftText
              size="toggle-sm"
              fontWeight="font-normal"
              onText="Required"
              offText="Required"
            />
          </div>
        </>
      )}
    </QuestionBG>
  );
};

export default EditableQuestionBox;
