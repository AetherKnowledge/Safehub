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
      className={`fixed inset-0 min-w-0 flex items-center justify-center bg-transparent bg-opacity-50 backdrop-brightness-50 z-[9999] ${className}`}
      onClick={onClose}
    >
      <div className="max-h-[100vh] overflow-y-auto w-full items-center justify-center scrollbar-gutter-stable">
        <div className="flex-1 flex p-5 items-center justify-center">
          <div onClick={(e) => e.stopPropagation()}>{children}</div>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default ModalBase;
