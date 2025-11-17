"use client";

import Submit from "@/app/components/Forms/Submit";
import RadioBox from "@/app/components/Input/RadioBox";
import ModalBase from "@/app/components/Popup/ModalBase";
import { usePopup } from "@/app/components/Popup/PopupProvider";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  AppointmentData,
  cancelAppointmentStudent,
} from "../AppointmentActions";
import CancelButton from "./CancelButton";

const CancelButtonStudent = ({
  appointment,
}: {
  appointment: AppointmentData;
}) => {
  const [showPopup, setShowPopup] = useState(false);
  const router = useRouter();
  const statusPopup = usePopup();

  const handleCancel = async (formData: FormData) => {
    statusPopup.showLoading("Updating appointment...");

    const result = await cancelAppointmentStudent(formData);

    if (!result.success) {
      statusPopup.showError(result.message || "Failed to update appointment.");
      return;
    }

    statusPopup.showSuccess(`Appointment cancelled successfully`);
    router.refresh();
  };

  return (
    <>
      <CancelButton
        onCancel={() => {
          setShowPopup(true);
        }}
      />

      {showPopup && (
        <ModalBase className="p-4" onClose={() => setShowPopup(false)}>
          <div className="bg-base-100 p-8 rounded-lg shadow-lg text-center text-base-content w-full max-w-2xl">
            <form className="flex flex-col gap-4" action={handleCancel}>
              <div className="flex flex-col text-center gap-2">
                <h2 className="text-error text-2xl font-semibold">
                  Cancellation Form
                </h2>
                <p className="text-wrap text-base-content/70">
                  Choose an option below for the reason for cancelling. By
                  completing this form, you agree of voiding your appointment
                  request.
                </p>
              </div>
              <input
                type="hidden"
                name="appointmentId"
                value={appointment.id}
              />
              <RadioBox
                name="reason"
                legend="What are your reason for cancelling?"
                required
                options={[
                  {
                    label: "I have a schedule conflict or personal matter.",
                    value: "schedule_conflict",
                  },
                  {
                    label:
                      "My situation has been resolved / I no longer need the session.",
                    value: "situation_resolved",
                  },
                  {
                    label: "I want to change the selected counselor.",
                    value: "change_counselor",
                  },
                  {
                    label: "Other",
                    value: "other",
                    other: true,
                  },
                ]}
              />
              <Submit onBack={() => setShowPopup(false)} />
            </form>
          </div>
        </ModalBase>
      )}
    </>
  );
};

export default CancelButtonStudent;
