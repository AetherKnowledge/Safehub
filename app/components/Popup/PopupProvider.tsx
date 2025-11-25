"use client";
import { createContext, useContext, useRef, useState } from "react";
import ErrorPopup from "./ErrorPopup";
import LoadingPopup from "./LoadingPopup";
import SuccessPopup from "./SuccessPopup";
import YesNoPopup from "./YesNoPopup";

interface PopupProviderContextType {
  showLoading: (message?: string) => void;
  showSuccess: (
    message: string,
    redirectTo?: string,
    onClose?: () => void
  ) => void;
  showError: (
    message: string,
    redirectTo?: string,
    onClose?: () => void
  ) => void;
  showYesNo: (
    message: string,
    onYesCallback?: () => void,
    onNoCallback?: () => void
  ) => Promise<boolean>;
  showWarning: (
    message: string,
    onYesCallback?: () => void,
    onNoCallback?: () => void
  ) => Promise<boolean>;
  hidePopup: () => void;
}

export const PopupProviderContext = createContext<
  PopupProviderContextType | undefined
>(undefined);

enum PopupType {
  NONE = "NONE",
  LOADING = "LOADING",
  SUCCESS = "SUCCESS",
  ERROR = "ERROR",
  YESNO = "YESNO",
  WARNING = "WARNING",
}

export function usePopup() {
  const context = useContext(PopupProviderContext);
  if (context === undefined) {
    throw new Error("usePopup must be used within a PopupProvider");
  }
  return context;
}

const PopupProvider = ({ children }: { children: React.ReactNode }) => {
  const [popupType, setPopupType] = useState<PopupType>(PopupType.NONE);
  const [message, setMessage] = useState<string | null>(null);
  const [redirectTo, setRedirectTo] = useState<string | null>(null);
  const [onClose, setOnClose] = useState<(() => void) | null>(null);

  const [onYes, setOnYes] = useState<(() => void) | null>(null);
  const [onNo, setOnNo] = useState<(() => void) | null>(null);
  // Keep a resolver for pending Yes/No prompts so callers can await the result
  const pendingResolveRef = useRef<((result: boolean) => void) | null>(null);

  function handleYesNo(
    msg: string,
    onYesCallback?: () => void,
    onNoCallback?: () => void,
    warning = false
  ) {
    setMessage(msg);
    return new Promise<boolean>((resolve) => {
      // store resolver for external dismissal (e.g., hidePopup)
      pendingResolveRef.current = resolve;
      // wire up click handlers
      setOnYes(() => () => {
        resolve(true);
        if (onYesCallback) onYesCallback();
        pendingResolveRef.current = null;
        // cleanup
        setPopupType(PopupType.NONE);
        setMessage(null);
        setOnYes(null);
        setOnNo(null);
      });
      setOnNo(() => () => {
        resolve(false);
        if (onNoCallback) onNoCallback();
        pendingResolveRef.current = null;

        // cleanup
        setPopupType(PopupType.NONE);
        setMessage(null);
        setOnYes(null);
        setOnNo(null);
      });
      setPopupType(warning ? PopupType.WARNING : PopupType.YESNO);
    });
  }

  const popupContextValue: PopupProviderContextType = {
    showLoading: (msg?: string) => {
      setMessage(msg || null);

      setPopupType(PopupType.LOADING);
    },
    showSuccess: (msg: string, redirectTo?: string, onClose?: () => void) => {
      setMessage(msg);
      setRedirectTo(redirectTo || null);
      setOnClose(onClose || null);

      setPopupType(PopupType.SUCCESS);
    },
    showError: (msg: string, redirectTo?: string, onClose?: () => void) => {
      setMessage(msg);
      setRedirectTo(redirectTo || null);
      setOnClose(onClose || null);

      setPopupType(PopupType.ERROR);
    },
    showYesNo: (
      msg: string,
      onYesCallback?: () => void,
      onNoCallback?: () => void
    ) => {
      return handleYesNo(msg, onYesCallback, onNoCallback, false);
    },
    showWarning: (
      msg: string,
      onYesCallback?: () => void,
      onNoCallback?: () => void
    ) => {
      return handleYesNo(msg, onYesCallback, onNoCallback, true);
    },
    hidePopup: () => {
      // If a Yes/No is pending and user programmatically hides the popup, resolve as false
      if (
        (popupType === PopupType.YESNO || popupType === PopupType.WARNING) &&
        pendingResolveRef.current
      ) {
        pendingResolveRef.current(false);
        pendingResolveRef.current = null;
      }
      setPopupType(PopupType.NONE);
      setMessage(null);
      setRedirectTo(null);
      setOnClose(null);
      setOnYes(null);
      setOnNo(null);
    },
  };

  return (
    <PopupProviderContext.Provider value={popupContextValue}>
      {popupType === PopupType.LOADING && (
        <LoadingPopup message={message || undefined} />
      )}
      {popupType === PopupType.SUCCESS && (
        <SuccessPopup
          message={message || undefined}
          onClose={() => {
            popupContextValue.hidePopup();
            if (onClose) onClose();
          }}
          redirectTo={redirectTo || undefined}
        />
      )}
      {popupType === PopupType.YESNO && (
        <YesNoPopup
          message={message || undefined}
          onYes={onYes || undefined}
          onNo={onNo || undefined}
        />
      )}
      {popupType === PopupType.WARNING && (
        <YesNoPopup
          message={message || undefined}
          onYes={onYes || undefined}
          onNo={onNo || undefined}
          warning
        />
      )}
      {popupType === PopupType.ERROR && (
        <ErrorPopup
          message={message || undefined}
          onClose={() => {
            popupContextValue.hidePopup();
            if (onClose) onClose();
          }}
          redirectTo={redirectTo || undefined}
        />
      )}
      {children}
    </PopupProviderContext.Provider>
  );
};

export default PopupProvider;
