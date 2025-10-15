"use client";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

const ModalBase = ({
  children,
  className,
  onClick,
}: {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return createPortal(
    <div
      className={`fixed inset-0 flex items-center justify-center bg-transparent bg-opacity-50 backdrop-brightness-50 z-[9999] ${className}`}
      onClick={onClick}
    >
      {children}
    </div>,
    document.body
  );
};

export default ModalBase;
