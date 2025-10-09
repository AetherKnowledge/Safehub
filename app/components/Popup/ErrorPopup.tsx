"use client";

import Link from "next/link";
import ModalBase from "./ModalBase";

type ErrorScreenProps = {
  message?: string;
  onClose?: () => void;
  redirectTo?: string;
};

const ErrorPopup = ({
  message = "Unknown Error",
  onClose,
  redirectTo,
}: ErrorScreenProps) => (
  <ModalBase>
    <div className="bg-base-100 p-6 rounded-lg shadow-lg text-center z-100">
      <div className="flex flex-col items-center justify-center h-full space-y-4">
        <p className="text-error">Error: {message}</p>
        {redirectTo ? (
          <Link href={redirectTo} className="btn btn-primary" onClick={onClose}>
            Close
          </Link>
        ) : (
          <button className="btn btn-primary" onClick={onClose}>
            Close
          </button>
        )}
      </div>
    </div>
  </ModalBase>
);

export default ErrorPopup;
