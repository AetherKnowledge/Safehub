"use client";
const FormBG = ({
  children,
  onSubmit,
}: {
  children: React.ReactNode;
  onSubmit?: (formData: FormData) => void;
}) => {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // prevent page reload or reset

    if (onSubmit) {
      const formData = new FormData(e.currentTarget);
      onSubmit(formData);
    }
  };

  return (
    <div className="flex-1 min-h-0 overflow-y-auto items-center overflow-x-hidden">
      <div className="flex flex-col w-full h-full rounded-xl p-5 items-center">
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4 max-w-3xl w-full"
        >
          {children}
        </form>
      </div>
    </div>
  );
};

export default FormBG;
