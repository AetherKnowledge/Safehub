"use client";

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
      <div className="bg-base-100 p-6 rounded-lg shadow-lg text-center z-100">
        <div className="flex flex-col items-center justify-center h-full space-y-4">
          <p className="text-error">Error: {error.message}</p>
          <div className="flex flex-row justify-between w-full">
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
