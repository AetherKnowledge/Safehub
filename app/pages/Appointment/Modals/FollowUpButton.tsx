"use client";

import DateTimeSelector from "@/app/components/Input/Date/DateTimeSelector";
import TimeSelector from "@/app/components/Input/Date/TimeSelector";
import {
  Time,
  TimePeriod,
  getTimeFromDate,
  setTimeToDate,
} from "@/app/components/Input/Date/utils";
import TextArea from "@/app/components/Input/TextArea";
import ModalBase from "@/app/components/Popup/ModalBase";
import { usePopup } from "@/app/components/Popup/PopupProvider";
import { addMinutes } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FaRegCheckCircle, FaRegClipboard } from "react-icons/fa";
import {
  AppointmentData,
  checkForConflictingDate,
  createFollowUpAppointment,
} from "../AppointmentActions";
import CloseButton from "./CloseButton";

const FollowUpButton = ({ appointment }: { appointment: AppointmentData }) => {
  const [showModal, setShowModal] = useState(false);
  const [startTime, setStartTime] = useState<Date | undefined>();
  const [endTime, setEndTime] = useState<Date | undefined>();
  const [reason, setReason] = useState<string>("");

  const statusPopup = usePopup();
  const router = useRouter();

  async function handleSubmit() {
    statusPopup.showLoading("Creating follow up appointment...");

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

      statusPopup.showLoading("Creating follow up appointment...");
    }

    const result = await createFollowUpAppointment({
      appointmentId: appointment.id,
      startTime,
      endTime: endDateTime,
      reason,
    });

    if (!result.success) {
      statusPopup.showError(
        result.message || "Failed to create follow up appointment."
      );
      return;
    }

    statusPopup.showSuccess("Follow up appointment created successfully.");
    setShowModal(false);
    router.refresh();
  }

  return (
    <>
      <button
        className="flex flex-row btn btn-primary gap-1 justify-center items-center btn-sm h-8"
        onClick={() => setShowModal(true)}
      >
        <FaRegClipboard className="w-4 h-4" />
        Follow Up Appointment
      </button>
      {showModal && (
        <ModalBase onClose={() => setShowModal(false)}>
          <div className="bg-base-100 p-0 rounded-2xl shadow-2xl text-base-content max-w-2xl flex-1 flex flex-col overflow-hidden">
            <CloseButton onClick={() => setShowModal(false)} />

            {/* Header */}
            <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-primary/5 p-6 pb-4">
              <div className="flex flex-col gap-2">
                <h2 className="text-2xl font-bold text-primary">
                  Follow Up Appointment
                </h2>
                <p className="text-sm text-base-content/70">
                  Schedule a follow-up appointment for the student you
                  counseled.
                </p>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto px-6 py-4">
              <div className="flex flex-col w-full gap-4">
                <input
                  type="hidden"
                  name="appointmentId"
                  value={appointment.id}
                  readOnly
                />
                <TextArea
                  name="reason"
                  legend="Reason:"
                  placeholder="Enter session reason here..."
                  defaultValue={reason}
                  required
                  readonly={appointment.followUpId ? true : false}
                  onChange={setReason}
                />
                <DateTimeSelector
                  name={`startTime-followup-${appointment.id}`}
                  legend="Start Time"
                  minDate="now"
                  minTime={{ hour: 8, minute: 0, period: TimePeriod.AM }}
                  maxTime={{ hour: 7, minute: 0, period: TimePeriod.PM }}
                  onChange={(date) => {
                    setStartTime(date);
                  }}
                  required
                />
                <TimeSelector
                  name={`endTime-followup-${appointment.id}`}
                  legend="End Time"
                  value={endTime ? getTimeFromDate(endTime) : undefined}
                  minTime={
                    startTime
                      ? getTimeFromDate(addMinutes(startTime, 60))
                      : { hour: 8, minute: 0, period: TimePeriod.AM }
                  }
                  maxTime={{ hour: 8, minute: 0, period: TimePeriod.PM }}
                  onChange={(time: Time) => {
                    setEndTime(setTimeToDate(new Date(), time));
                  }}
                  required
                />
              </div>
            </div>

            {/* Footer */}
            {!appointment.followUpId && (
              <div className="bg-base-200 border-t border-base-300 px-6 py-4">
                <div className="flex justify-end">
                  <button
                    className="btn btn-primary gap-2"
                    onClick={handleSubmit}
                  >
                    <FaRegCheckCircle className="w-4 h-4" />
                    Submit
                  </button>
                </div>
              </div>
            )}
          </div>
        </ModalBase>
      )}
    </>
  );
};

export default FollowUpButton;
