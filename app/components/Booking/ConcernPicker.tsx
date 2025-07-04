import { useState } from "react";

const concernOptions = [
  "Stress and Burnout",
  "Anxiety Disorders",
  "Depression and Mood Disorders",
  "Family Conflicts",
  "Relationship Issues",
  "Trauma and PTSD",
  "Grief and Loss",
  "Parenting Challenges",
  "Identity, Self-Esteem, and Belonging",
  "Life Transitions and Adjustments",
  "Other",
];

interface ConcernPickerProps {
  onChange?: (concerns: string[]) => void;
}

const ConcernPicker = ({ onChange }: ConcernPickerProps) => {
  const [selected, setSelected] = useState<string[]>([]);
  const [otherText, setOtherText] = useState("");

  const toggleConcern = (concern: string) => {
    const updated = selected.includes(concern)
      ? selected.filter((c) => c !== concern)
      : [...selected, concern];
    setSelected(updated);
    onChange?.(updated);
  };

  const isChecked = (concern: string) => selected.includes(concern);

  return (
    <div className="flex flex-col gap-6 pr-5 pl-5 h-full w-full">
      {/* Title (top-left) */}
      <div className="text-base-content text-2xl font-semibold">
        Pick concern/s for appointment:
      </div>

      {/* Concern grid */}
      <div className="flex items-center justify-center w-full">
        <div className="grid grid-cols-2 gap-x-16 gap-y-8 max-w-6xl w-full pl-5">
          {concernOptions.slice(0, -1).map((concern) => (
            <label
              key={concern}
              className="label gap-3 cursor-pointer text-base-content text-lg flex-wrap break-all max-w-full"
            >
              <input
                type="checkbox"
                className="checkbox"
                checked={isChecked(concern)}
                onChange={() => toggleConcern(concern)}
              />
              <span className="break-all">{concern}</span>
            </label>
          ))}
        </div>
      </div>

      {/* "Other" at bottom center */}
      <div className="flex flex-col items-center mt-6 gap-2">
        <label className="label gap-3 cursor-pointer text-base-content text-lg flex-wrap break-words max-w-full">
          <input
            type="checkbox"
            className="checkbox"
            checked={isChecked("Other")}
            onChange={() => toggleConcern("Other")}
          />
          <span className="break-words">Other</span>
        </label>
        {isChecked("Other") && (
          <input
            type="text"
            className="input input-bordered w-full max-w-md text-base-content focus:outline-none focus:ring-0"
            placeholder="Please specify"
            value={otherText}
            onChange={(e) => setOtherText(e.target.value)}
          />
        )}
      </div>
    </div>
  );
};

export default ConcernPicker;
