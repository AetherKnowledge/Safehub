import { FormComponent, FormComponentType } from "../FormBuilder";
import Separator, { BaseSeparator, SeparatorProps } from "../Separator";
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

      {selected ? (
        <>
          <BaseSeparator {...component.props}>
            <input
              type="text"
              className="p-2 bg-neutral border-b-1 border-primary no-outline w-full rounded-sm h-10 text-center"
              value={component.props.legend}
              onChange={(e) => {
                onChange?.({ ...component.props, legend: e.target.value });
              }}
            />
          </BaseSeparator>
          <BottomActionRow
            component={component}
            onDuplicate={onDuplicate}
            onDelete={onDelete}
            type={FormComponentType.SEPARATOR}
          />
        </>
      ) : (
        <Separator {...component.props} />
      )}
    </EditableFormComponentBG>
  );
};

export default EditableSeparator;
