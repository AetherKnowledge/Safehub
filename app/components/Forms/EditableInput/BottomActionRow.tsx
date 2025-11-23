import Divider from "../../Divider";
import Toggle from "../../Input/Toggle";
import { FormComponent, FormComponentType } from "../FormBuilder";

const BottomActionRow = ({
  component,
  onDuplicate,
  onDelete,
  onRequiredToggle,
  type,
  requiredComponent = false,
}: {
  component: FormComponent;
  onDuplicate?: () => void;
  onDelete?: () => void;
  onRequiredToggle?: (value: boolean) => void;
  requiredComponent?: boolean;
  type?: FormComponentType;
}) => {
  return (
    <>
      <Divider className="mt-2" />
      <div className="flex justify-between items-center mt-3">
        <div className="flex gap-2">
          <button
            type="button"
            className="btn btn-ghost btn-xs text-base-content/50"
            onClick={onDuplicate}
          >
            Duplicate
          </button>
          <button
            type="button"
            className="btn btn-ghost btn-xs text-error disabled:text-error/50 disabled:cursor-not-allowed"
            onClick={onDelete}
            disabled={requiredComponent}
          >
            Delete
          </button>
        </div>

        {/* Required Toggle */}
        {type !== FormComponentType.SEPARATOR && (
          <Toggle
            isChecked={component.props?.required ?? false}
            onToggle={(value) => onRequiredToggle?.(value)}
            leftText
            size="toggle-sm"
            fontWeight="font-normal"
            onText="Required"
            offText="Required"
            disabled={requiredComponent}
          />
        )}
      </div>
    </>
  );
};

export default BottomActionRow;
