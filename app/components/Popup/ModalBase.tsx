"use client";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

const ModalBase = ({ children }: { children: React.ReactNode }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return createPortal(
    <div className="fixed inset-0 flex items-center justify-center bg-transparent bg-opacity-50 backdrop-brightness-50 z-[9999]">
      {children}
    </div>,
    document.body
  );
};

export default ModalBase;
