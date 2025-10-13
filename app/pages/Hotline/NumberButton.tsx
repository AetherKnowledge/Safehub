"use client";

import { useState } from "react";

interface NumberButtonProps {
  contactNumber: string;
}

const NumberButton = ({ contactNumber }: NumberButtonProps) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(contactNumber).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <button
      onClick={copyToClipboard}
      className={`text-2xl font-semibold hover:text-primary-focus hover:text-primary/80 active:text-primary/60 cursor-pointer transition-colors duration-200 ${
        copied ? "text-primary" : "text-base-content"
      }`}
    >
      {copied ? "Copied!" : contactNumber}
    </button>
  );
};

export default NumberButton;
