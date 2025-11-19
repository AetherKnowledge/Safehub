"use client";

import { useEffect, useRef } from "react";
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
  const ref = useRef<HTMLDivElement>(null);

  function scrollIntoView() {
    if (ref.current) {
      ref.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }

  useEffect(() => {
    if (selected) {
      scrollIntoView();
    }
  }, [selected]);

  return (
    <section ref={ref}>
      <FormComponentBG
        className={`card w-full border-0 transition-all cursor-pointer  shadow-br
          ${
            selected ? "border-primary border-l-4" : "border-transparent"
          } p-4 py-4 ${className}`}
        onClick={() => onClick?.()}
      >
        {children}
      </FormComponentBG>
    </section>
  );
};

export default EditableFormComponentBG;
