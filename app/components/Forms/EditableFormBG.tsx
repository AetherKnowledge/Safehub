const EditableFormBG = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex-1 min-h-0 overflow-y-auto items-center overflow-x-hidden">
      <div className="flex flex-col w-full h-full rounded-xl p-5 items-center">
        <div className="flex flex-col gap-4 max-w-3xl w-full">{children}</div>
      </div>
    </div>
  );
};

export default EditableFormBG;
