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
        <div className="flex max-w-200 min-h-0 max-h-150 overflow-y-auto py-2">
          <p className="mb-4">
            Lorem ipsum dolor sit amet consectetur adipisicing elit.
            Praesentium, dolore, repellendus ipsam exercitationem eveniet
            repudiandae at quaerat suscipit omnis assumenda iusto facere
            adipisci laboriosam dolores cupiditate officia fuga! Voluptatibus,
            cumque! Lorem ipsum dolor sit amet consectetur adipisicing elit.
            Provident facere quaerat similique qui, possimus eius autem aut modi
            at, optio vel dolorem harum deserunt commodi neque eligendi sequi,
            reprehenderit voluptate. Lorem ipsum dolor sit amet consectetur
            adipisicing elit. Explicabo quaerat doloribus beatae vero eaque quis
            magni laboriosam quam earum obcaecati sequi, aspernatur fuga
            veritatis? Velit porro qui veniam sint facere. Lorem ipsum dolor sit
            amet consectetur adipisicing elit. Officia eos quidem dolores iure
            reprehenderit officiis iusto doloribus itaque perferendis, ullam
            accusantium sequi optio nihil temporibus voluptatum vitae nesciunt
            culpa odit. Lorem ipsum dolor sit amet consectetur, adipisicing
            elit. Itaque sunt molestias, tenetur esse magnam voluptatum sint
            debitis corporis eveniet fuga cum ea accusantium perferendis
            praesentium cupiditate, quod quibusdam qui ex.
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
