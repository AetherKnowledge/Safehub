import DateTimeSelector from "../../Input/Date/DateTimeSelector";
import { DateSettings, EditableDateSettings } from "./EditableDateSelector";
import { EditableTimeSettings, TimeSettings } from "./EditableTimeSelector";
import ExtraOptionsBG from "./ExtraOptionsBG";

export type EditableDateTimeSettings = TimeSettings & DateSettings;

export type EditableTimeSelectorProps = {
  settings?: EditableDateTimeSettings;
  onChange?: (settings: EditableDateTimeSettings) => void;
  selected?: boolean;
};

const EditableDateTimeSelector = ({
  settings,
  onChange,
  selected = false,
}: EditableTimeSelectorProps) => {
  return (
    <>
      <DateTimeSelector name="preview" readonly noFormOutput />
      {selected && (
        <ExtraOptionsBG>
          <EditableDateSettings
            settings={settings}
            onChange={(updatedSettings) => {
              const newSettings = { ...settings, ...updatedSettings };
              onChange?.(newSettings);
            }}
          />
          <EditableTimeSettings
            settings={settings}
            onChange={(updatedSettings) => {
              const newSettings = { ...settings, ...updatedSettings };
              onChange?.(newSettings);
            }}
          />
        </ExtraOptionsBG>
      )}
    </>
  );
};

export default EditableDateTimeSelector;
