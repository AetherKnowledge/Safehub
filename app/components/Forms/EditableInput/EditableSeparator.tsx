import { FormComponent, FormComponentType } from "../FormBuilder";
import { BaseSeparator, SeparatorProps } from "../Separator";
import BottomActionRow from "./BottomActionRow";
import EditableFormComponentBG from "./EditableFormComponentBG";
import FormsOptions from "./FormsOptions";

type EditableSeparatorProps = {
  selected: boolean;
  onClick?: (name: string) => void;
  component: Extract<FormComponent, { type: FormComponentType.SEPARATOR }>;
  onChange?: (component: SeparatorProps) => void;
  onDuplicate?: () => void;
  onDelete?: () => void;
  onAdd?: () => void;
  onAddSeparator?: () => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
};

const EditableSeparator = ({
  selected,
  onClick,
  component,
  onDuplicate,
  onDelete,
  onChange,
  onAdd,
  onAddSeparator,
  onMoveUp,
  onMoveDown,
}: EditableSeparatorProps) => {
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

      <BaseSeparator {...component.props}>
        <input
          type="text"
          className="bg-transparent w-full text-center font-semibold text-lg text-primary focus:outline-none"
          value={component.props.legend}
          onChange={(e) => {
            onChange?.({ ...component.props, legend: e.target.value });
          }}
        />
      </BaseSeparator>
      {selected && (
        <BottomActionRow
          component={component}
          onDuplicate={onDuplicate}
          onDelete={onDelete}
          type={FormComponentType.SEPARATOR}
        />
      )}
    </EditableFormComponentBG>
  );
};

export default EditableSeparator;
