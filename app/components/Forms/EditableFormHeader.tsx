"use client";

const EditableFormHeader = ({
  onSave,
  changeTerms,
  termsAndConditions,
}: {
  onSave?: () => void;
  changeTerms?: (value: boolean) => void;
  termsAndConditions?: boolean;
}) => {
  return (
    <div className="flex flex-row bg-base-100 w-full justify-end items-center p-2 gap-2">
      <label className="label text-base-content">
        <input
          type="checkbox"
          className="checkbox rounded-lg"
          checked={termsAndConditions}
          onChange={(e) => changeTerms?.(e.target.checked)}
        />
        Show Terms and Conditions
      </label>
      <button className="btn btn-ghost" onClick={onSave}>
        Save Form
      </button>
    </div>
  );
};

export default EditableFormHeader;
