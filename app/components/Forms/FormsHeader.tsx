export type FormsHeaderProps = {
  name: string;
  title: string;
  description?: string;
};

export const headerTitleClass =
  "text-primary text-2xl font-semibold w-full text-center";
export const headerDescriptionClass =
  "text-base-content/70 text-sm w-full text-center";

const FormsHeader = ({
  name,
  title = "Form",
  description = "Answer the form truthfully to complete.",
}: FormsHeaderProps) => {
  return (
    <BaseFormsHeader>
      <span className={headerTitleClass}>{title}</span>
      {description && (
        <span className={headerDescriptionClass}>{description}</span>
      )}
    </BaseFormsHeader>
  );
};

export const BaseFormsHeader = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <div className="flex flex-col w-full p-7 items-center justify-between text-center gap-1">
      {children}
    </div>
  );
};

export default FormsHeader;
