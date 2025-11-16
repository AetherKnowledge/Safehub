"use client";
import { useState } from "react";
import { FormComponentType } from "../Forms/FormBuilder";
import FormComponentBG from "../Forms/FormComponentBG";
import InputInterface, { Option } from "./InputInterface";
import Legend from "./Legend";
import RadioBox, { RadioBoxProps } from "./RadioBox";
import SelectBox, { SelectBoxProps } from "./SelectBox";

export interface LinkedOption {
  parentOption: Option;
  childOptions: Option[];
}

type LinkedComponent =
  | {
      type: FormComponentType.SELECT;
      props: SelectBoxProps;
    }
  | {
      type: FormComponentType.RADIO;
      props: RadioBoxProps;
    };

export type LinkedSelectorProps = InputInterface & {
  parent: LinkedComponent;
  child: LinkedComponent;
  linkedOptions: LinkedOption[];

  // numbering and legend only works if horizontal is true
  horizontal?: boolean;
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
            <LinkedComponentBuilder
              linkedComponent={parent}
              options={parentOptions}
              onChange={handleParentChange}
            />
            <LinkedComponentBuilder
              linkedComponent={child}
              options={childOptions}
            />
          </div>
        </fieldset>
      ) : (
        <>
          <FormComponentBG>
            <LinkedComponentBuilder
              linkedComponent={parent}
              options={parentOptions}
              onChange={handleParentChange}
            />
          </FormComponentBG>
          <FormComponentBG>
            <LinkedComponentBuilder
              linkedComponent={child}
              options={childOptions}
            />
          </FormComponentBG>{" "}
        </>
      )}
    </>
  );
};

const LinkedComponentBuilder = ({
  linkedComponent,
  options,
  onChange,
  noFormOutput,
}: {
  linkedComponent: LinkedComponent;
  options: Option[];
  onChange?: (value: Option) => void;
  noFormOutput?: boolean;
}) => {
  switch (linkedComponent.type) {
    case FormComponentType.SELECT:
      return (
        <SelectBox
          {...(linkedComponent.props as SelectBoxProps)}
          options={options}
          onChange={onChange}
        />
      );
    case FormComponentType.RADIO:
      return (
        <RadioBox
          {...(linkedComponent.props as RadioBoxProps)}
          options={options}
          onChange={onChange}
        />
      );
    default:
      return <div>Unknown Question Type</div>;
  }
};

export default LinkedSelector;
