"use client";
import { useState } from "react";
import Legend from "../../Input/Legend";
import { RadioBoxProps } from "../../Input/RadioBox";
import SelectBox, { SelectBoxProps } from "../../Input/SelectBox";
import TextArea from "../../Input/TextArea";
import TextBox from "../../Input/TextBox";
import { FormComponent, FormComponentType } from "../FormBuilder";
import BottomActionRow from "./BottomActionRow";
import EditableDateSelector from "./EditableDateSelector";
import EditableDateTimeSelector from "./EditableDateTimeSelector";
import EditableFormComponentBG from "./EditableFormComponentBG";
import EditableLinearScale, {
  LinearScaleSettings,
} from "./EditableLinearScale";
import EditableRadioBox from "./EditableRadioBox";
import EditableSelectBox from "./EditableSelectBox";
import EditableSeparator from "./EditableSeparator";
import EditableTimeSelector from "./EditableTimeSelector";
import FormsOptions from "./FormsOptions";
import { createFormComponent, SaveableSettings } from "./utils";

export type EditableFormComponentProps = {
  component: FormComponent;
  selected?: boolean;
  onClick?: (id: string) => void;
  onDuplicate?: () => void;
  onDelete?: () => void;
  onChange?: (component: FormComponent) => void;
  onAdd?: () => void;
  onAddSeparator?: () => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  requiredComponent?: boolean;
};

const EditableFormComponent = ({
  component,
  onClick,
  selected = false,
  onDuplicate,
  onDelete,
  onChange,
  onAdd,
  onAddSeparator,
  onMoveUp,
  onMoveDown,
  requiredComponent = false,
}: EditableFormComponentProps) => {
  const [hasError, setHasError] = useState(false);

  if (component.type === FormComponentType.SEPARATOR) {
    return (
      <EditableSeparator
        component={component}
        selected={selected}
        onClick={onClick}
        onDuplicate={onDuplicate}
        onDelete={onDelete}
        onChange={(updatedComponent) => {
          onChange?.({
            ...component,
            props: {
              ...component.props,
              ...updatedComponent,
            },
          });
        }}
        onAdd={onAdd}
        onAddSeparator={onAddSeparator}
        onMoveUp={onMoveUp}
        onMoveDown={onMoveDown}
      />
    );
  }

  return (
    <EditableFormComponentBG
      selected={selected}
      onClick={() => onClick?.(component.props?.name)}
    >
      {/* Form Options Panel */}
      {selected && (
        <FormsOptions
          onAdd={onAdd}
          onAddSeparator={onAddSeparator}
          onMoveUp={onMoveUp}
          onMoveDown={onMoveDown}
        />
      )}

      {/* Component Label */}
      {selected ? (
        <div className="flex flex-row w-full gap-2">
          <input
            className={`p-2 bg-neutral border-b-1 no-outline w-full rounded-sm h-10 transition-colors duration-300 ${
              hasError ? "border border-error" : "border-primary"
            }`}
            value={component.props?.legend}
            onChange={(e) => {
              if (e.target.value.trim() === "") {
                setHasError(true);
              } else setHasError(false);

              // @ts-expect-error TypeScript cannot infer this type correctly
              onChange?.({
                ...component,
                props: {
                  ...component.props,
                  legend: e.target.value,
                },
              });
            }}
            placeholder="Edit component name here"
            required
          />
          {!requiredComponent && (
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
                onChange?.({
                  ...component,
                  ...createFormComponent({
                    ...(component.props as SaveableSettings),
                    type: option.value as FormComponentType,
                  }),
                });
              }}
            />
          )}
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
            options={
              component.props ? (component.props as RadioBoxProps).options : []
            }
            onChange={(options) => {
              onChange?.({
                ...component,
                props: {
                  ...component.props,
                  options: options,
                } as RadioBoxProps,
              });
            }}
          />
        )}
        {component.type === FormComponentType.SELECT && (
          <EditableSelectBox
            selected={selected}
            options={
              component.props ? (component.props as SelectBoxProps).options : []
            }
            onChange={(options) => {
              console.log("Options changed:", options);
              onChange?.({
                ...component,
                props: {
                  ...component.props,
                  options: options,
                } as SelectBoxProps,
              });
            }}
          />
        )}
        {component.type === FormComponentType.DATE && (
          <EditableDateSelector
            selected={selected}
            settings={component?.props as SaveableSettings}
            onChange={(settings) => {
              onChange?.({
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
            settings={component?.props as SaveableSettings}
            onChange={(settings) => {
              onChange?.({
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
            settings={component?.props as SaveableSettings}
            onChange={(settings) => {
              onChange?.({
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
            settings={component.props as LinearScaleSettings}
            onChange={(settings) => {
              onChange?.({
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
        <BottomActionRow
          component={component}
          requiredComponent={requiredComponent}
          onDuplicate={onDuplicate}
          onDelete={onDelete}
          onRequiredToggle={(value) =>
            // @ts-expect-error TypeScript cannot infer this type correctly
            onChange?.({
              ...component,
              props: {
                ...component.props,
                required: value,
              },
            })
          }
        />
      )}
    </EditableFormComponentBG>
  );
};

export default EditableFormComponent;
