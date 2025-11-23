"use client";

import { useState } from "react";
import ModalBase from "../Popup/ModalBase";

const TermsAndConditions = ({ readOnly = false }: { readOnly?: boolean }) => {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <div className="flex flex-row gap-2 items-center justify-center">
        <input
          name="termsAndConditions"
          type="checkbox"
          required
          className="disabled:opacity-100 checkbox checkbox-ghost checkbox-primary rounded"
          defaultChecked={readOnly}
          disabled={readOnly}
        />
        <div className="flex flex-col text-base-content">
          I agree with the Terms & Conditions of Safehub{" "}
          <span className="text-sm text-base-content/70">
            Read our terms & conditions{" "}
            <span
              className="text-primary cursor-pointer"
              onClick={() => setShowModal(true)}
            >
              here...
            </span>
          </span>
        </div>
      </div>

      {showModal && (
        <TermsAndConditionsModal onClose={() => setShowModal(false)} />
      )}
    </>
  );
};

const TermsAndConditionsModal = ({ onClose }: { onClose?: () => void }) => {
  return (
    <ModalBase onClose={onClose}>
      <div className="bg-white p-4 rounded shadow-md text-base-content">
        <h2 className="text-lg font-semibold mb-2 ">Terms and Conditions</h2>
        <div className="flex min-h-0 max-h-200 overflow-y-auto">
          <p className="mb-4">
            Please read and accept our terms and conditions.
          </p>
        </div>
        <button onClick={onClose} className="btn">
          Close
        </button>
      </div>
    </ModalBase>
  );
};

export default TermsAndConditions;
