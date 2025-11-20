"use client";
import { FormComponentType } from "../Forms/FormBuilder";
import InputInterface from "./InputInterface";
import Legend from "./Legend";
import RadioBox, { RadioBoxProps } from "./RadioBox";
import SelectBox, { SelectBoxProps } from "./SelectBox";
import TextBox, { TextBoxProps } from "./TextBox";

export type HorizontalBoxItem =
  | { type: FormComponentType.TEXT; props: TextBoxProps }
  | { type: FormComponentType.RADIO; props: RadioBoxProps }
  | { type: FormComponentType.SELECT; props: SelectBoxProps };

export type HorizontalItemsBoxProps = InputInterface & {
  items: HorizontalBoxItem[];
};

const HorizontalItemsBox = ({
  items,
  legend,
  required = items.some((item) => item.props.required),
  number,
  className,
  readonly = false,
  noFormOutput = false,
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
              noFormOutput={noFormOutput}
              readOnly={readonly}
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
  readOnly,
}: {
  item: HorizontalBoxItem;
  noFormOutput?: boolean;
  readOnly?: boolean;
}) {
  switch (item.type) {
    case FormComponentType.TEXT:
      return (
        <TextBox
          {...item.props}
          noFormOutput={noFormOutput}
          readonly={readOnly}
        />
      );
    case FormComponentType.RADIO:
      return (
        <RadioBox
          {...item.props}
          noFormOutput={noFormOutput}
          readonly={readOnly}
        />
      );
    case FormComponentType.SELECT:
      return (
        <SelectBox
          {...item.props}
          noFormOutput={noFormOutput}
          readonly={readOnly}
        />
      );
  }
}

export default HorizontalItemsBox;
