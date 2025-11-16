import {
  BaseFormsHeader,
  FormsHeaderProps,
  headerDescriptionClass,
  headerTitleClass,
} from "../FormsHeader";
import EditableFormComponentBG from "./EditableFormComponentBG";
import FormsOptions from "./FormsOptions";

export type EditableHeaderProps = {
  selected: boolean;
  onClick?: (name: string) => void;
  component: FormsHeaderProps;
  onChange?: (component: FormsHeaderProps) => void;
  onAdd?: () => void;
  onAddSeparator?: () => void;
};

const EditableHeader = ({
  selected,
  onClick,
  component,
  onChange,
  onAdd,
  onAddSeparator,
}: EditableHeaderProps) => {
  return (
    <EditableFormComponentBG
      selected={selected}
      onClick={() => onClick?.(component.name)}
    >
      {/* Form Options Panel */}
      {selected && (
        <FormsOptions onAdd={onAdd} onAddSeparator={onAddSeparator} isHeader />
      )}
      <BaseFormsHeader>
        <input
          type="title"
          className={`bg-transparent focus:outline-none ${headerTitleClass}`}
          value={component.title}
          onChange={(e) => {
            onChange?.({ ...component, title: e.target.value });
          }}
        />
        <input
          type="description"
          className={`bg-transparent focus:outline-none ${headerDescriptionClass}`}
          value={component.description}
          placeholder="Description placeholder"
          onChange={(e) => {
            onChange?.({ ...component, description: e.target.value });
          }}
        />
      </BaseFormsHeader>
    </EditableFormComponentBG>
  );
};

export default EditableHeader;
