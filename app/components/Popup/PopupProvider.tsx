"use client";
import { createContext, useContext, useState } from "react";
import ErrorPopup from "./ErrorPopup";
import LoadingPopup from "./LoadingPopup";
import SuccessPopup from "./SuccessPopup";

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
  hidePopup: () => void;
}

export const PopupProviderContext = createContext<
  PopupProviderContextType | undefined
>(undefined);

enum PopupType {
  NONE,
  LOADING,
  SUCCESS,
  ERROR,
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
    hidePopup: () => {
      setPopupType(PopupType.NONE);
      setMessage(null);
      setRedirectTo(null);
      setOnClose(null);
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
