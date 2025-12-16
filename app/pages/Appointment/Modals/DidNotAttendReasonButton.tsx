"use client";

import TextArea from "@/app/components/Input/TextArea";
import ModalBase from "@/app/components/Popup/ModalBase";
import { usePopup } from "@/app/components/Popup/PopupProvider";
import { UserType } from "@/app/generated/prisma/browser";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FaQuestionCircle, FaRegCheckCircle } from "react-icons/fa";
import {
  AppointmentData,
  submitDidNotAttendReason,
} from "../AppointmentActions";
import CloseButton from "./CloseButton";

const DidNotAttendReasonButton = ({
  appointment,
}: {
  appointment: AppointmentData;
}) => {
  const [showModal, setShowModal] = useState(false);
  const session = useSession();
  const statusPopup = usePopup();
  const router = useRouter();

  const canSubmit =
    session?.data?.user.type === UserType.Student &&
    !appointment.didNotAttendReason;

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    const confirm = await statusPopup.showYesNo(
      "Are you sure you want to submit this reason? This action cannot be undone."
    );
    if (!confirm) {
      return;
    }
    statusPopup.showLoading("Submitting reason for not attending...");

    const result = await submitDidNotAttendReason(formData);
    if (!result.success) {
      statusPopup.showError(
        result.message || "Failed to submit reason for not attending."
      );
      return;
    }

    statusPopup.showSuccess("Reason for not attending submitted successfully.");
    router.refresh();
  }

  return (
    <>
      <button
        className="flex flex-row btn gap-1 justify-center items-center btn-sm bg-gray-100 text-black hover:bg-gray-300 active:bg-gray-400 h-8"
        onClick={() => setShowModal(true)}
      >
        <FaQuestionCircle className="w-4 h-4" />
        Reason
      </button>
      {showModal && (
        <ModalBase onClose={() => setShowModal(false)}>
          <div className="bg-base-100 p-0 rounded-2xl shadow-2xl text-base-content max-w-2xl w-full flex flex-col overflow-hidden">
            <CloseButton onClick={() => setShowModal(false)} />
            <form onSubmit={handleSubmit} className="flex flex-col h-full">
              {/* Header */}
              <div className="bg-linear-to-r from-primary/10 via-primary/5 to-primary/5 p-6 pb-4">
                <div className="flex flex-col gap-2">
                  <h2 className="text-2xl font-bold text-primary text-wrap">
                    Reason for not attending
                  </h2>
                  <p className="text-sm text-base-content/70 text-wrap">
                    {session?.data?.user.type === UserType.Student
                      ? "Please provide your reason for not attending the scheduled appointment."
                      : "View the reason provided by the student for not attending the scheduled appointment."}
                  </p>
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto px-6 py-4">
                <input
                  type="hidden"
                  name="appointmentId"
                  value={appointment.id}
                  readOnly
                />
                <TextArea
                  name="reason"
                  legend="Reason for Not Attending:"
                  placeholder="Enter your reason here..."
                  defaultValue={appointment.didNotAttendReason || ""}
                  required
                  readonly={!canSubmit}
                  answerOnly={!canSubmit}
                />
              </div>

              {/* Footer */}
              {canSubmit && (
                <div className="bg-base-200 border-t border-base-300 px-6 py-4">
                  <div className="flex justify-end">
                    <button className="btn btn-primary gap-2">
                      <FaRegCheckCircle className="w-4 h-4" />
                      Submit Reason
                    </button>
                  </div>
                </div>
              )}
            </form>
          </div>
        </ModalBase>
      )}
    </>
  );
};

export default DidNotAttendReasonButton;
