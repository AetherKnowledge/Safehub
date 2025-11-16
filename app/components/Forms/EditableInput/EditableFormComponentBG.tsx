"use client";

import FormComponentBG from "../FormComponentBG";

const EditableFormComponentBG = ({
  children,
  onClick,
  selected,
  className,
}: {
  children: React.ReactNode;
  onClick: () => void;
  selected: boolean;
  className?: string;
}) => {
  return (
    <>
      <FormComponentBG
        className={`card w-full border-0 transition-all cursor-pointer  shadow-br
          ${
            selected ? "border-primary border-l-4" : "border-transparent"
          } p-4 py-4 ${className}`}
        onClick={() => onClick?.()}
      >
        {children}
      </FormComponentBG>
    </>
  );
};

export default EditableFormComponentBG;
