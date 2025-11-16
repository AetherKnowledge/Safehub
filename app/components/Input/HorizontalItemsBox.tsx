"use client";
import { QuestionType } from "../Forms/FormBuilder";
import InputInterface from "./InputInterface";
import Legend from "./Legend";
import RadioBox, { RadioBoxProps } from "./RadioBox";
import SelectBox, { SelectBoxProps } from "./SelectBox";
import TextBox, { TextBoxProps } from "./TextBox";

export type HorizontalBoxItem =
  | { type: QuestionType.TEXT; props: TextBoxProps }
  | { type: QuestionType.RADIO; props: RadioBoxProps }
  | { type: QuestionType.SELECT; props: SelectBoxProps };

export type HorizontalItemsBoxProps = InputInterface & {
  items: HorizontalBoxItem[];
};

const HorizontalItemsBox = ({
  items,
  legend,
  required = items.some((item) => item.props.required),
  number,
  className,
}: HorizontalItemsBoxProps) => {
  return (
    <>
      <fieldset className="fieldset w-full">
        {legend && (
          <Legend legend={legend} required={required} number={number} />
        )}
        <div className={`flex flex-row gap-2 ${className}`}>
          {items.map((item, index) => (
            <HorizontalItemBuilder
              key={item.props.name + "-" + index}
              item={item}
            />
          ))}
        </div>
      </fieldset>
    </>
  );
};

function HorizontalItemBuilder({
  item,
  noFormOutput,
}: {
  item: HorizontalBoxItem;
  noFormOutput?: boolean;
}) {
  switch (item.type) {
    case QuestionType.TEXT:
      return <TextBox {...item.props} noFormOutput={noFormOutput} />;
    case QuestionType.RADIO:
      return <RadioBox {...item.props} noFormOutput={noFormOutput} />;
    case QuestionType.SELECT:
      return <SelectBox {...item.props} noFormOutput={noFormOutput} />;
  }
}

export default HorizontalItemsBox;
