"use client";

import TextArea from "@/app/components/Input/TextArea";
import ModalBase from "@/app/components/Popup/ModalBase";
import { usePopup } from "@/app/components/Popup/PopupProvider";
import { UserType } from "@/app/generated/prisma";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { FaRegCheckCircle } from "react-icons/fa";
import { LuClipboardList } from "react-icons/lu";
import { AppointmentData, updateSummary } from "../AppointmentActions";
import CloseButton from "./CloseButton";

const SessionSummaryButton = ({
  appointment,
}: {
  appointment: AppointmentData;
}) => {
  const session = useSession();
  const [showModal, setShowModal] = useState(false);
  const statusPopup = usePopup();

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    statusPopup.showLoading("Submitting session summary...");
    const result = await updateSummary(formData);

    if (!result.success) {
      statusPopup.showError(
        result.message || "Failed to submit session summary."
      );
      return;
    }

    statusPopup.showSuccess("Session summary submitted successfully.");
  }

  return (
    <>
      <button
        className="flex flex-row btn gap-1 justify-center items-center btn-sm h-8"
        onClick={() => setShowModal(true)}
      >
        <LuClipboardList className="w-4 h-4" />
        Session Summary
      </button>
      {showModal && (
        <ModalBase onClose={() => setShowModal(false)}>
          <div className="bg-base-100 p-0 rounded-lg shadow-lg text-base-content max-w-2xl flex-1 flex flex-col">
            <CloseButton onClick={() => setShowModal(false)} />
            <form
              onSubmit={handleSubmit}
              className="flex flex-col items-center justify-center text-center p-6 pt-0 gap-6"
            >
              <div className="flex flex-col gap-2">
                <h2 className="text-2xl font-semibold text-primary">
                  Session Summary
                </h2>
                <p className="font-light">
                  {session?.data?.user.type === UserType.Counselor
                    ? "Answer the form based on your findings about the student you counseled."
                    : "Review the session summary provided by your counselor."}
                </p>
              </div>
              <div className="flex flex-col w-full gap-4">
                <input
                  type="hidden"
                  name="appointmentId"
                  value={appointment.id}
                  readOnly
                />
                <TextArea
                  name="summary"
                  legend="Summary:"
                  placeholder="Enter session summary here..."
                  defaultValue={appointment.summary || ""}
                  required
                />
                <TextArea
                  name="observations"
                  legend="Observations:"
                  placeholder="Enter observations here..."
                  defaultValue={appointment.observations || ""}
                />
                <TextArea
                  name="recommendations"
                  legend="Recommendations:"
                  placeholder="Enter recommendations here..."
                  defaultValue={appointment.recommendations || ""}
                />
              </div>
              {session?.data?.user.type === UserType.Counselor && (
                <button className="flex flex-row btn btn-primary gap-2 justify-center items-center text-center">
                  <FaRegCheckCircle className="w-4 h-4" />
                  Submit
                </button>
              )}
            </form>
          </div>
        </ModalBase>
      )}
    </>
  );
};

export default SessionSummaryButton;
