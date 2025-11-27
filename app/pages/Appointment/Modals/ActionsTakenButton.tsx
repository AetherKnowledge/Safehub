"use client";

import TextArea from "@/app/components/Input/TextArea";
import ModalBase from "@/app/components/Popup/ModalBase";
import { usePopup } from "@/app/components/Popup/PopupProvider";
import { UserType } from "@/app/generated/prisma";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FaRegCheckCircle } from "react-icons/fa";
import { LuClipboardList } from "react-icons/lu";
import { AppointmentData, createActionsTaken } from "../AppointmentActions";
import CloseButton from "./CloseButton";
import UserTopBar from "./UserTopBar";

const ActionsTakenButton = ({
  appointment,
}: {
  appointment: AppointmentData;
}) => {
  const session = useSession();
  const [showModal, setShowModal] = useState(false);
  const statusPopup = usePopup();
  const router = useRouter();

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    const confirm = await statusPopup.showYesNo(
      `Are you sure you want to submit this session summary? This action cannot be undone.`
    );

    if (!confirm) {
      return;
    }

    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    statusPopup.showLoading("Submitting session summary...");
    const result = await createActionsTaken(formData);

    if (!result.success) {
      statusPopup.showError(
        result.message || "Failed to submit session summary."
      );
      return;
    }

    statusPopup.showSuccess("Session summary submitted successfully.");

    router.refresh();
  }

  const canSubmit =
    session?.data?.user.type === UserType.Counselor &&
    !appointment.actionsTaken;

  return (
    <>
      <button
        className="flex flex-row btn gap-1 justify-center items-center btn-sm bg-gray-100 text-black hover:bg-gray-300 active:bg-gray-400 h-8"
        onClick={() => setShowModal(true)}
      >
        <LuClipboardList className="w-4 h-4" />
        Session Summary
      </button>
      {showModal && (
        <ModalBase onClose={() => setShowModal(false)}>
          <div className="bg-base-100 p-0 rounded-2xl shadow-2xl text-base-content max-w-2xl w-full flex flex-col overflow-hidden">
            <CloseButton onClick={() => setShowModal(false)} />
            <form onSubmit={handleSubmit} className="flex flex-col h-full">
              {/* Header */}
              <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-primary/5 p-6 pb-4">
                {session?.data?.user.type === UserType.Counselor ? (
                  <div className="flex flex-col gap-2">
                    <h2 className="text-2xl font-bold text-primary">
                      Session Summary
                    </h2>
                    <p className="text-sm text-base-content/70">
                      Document the actions taken during the counseling session.
                    </p>
                  </div>
                ) : (
                  <UserTopBar
                    userEmail={appointment.counselor.user.email}
                    userName={appointment.counselor.user.name || undefined}
                    userImgSrc={appointment.counselor.user.image || undefined}
                    appointmentStatus={appointment.status}
                    chatId={appointment.chatId}
                  />
                )}
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
                  name="actionsTaken"
                  legend="Actions Taken:"
                  placeholder="Enter session actions here..."
                  defaultValue={appointment.actionsTaken || ""}
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
                      Create Report
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

export default ActionsTakenButton;
