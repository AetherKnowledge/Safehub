"use client";

import DateTimeSelector from "@/app/components/Input/Date/DateTimeSelector";
import TimeSelector from "@/app/components/Input/Date/TimeSelector";
import {
  getTimeFromDate,
  setTimeToDate,
  Time,
  TimePeriod,
} from "@/app/components/Input/Date/utils";
import ModalBase from "@/app/components/Popup/ModalBase";
import { usePopup } from "@/app/components/Popup/PopupProvider";
import { addMinutes } from "@/lib/client-utils";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FaRegEdit } from "react-icons/fa";
import {
  AppointmentData,
  checkForConflictingDate,
  rescheduleAppointment,
} from "../AppointmentActions";

const RescheduleButton = ({
  appointment,
}: {
  appointment: AppointmentData;
}) => {
  const [showModal, setShowModal] = useState(false);
  const [startTime, setStartTime] = useState<Date | undefined>(
    appointment?.startTime
  );
  const [endTime, setEndTime] = useState<Date | undefined>(
    appointment?.endTime || undefined
  );
  const statusPopup = usePopup();
  const router = useRouter();

  async function confirmReschedule() {
    if (!startTime) return;

    statusPopup.showLoading("Updating appointment...");

    if (!startTime) {
      statusPopup.showError("Please select a valid start time.");
      return;
    }

    if (!endTime) {
      statusPopup.showError("Please select a valid end time.");
      return;
    }

    const endDateTime = new Date(startTime);
    endDateTime.setHours(endTime.getHours());
    endDateTime.setMinutes(endTime.getMinutes());

    const conflicts = await checkForConflictingDate(
      startTime,
      endDateTime,
      appointment.id
    );

    if (conflicts && conflicts.length > 0) {
      const confirm = await statusPopup.showWarning(
        `The selected time conflicts with ${conflicts.length} existing appointment(s). Do you still want to proceed?`
      );
      if (!confirm) return;

      statusPopup.showLoading("Updating appointment...");
    }

    const result = await rescheduleAppointment(
      appointment.id,
      startTime,
      endDateTime
    );

    if (!result.success) {
      statusPopup.showError(result.message || "Failed to update appointment.");
      return;
    }

    statusPopup.showSuccess("Appointment updated successfully!");
    setShowModal(false);
    router.refresh();
  }

  return (
    <>
      <button
        className="flex flex-row btn gap-1 justify-center items-center btn-sm h-8"
        onClick={() => setShowModal(true)}
      >
        <FaRegEdit className="w-3 h-3" />
        Reschedule
      </button>
      {showModal && (
        <ModalBase onClose={() => setShowModal(false)}>
          <div className="flex flex-col bg-base-100 rounded-2xl shadow-2xl text-base-content max-w-lg overflow-hidden">
            {/* Header */}
            <div className="bg-linear-to-r from-primary/10 via-primary/5 to-primary/5 p-6">
              <h2 className="font-bold text-2xl text-primary">
                Reschedule Appointment
              </h2>
              <p className="text-sm text-base-content/70 mt-1">
                Select a new date and time
              </p>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto px-6 py-4">
              <div className="flex flex-col gap-4">
                <DateTimeSelector
                  name={`startTime-reschedule-${appointment.id}`}
                  horizontal
                  minDate="now"
                  minTime={{ hour: 8, minute: 0, period: TimePeriod.AM }}
                  maxTime={{ hour: 4, minute: 0, period: TimePeriod.PM }}
                  defaultValue={appointment?.startTime}
                  onChange={(date) => {
                    setStartTime(date);
                  }}
                  disableSunday
                  required
                />
                <TimeSelector
                  name={`endTime-reschedule-${appointment.id}`}
                  value={endTime ? getTimeFromDate(endTime) : undefined}
                  minTime={
                    startTime
                      ? getTimeFromDate(addMinutes(startTime, 60))
                      : { hour: 8, minute: 0, period: TimePeriod.AM }
                  }
                  maxTime={{ hour: 5, minute: 0, period: TimePeriod.PM }}
                  onChange={(time: Time) => {
                    setEndTime(setTimeToDate(new Date(), time));
                  }}
                />
              </div>
            </div>

            {/* Footer */}
            <div className="bg-base-200 border-t border-base-300 px-6 py-4">
              <div className="flex flex-row items-center justify-between gap-3">
                <button
                  className="btn btn-ghost"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button className="btn btn-primary" onClick={confirmReschedule}>
                  Confirm Reschedule
                </button>
              </div>
            </div>
          </div>
        </ModalBase>
      )}
    </>
  );
};

export default RescheduleButton;
