"use client";

import Link from "next/link";
import ModalBase from "./ModalBase";
import { AlertTriangle } from "lucide-react";

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
    <div className="bg-base-100 border border-error/30 shadow-xl rounded-2xl px-6 py-5 max-w-sm w-full text-base-content">
      <div className="flex flex-col items-center text-center gap-4">
        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-error/10 text-error">
          <AlertTriangle className="w-6 h-6" />
        </div>
        <div className="space-y-1">
          <p className="text-sm font-semibold text-error uppercase tracking-[0.18em]">
            Something went wrong
          </p>
          <p className="text-sm text-base-content/80 break-words">
            {message}
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 w-full mt-2">
          {redirectTo ? (
            <Link
              href={redirectTo}
              className="btn btn-error btn-sm sm:flex-1"
              onClick={onClose}
            >
              Close
            </Link>
          ) : (
            <button
              className="btn btn-error btn-sm sm:flex-1"
              onClick={onClose}
            >
              Close
            </button>
          )}
        </div>
      </div>
    </div>
  </ModalBase>
);

export default ErrorPopup;
