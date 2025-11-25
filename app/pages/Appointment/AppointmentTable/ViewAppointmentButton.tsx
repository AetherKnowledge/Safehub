"use client";

import { SessionPreference } from "@/app/generated/prisma";
import { AppointmentData } from "@/app/pages/Appointment/AppointmentActions";
import { useState } from "react";
import ViewModal from "./ViewModal";

const ViewAppointmentButton = ({
  appointment,
}: {
  appointment: AppointmentData;
}) => {
  const [showModal, setShowModal] = useState(false);
  return (
    <>
      <button
        className="flex flex-row btn btn-info gap-1 justify-center items-center btn-sm h-8"
        onClick={() => setShowModal(true)}
      >
        View
      </button>
      {showModal && (
        <ViewModal
          appointment={appointment}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
};

export const PreferenceBadge = ({
  preference,
}: {
  preference: SessionPreference;
}) => {
  return (
    <div className="badge bg-gray-100 text-black rounded-sm">
      {preference === SessionPreference.Either && "Either"}
      {preference === SessionPreference.InPerson && "In-Person Meeting"}
      {preference === SessionPreference.Online && "Online Meeting"}
    </div>
  );
};

export default ViewAppointmentButton;
