export type FormsHeaderProps = {
  title: string;
  description?: string;
};

const FormsHeader = ({
  title = "Form",
  description = "Answer the form truthfully to complete.",
}: FormsHeaderProps) => {
  return (
    <div className="flex flex-col w-full p-7 items-center justify-between text-center rounded-lg bg-base-100 shadow-br gap-1">
      <span className="text-primary text-2xl font-semibold">{title}</span>
      <span className="text-base-content/70 text-sm">{description}</span>
    </div>
  );
};

export default FormsHeader;
