"use client";
import { useState } from "react";
import Divider from "../../Divider";
import Legend from "../../Input/Legend";
import SelectBox from "../../Input/SelectBox";
import TextArea from "../../Input/TextArea";
import TextBox from "../../Input/TextBox";
import Toggle from "../../Input/Toggle";
import { FormComponent, FormComponentType } from "../FormBuilder";
import FormComponentBG from "../FormComponentBG";
import EditableDateSelector from "./EditableDateSelector";
import EditableDateTimeSelector from "./EditableDateTimeSelector";
import EditableLinearScale from "./EditableLinearScale";
import EditableRadioBox from "./EditableRadioBox";
import EditableSelectBox from "./EditableSelectBox";
import EditableTimeSelector from "./EditableTimeSelector";

export type EditableFormComponentProps = {
  defaultValue?: FormComponent;
  selected?: boolean;
  onClick?: (id: string) => void;
};

const EditableFormComponent = ({
  defaultValue,
  onClick,
  selected = false,
}: EditableFormComponentProps) => {
  const [component, setComponent] = useState<FormComponent>(
    defaultValue ?? getDefaultProps(FormComponentType.TEXT)
  );

  return (
    <FormComponentBG
      className={`card w-full border-0 transition-all cursor-pointer 
          ${
            selected
              ? "border-primary border-l-4 shadow-lg"
              : "border-transparent"
          } p-4 py-4`}
      onClick={() => onClick?.(component.props?.name)}
    >
      {/* Component Label */}
      {selected ? (
        <div className="flex flex-row w-full gap-2">
          <input
            className="p-2 bg-neutral border-b-1 border-primary no-outline w-full rounded-sm h-10"
            value={component.props?.legend || "Edit your question here"}
            onChange={(e) => {
              setComponent({
                ...component,
                // @ts-expect-error TypeScript cannot infer this type correctly
                props: {
                  ...component.props,
                  legend: e.target.value,
                },
              });
            }}
            placeholder="Edit component name here"
          />
          <SelectBox
            className="w-40 h-10 rounded-sm p-0 pl-1"
            bgColor="bg-neutral"
            name="componentType"
            options={[
              { label: "Short Answer", value: FormComponentType.TEXT },
              { label: "Paragraph", value: FormComponentType.TEXTAREA },
              {
                label: "Multiple Choice",
                value: FormComponentType.RADIO,
              },
              { label: "Dropdown", value: FormComponentType.SELECT },
              { label: "Date", value: FormComponentType.DATE },
              { label: "Time", value: FormComponentType.TIME },
              {
                label: "Date and Time",
                value: FormComponentType.DATETIME,
              },
              {
                label: "Linear Scale",
                value: FormComponentType.LINEAR_SCALE,
              },
            ]}
            value={component.type}
            onChange={(option) => {
              if (option.value === component.type) return;

              setComponent((prev) =>
                getDefaultProps(
                  option.value as FormComponentType,
                  prev.props?.name
                )
              );
            }}
          />
        </div>
      ) : (
        <Legend
          legend={component.props?.legend ?? "Edit your question here"}
          required={!selected && component.props?.required}
        />
      )}

      {/* Input Field */}
      <div className="mt-2 gap-2">
        {component.type === FormComponentType.TEXT && (
          <TextBox name="preview" placeholder="Short answer text" readonly />
        )}
        {component.type === FormComponentType.TEXTAREA && (
          <TextArea name="preview" placeholder="Long answer text" readonly />
        )}
        {component.type === FormComponentType.RADIO && (
          <EditableRadioBox
            selected={selected}
            onChange={(options) => {
              setComponent({
                ...component,
                props: {
                  ...component.props,
                  options: options,
                },
              });
            }}
          />
        )}
        {component.type === FormComponentType.SELECT && (
          <EditableSelectBox
            selected={selected}
            options={component.props?.options || []}
            onChange={(options) => {
              console.log("Options changed:", options);
              setComponent({
                ...component,
                props: {
                  ...component.props,
                  options: options,
                },
              });
            }}
          />
        )}
        {component.type === FormComponentType.DATE && (
          <EditableDateSelector
            selected={selected}
            settings={component?.props}
            onChange={(settings) => {
              setComponent({
                ...component,
                props: {
                  ...component.props,
                  ...settings,
                },
              });
            }}
          />
        )}
        {component.type === FormComponentType.TIME && (
          <EditableTimeSelector
            selected={selected}
            settings={component?.props}
            onChange={(settings) => {
              setComponent({
                ...component,
                props: {
                  ...component.props,
                  ...settings,
                },
              });
            }}
          />
        )}
        {component.type === FormComponentType.DATETIME && (
          <EditableDateTimeSelector
            selected={selected}
            settings={component?.props}
            onChange={(settings) => {
              setComponent({
                ...component,
                props: {
                  ...component.props,
                  ...settings,
                },
              });
            }}
          />
        )}
        {component.type === FormComponentType.LINEAR_SCALE && (
          <EditableLinearScale
            selected={selected}
            settings={component.props}
            onChange={(settings) => {
              setComponent({
                ...component,
                props: {
                  ...component.props,
                  ...settings,
                },
              });
            }}
          />
        )}
      </div>

      {/* Bottom Action Row */}
      {selected && (
        <>
          <Divider className="mt-2" />
          <div className="flex justify-between items-center mt-3">
            <div className="flex gap-2">
              <button
                type="button"
                className="btn btn-ghost btn-xs text-base-content/50"
              >
                Duplicate
              </button>
              <button type="button" className="btn btn-ghost btn-xs text-error">
                Delete
              </button>
            </div>

            {/* Required Toggle */}
            <Toggle
              isChecked={component.props?.required ?? false}
              onToggle={(value) =>
                setComponent({
                  ...component,
                  // @ts-expect-error TypeScript cannot infer this type correctly
                  props: {
                    ...component.props,
                    required: value,
                  },
                })
              }
              leftText
              size="toggle-sm"
              fontWeight="font-normal"
              onText="Required"
              offText="Required"
            />
          </div>
        </>
      )}
    </FormComponentBG>
  );
};

