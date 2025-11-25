"use client";
import Link from "next/link";
import ModalBase from "./ModalBase";
import { CheckCircle2 } from "lucide-react";

type SuccessScreenProps = {
  message?: string;
  onClose?: () => void;
  redirectTo?: string;
};

const SuccessPopup = ({
  message = "Success",
  onClose,
  redirectTo,
}: SuccessScreenProps) => {
  return (
    <ModalBase>
      <div className="bg-base-100 border border-success/30 shadow-xl rounded-2xl px-6 py-5 max-w-sm w-full text-base-content">
        <div className="flex flex-col items-center text-center gap-4">
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-success/10 text-success">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <p className="text-sm font-semibold text-success uppercase tracking-[0.18em]">
              Success
            </p>
            {message && (
              <p className="text-sm text-base-content/80 break-words">{message}</p>
            )}
          </div>
          <div className="flex flex-col sm:flex-row gap-2 w-full mt-2">
            {redirectTo ? (
              <Link
                className="btn btn-primary btn-sm sm:flex-1"
                href={redirectTo}
                onClick={onClose}
              >
                Close
              </Link>
            ) : (
              <button
                className="btn btn-primary btn-sm sm:flex-1"
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
};

export default SuccessPopup;
