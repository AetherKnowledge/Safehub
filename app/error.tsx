"use client";

import { AlertTriangle } from "lucide-react";
import { useRouter } from "next/navigation";
import ModalBase from "./components/Popup/ModalBase";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();

  return (
    <ModalBase onClose={reset}>
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
              {error.message}
            </p>
          </div>
          <div className="flex flex-col justify-between sm:flex-row gap-2 w-full mt-2">
            <button className="btn btn-primary" onClick={() => router.back()}>
              Back
            </button>

            <button className="btn btn-primary" onClick={reset}>
              Retry
            </button>
          </div>
        </div>
      </div>
    </ModalBase>
  );
}
