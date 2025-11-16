import { useState } from "react";
import LinearScale from "../../Input/LinearScale";
import SelectBox from "../../Input/SelectBox";
import TextBox from "../../Input/TextBox";
import ExtraOptionsBG from "./ExtraOptionsBG";

export type LinearScaleSettings = {
  min?: 0 | 1;
  max?: 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
  minText?: string;
  maxText?: string;
};

type EditableLinearScaleProps = {
  settings?: LinearScaleSettings;
  onChange?: (settings: LinearScaleSettings) => void;
  selected?: boolean;
};

const EditableLinearScale = ({
  settings,
  onChange,
  selected,
}: EditableLinearScaleProps) => {
  const [min, setMin] = useState<0 | 1 | undefined>(settings?.min || 1);
  const [max, setMax] = useState<
    2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | undefined
  >(settings?.max || 5);
  const [minText, setMinText] = useState<string | undefined>(settings?.minText);
  const [maxText, setMaxText] = useState<string | undefined>(settings?.maxText);

  const minOptions = [
    { label: "0", value: "0" },
    { label: "1", value: "1" },
  ];

  const maxOptions = [
    { label: "2", value: "2" },
    { label: "3", value: "3" },
    { label: "4", value: "4" },
    { label: "5", value: "5" },
    { label: "6", value: "6" },
    { label: "7", value: "7" },
    { label: "8", value: "8" },
    { label: "9", value: "9" },
    { label: "10", value: "10" },
  ];

  return (
    <>
      <LinearScale
        name="preview"
        noFormOutput
        minText={minText}
        min={min}
        max={max}
        maxText={maxText}
      />
      {selected && (
        <ExtraOptionsBG>
          <div className="flex flex-row items-center gap-4">
            <SelectBox
              className="w-19"
              name="min"
              defaultValue={min?.toString()}
              options={minOptions}
              onChange={(option) => {
                const newMin = parseInt(option.value) as 0 | 1;
                setMin(newMin);
                if (onChange) onChange({ min: newMin, max, minText, maxText });
              }}
              noFormOutput
            />
            <p className="mb-3">to</p>
            <SelectBox
              className="w-19"
              name="max"
              defaultValue={max?.toString()}
              options={maxOptions}
              noFormOutput
              onChange={(option) => {
                const newMax = parseInt(option.value) as
                  | 2
                  | 3
                  | 4
                  | 5
                  | 6
                  | 7
                  | 8
                  | 9
                  | 10;
                setMax(newMax);
                if (onChange) onChange({ min, max: newMax, minText, maxText });
              }}
            />
          </div>
          <div className="flex col items-center gap-2 mt-2">
            <p className="text-sm w-30 text-right">{min}</p>
            <TextBox
              name="minText"
              className="w-50"
              defaultValue={minText}
              onChange={(text) => {
                setMinText(text);
                if (onChange) onChange({ minText: text, maxText });
              }}
              noFormOutput
            />
          </div>
          <div className="flex col items-center gap-2 mt-2">
            <p className="text-sm w-30 text-right">{max}</p>
            <TextBox
              name="maxText"
              className="w-50"
              defaultValue={maxText}
              onChange={(text) => {
                setMaxText(text);
                if (onChange) onChange({ minText, maxText: text });
              }}
              noFormOutput
            />
          </div>
        </ExtraOptionsBG>
      )}
    </>
  );
};

export default EditableLinearScale;
