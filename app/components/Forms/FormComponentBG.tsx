"use client";

const FormComponentBG = ({
  children = null,
  className,
  onClick,
  skeleton = false,
}: {
  children?: React.ReactNode;
  className?: string;
  onClick?: () => void;
  skeleton?: boolean;
}) => {
  return (
    <div
      className={`${className} flex flex-col shadow-br rounded-lg p-4 py-2 ${
        skeleton ? "skeleton h-20" : "bg-base-100"
      }`}
      onClick={onClick}
      style={skeleton ? {} : undefined}
    >
      {children}
    </div>
  );
};

export default FormComponentBG;
