import FormsHeader, {
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
      {selected ? (
        <>
          <FormsOptions
            onAdd={onAdd}
            onAddSeparator={onAddSeparator}
            isHeader
          />
          <BaseFormsHeader className="gap-2">
            <input
              type="title"
              className={`${headerTitleClass} bg-neutral border-b-1 border-primary no-outline h-12 rounded-sm`}
              value={component.title}
              onChange={(e) => {
                onChange?.({ ...component, title: e.target.value });
              }}
            />
            <input
              type="description"
              className={`${headerDescriptionClass} bg-neutral border-b-1 border-primary no-outline h-10 rounded-sm`}
              value={component.description}
              placeholder="Description placeholder"
              onChange={(e) => {
                onChange?.({ ...component, description: e.target.value });
              }}
            />
          </BaseFormsHeader>
        </>
      ) : (
        <FormsHeader {...component} />
      )}
    </EditableFormComponentBG>
  );
};

export default EditableHeader;
