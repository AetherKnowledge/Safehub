"use client";

const QuestionBG = ({
  children,
  className,
  onClick,
}: {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}) => {
  return (
    <div
      className={`flex flex-col bg-base-100 shadow-br rounded-lg p-4 py-2 ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export default QuestionBG;
