import DateSelector from "../../Input/Date/DateSelector";
import Toggle from "../../Input/Toggle";
import ExtraOptionsBG from "./ExtraOptionsBG";

export type DateSettings = {
  canPickPastDates?: boolean;
};

export type EditableTimeSelectorProps = {
  settings?: DateSettings;
  onChange?: (settings: DateSettings) => void;
  selected?: boolean;
};

const EditableDateSelector = ({
  settings,
  onChange,
  selected = false,
}: EditableTimeSelectorProps) => {
  return (
    <>
      <DateSelector name="preview" readonly noFormOutput />
      {selected && (
        <ExtraOptionsBG>
          <EditableDateSettings settings={settings} onChange={onChange} />
        </ExtraOptionsBG>
      )}
    </>
  );
};

export const EditableDateSettings = ({
  settings,
  onChange,
}: EditableTimeSelectorProps) => {
  return (
    <>
      <Toggle
        isChecked={settings?.canPickPastDates || false}
        onToggle={(val) => onChange?.({ canPickPastDates: val })}
        leftText
        size="toggle-sm"
        fontWeight="font-normal"
        onText="Allow past dates"
        offText="Allow past dates"
      />
    </>
  );
};

export default EditableDateSelector;
