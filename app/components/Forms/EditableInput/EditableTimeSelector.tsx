import { useState } from "react";
import TimeSelector from "../../Input/Date/TimeSelector";
import { Time } from "../../Input/Date/utils";
import ExtraOptionsBG from "./ExtraOptionsBG";

export type TimeSettings = {
  minTime?: Time;
  maxTime?: Time;
};

export type EditableTimeSelectorProps = {
  settings?: TimeSettings;
  onChange?: (settings: TimeSettings) => void;
  selected?: boolean;
};

const EditableTimeSelector = ({
  settings,
  onChange,
  selected = false,
}: EditableTimeSelectorProps) => {
  return (
    <>
      <TimeSelector name="preview" readonly noFormOutput />
      {selected && (
        <ExtraOptionsBG>
          <EditableTimeSettings settings={settings} onChange={onChange} />
        </ExtraOptionsBG>
      )}
    </>
  );
};

export const EditableTimeSettings = ({
  settings,
  onChange,
}: EditableTimeSelectorProps) => {
  const [minTime, setMinTime] = useState<Time | undefined>(settings?.minTime);
  const [maxTime, setMaxTime] = useState<Time | undefined>(settings?.maxTime);

  return (
    <>
      <div className="flex col items-center gap-2 mt-2">
        <p className="text-sm w-30 pb-2 text-right">Min Time</p>
        <TimeSelector
          name="min"
          className="w-50"
          value={minTime}
          onChange={(time) => {
            setMinTime(time);
            if (onChange) onChange({ minTime: time, maxTime });
          }}
        />
      </div>
      <div className="flex col items-center gap-2">
        <p className="text-sm w-30 pb-2 text-right">Max Time</p>
        <TimeSelector
          name="max"
          className="w-50"
          value={maxTime}
          onChange={(time) => {
            setMaxTime(time);
            if (onChange) onChange({ minTime, maxTime: time });
          }}
        />
      </div>
    </>
  );
};

export default EditableTimeSelector;
