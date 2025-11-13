"use client";

import { useState } from "react";
import ModalBase from "../Popup/ModalBase";

const TermsAndConditions = () => {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <div className="flex flex-row gap-2 items-center justify-center">
        <input
          name="termsAndConditions"
          type="checkbox"
          defaultChecked
          required
          className="checkbox checkbox-ghost checkbox-primary rounded"
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
        <h2 className="text-lg font-semibold mb-2">Terms and Conditions</h2>
        <p className="mb-4">Please read and accept our terms and conditions.</p>
        <button onClick={onClose} className="btn">
          Close
        </button>
      </div>
    </ModalBase>
  );
};

export default TermsAndConditions;
