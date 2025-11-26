"use client";

import { AlertTriangle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import ModalBase from "./ModalBase";

type ErrorScreenProps = {
  message?: string;
  onClose?: () => void;
  redirectTo?: string;
  retry?: boolean;
  notTransparent?: boolean;
  bgColor?: string;
  closeText?: string;
  buttonColor?: string;
};

const ErrorPopup = ({
  message = "Unknown Error",
  onClose,
  redirectTo,
  retry = false,
  notTransparent,
  bgColor,
  closeText = "Close",
  buttonColor = "btn-error",
}: ErrorScreenProps) => {
  const router = useRouter();

  return (
    <ModalBase notTransparent={notTransparent} bgColor={bgColor}>
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
          <div
            className={`flex flex-col sm:flex-row gap-2 w-full mt-2 ${
              retry ? "justify-between" : "justify-center"
            }`}
          >
            {retry && (
              <button
                className="btn btn-primary"
                onClick={() => router.refresh()}
              >
                Retry
              </button>
            )}
            {redirectTo ? (
              <Link
                href={redirectTo}
                className={`btn ${buttonColor}`}
                onClick={onClose}
              >
                {closeText}
              </Link>
            ) : onClose ? (
              <button className={`btn ${buttonColor}`} onClick={onClose}>
                {closeText}
              </button>
            ) : null}
          </div>
        </div>
      </div>
    </ModalBase>
  );
};

export default ErrorPopup;
