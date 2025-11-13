const QuestionBG = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div
      className={`flex flex-col bg-base-100 shadow-br rounded-lg p-4 py-2 ${className}`}
    >
      {children}
    </div>
  );
};

export default QuestionBG;
