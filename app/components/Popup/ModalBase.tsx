"use client";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

const ModalBase = ({
  children,
  className,
  onClose,
}: {
  children: React.ReactNode;
  className?: string;
  onClose?: () => void;
}) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return createPortal(
    <div
      className={`fixed inset-0 flex items-center justify-center bg-transparent bg-opacity-50 backdrop-brightness-50 z-[9999] ${className}`}
      onClick={onClose}
    >
      <div
        className="flex overflow-y-auto p-5 max-h-full min-w-0 flex-1 items-center justify-center"
        onClick={(e) => e.stopPropagation()} // prevents closing when clicking inside
      >
        {children}
      </div>
    </div>,
    document.body
  );
};

export default ModalBase;