function getDefaultProps(
  type: FormComponentType,
  name?: string
): FormComponent {
  const defaultLegend = "Edit your question here";
  const defaultOptions = [
    { label: "Option 1", value: "Option 1" },
    { label: "Option 2", value: "Option 2" },
    { label: "Option 3", value: "Option 3" },
  ];

  switch (type) {
    case FormComponentType.TEXT:
      return {
        type: FormComponentType.TEXT,
        props: { name: name ?? crypto.randomUUID(), legend: defaultLegend },
        version: "1",
      } as FormComponent;

    case FormComponentType.TEXTAREA:
      return {
        type: FormComponentType.TEXTAREA,
        props: { name: name ?? crypto.randomUUID(), legend: defaultLegend },
        version: "1",
      } as FormComponent;

    case FormComponentType.RADIO:
      return {
        type: FormComponentType.RADIO,
        props: {
          name: name ?? crypto.randomUUID(),
          legend: defaultLegend,
          options: defaultOptions,
        },
        version: "1",
      } as FormComponent;

    case FormComponentType.SELECT:
      return {
        type: FormComponentType.SELECT,
        props: {
          name: name ?? crypto.randomUUID(),
          legend: defaultLegend,
          options: defaultOptions,
        },
        version: "1",
      } as FormComponent;

    case FormComponentType.DATE:
      return {
        type: FormComponentType.DATE,
        props: { name: name ?? crypto.randomUUID(), legend: defaultLegend },
        version: "1",
      } as FormComponent;

    case FormComponentType.TIME:
      return {
        type: FormComponentType.TIME,
        props: { name: name ?? crypto.randomUUID(), legend: defaultLegend },
        version: "1",
      } as FormComponent;

    case FormComponentType.DATETIME:
      return {
        type: FormComponentType.DATETIME,
        props: { name: name ?? crypto.randomUUID(), legend: defaultLegend },
        version: "1",
      } as FormComponent;

    case FormComponentType.LINEAR_SCALE:
      return {
        type: FormComponentType.LINEAR_SCALE,
        props: {
          name: name ?? crypto.randomUUID(),
          legend: defaultLegend,
          min: 0,
          max: 5,
        },
        version: "1",
      } as FormComponent;

    default:
      return {
        type: FormComponentType.TEXT,
        props: { name: name ?? crypto.randomUUID(), legend: defaultLegend },
        version: "1",
      } as FormComponent;
  }
}

export default EditableFormComponent;
