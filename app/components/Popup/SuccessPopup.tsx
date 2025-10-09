"use client";
import Link from "next/link";
import ModalBase from "./ModalBase";

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
      <div className="bg-base-100 p-6 rounded-lg shadow-lg text-center">
        <div className="flex flex-col items-center justify-center h-full space-y-4">
          <p className="text-base-content text-2xl">Success</p>
          {message && <p className="text-base-content text-sm">{message}</p>}
          {redirectTo ? (
            <Link
              className="btn btn-primary"
              href={redirectTo}
              onClick={onClose}
            >
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
};

export default SuccessPopup;
