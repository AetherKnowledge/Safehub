import { useState } from "react";
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
  const [settingsState, setSettingsState] = useState<EditableDateTimeSettings>(
    settings || {}
  );

  return (
    <>
      <DateTimeSelector name="preview" readonly noFormOutput />
      {selected && (
        <ExtraOptionsBG>
          <EditableDateSettings
            settings={settingsState}
            onChange={(settings) => {
              const newSettings = { ...settingsState, ...settings };
              setSettingsState(newSettings);
              onChange?.(newSettings);
            }}
          />
          <EditableTimeSettings
            settings={settingsState}
            onChange={(settings) => {
              const newSettings = { ...settingsState, ...settings };
              setSettingsState(newSettings);
              onChange?.(newSettings);
            }}
          />
        </ExtraOptionsBG>
      )}
    </>
  );
};

export default EditableDateTimeSelector;
