"use client";

import ErrorPopup from "./components/Popup/ErrorPopup";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <ErrorPopup
      message={error.message}
      onClose={() => {
        reset();
      }}
    />
  );
}
